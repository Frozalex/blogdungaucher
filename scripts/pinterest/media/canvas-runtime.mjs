/** Execute this repository's Canvas2D studio locally. No browser, DOM engine or network. */
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';

export const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const require=createRequire(import.meta.url);
const registeredFonts=new Map();

export async function createCanvasAnimation({root=process.cwd(),card,html,canvasModule}){
 if(!canvasModule||!path.isAbsolute(canvasModule))throw Error('An explicit absolute Canvas module path is required');
 const backend=require(canvasModule),packageInfo=require(path.join(canvasModule,'package.json'));
 if(packageInfo.name!=='@napi-rs/canvas')throw Error('Expected the @napi-rs/canvas backend');
 if(card.approvedPrototype)throw Error('The approved prototype uses a separate renderer and is not supported');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 if(scripts.length!==1||/<script\s+[^>]*src=/i.test(html))throw Error('Expected one inline studio script');
 const code=scripts[0][1],match=code.match(/^const card=(.+);$/m);
 if(!match||JSON.stringify(JSON.parse(match[1]))!==JSON.stringify(card))throw Error('The HTML does not embed the selected storyboard exactly');
 if(!/^[a-z0-9-]+$/.test(card.id)||!Array.isArray(card.scenes)||card.scenes.some(scene=>!Number.isFinite(scene.duration)||scene.duration<=0))throw Error('Invalid storyboard timeline');
 const assetRoot=path.join(root,'public/pinterest-media/assets'),fontHashes={};
 for(const weight of ['regular','bold']){
  const file=path.join(assetRoot,`studio-${weight}.ttf`),bytes=await fs.readFile(file),hash=digest(bytes);fontHashes[weight]=hash;
  if(registeredFonts.has(weight)&&registeredFonts.get(weight)!==hash)throw Error('Studio font changed within this process; start a new renderer');
  if(!registeredFonts.has(weight)){if(!backend.GlobalFonts.register(bytes,'Studio'))throw Error('Unable to load Studio '+weight);registeredFonts.set(weight,hash)}
 }
 const imageInputs=[];
 const imageSrc=Object.getOwnPropertyDescriptor(backend.Image.prototype,'src');
 class LocalImage extends backend.Image{
  set src(value){
   if(typeof value!=='string')throw Error('Unexpected image source');
   let bytes;
   if(/^data:image\/svg\+xml;base64,[a-zA-Z0-9+/=]+$/.test(value))bytes=Buffer.from(value.slice(value.indexOf(',')+1),'base64');
   else{
    const expected='../assets/illustrations/'+card.slug+'.webp';
    if(value!==expected||!/^[a-z0-9-]+$/.test(card.slug))throw Error('Only the selected local illustration is allowed');
    bytes=require('node:fs').readFileSync(path.join(assetRoot,'illustrations',card.slug+'.webp'));
   }
   imageInputs.push({source:value.startsWith('data:')?'embedded-svg':value,sha256:digest(bytes)});
   imageSrc.set.call(this,bytes);
  }
  get src(){return imageSrc.get.call(this)}
 }
 const canvas=backend.createCanvas(1080,1920);
 const controls=new Map(['#sound','#play','#seek','#restart','#time'].map(key=>[key,{textContent:'',value:0,currentTime:0,pause(){},async play(){throw Error('Audio playback is not supported during frame generation')}}]));
 const document={
  querySelector(selector){if(selector==='#film'||selector==='canvas')return canvas;if(controls.has(selector))return controls.get(selector);throw Error('Unsupported DOM selector: '+selector)},
  documentElement:{classList:{add(value){if(value!=='export')throw Error('Unsupported document class')}}},
  fonts:{async load(value){if(!/^(700|400) \d+px Studio$/.test(value))throw Error('Unexpected requested font');return []}},
 };
 const window={};
 const context=vm.createContext({window,document,Image:LocalImage,URLSearchParams,location:{search:'?export=1'},Intl,console,requestAnimationFrame(){throw Error('Realtime animation is disabled; renderAt must select every frame explicitly')}},{codeGeneration:{strings:false,wasm:false}});
 new vm.Script(code,{filename:'pinterest-studio-local-canvas.js'}).runInContext(context,{timeout:5000});
 await window.ready;
 const duration=window.duration;
 if(!Number.isFinite(duration)||duration<40||duration>90||Math.abs(duration-card.duration)>.001)throw Error('The animation timeline differs from the storyboard');
 const provenance={backend:packageInfo.name,backendVersion:packageInfo.version,width:1080,height:1920,htmlSha256:digest(html),storyboardSha256:digest(JSON.stringify(card)),fonts:fontHashes,images:imageInputs};
 return {
  canvas,duration,provenance,
  draw(time){if(!Number.isFinite(time)||time<0||time>duration)throw Error('Frame time outside the animation');const state=window.renderAt(time);if(state.overflow)throw Error('Text overflow: '+state.issues.join('; '));return JSON.parse(JSON.stringify(state))},
  async jpeg(quality=93){return canvas.encode('jpeg',quality)},
  async png(){return canvas.encode('png')},
 };
}
