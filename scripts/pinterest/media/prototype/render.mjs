import fs from 'node:fs/promises';
import {brandAnimation} from '../branding.mjs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import puppeteer from 'puppeteer';

const out=path.resolve(process.argv.find(x=>x.startsWith('--out='))?.slice(6)||'work/pinterest-media/prototype');
const source=path.resolve('scripts/pinterest/media/prototype');
const fps=24;
await fs.mkdir(path.join(out,'assets'),{recursive:true});
for(const name of ['studio-regular.ttf','studio-bold.ttf','FONT-LICENSE.txt'])await fs.copyFile('public/pinterest-media/assets/'+name,path.join(out,'assets',name));
await fs.copyFile('public/images/blog/biais-de-confirmation-aux-echecs-hero.webp',path.join(out,'assets/hero.webp'));
await fs.writeFile(path.join(out,'animation.html'),brandAnimation(await fs.readFile(path.join(source,'animation.html'),'utf8')));
const browser=await puppeteer.launch({executablePath:process.env.PINTEREST_CHROME||puppeteer.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files']});
let encoder;
try{
 const page=await browser.newPage();await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(path.join(out,'animation.html')).href+'?export=1');await page.evaluate(()=>window.ready);
 const duration=await page.evaluate(()=>window.duration);
 const frames=Math.ceil(duration*fps),temp=path.join(out,'film.part.mp4');
 encoder=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-vcodec','mjpeg','-i','pipe:0','-i',path.join(out,'soundtrack.m4a'),'-map','0:v:0','-map','1:a:0','-t',String(duration),'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-threads','4','-c:a','copy','-movflags','+faststart',temp],{stdio:['pipe','ignore','pipe']});
 let stderr='';encoder.stderr.on('data',d=>stderr+=d);const finished=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('exit',code=>code===0?resolve():reject(Error(stderr)))});
 for(let i=0;i<frames;i++){
  const result=await page.evaluate(t=>{const state=window.renderAt(t);return {state,jpeg:document.querySelector('canvas').toDataURL('image/jpeg',.95).split(',')[1]};},i/fps);
  if(result.state.overflow)throw Error('Text outside frame at '+i/fps+': '+result.state.issues.join(', '));
  if(!encoder.stdin.write(Buffer.from(result.jpeg,'base64')))await once(encoder.stdin,'drain');
  if(i%120===0)console.log(`Rendering ${Math.round(i/frames*100)}% (${(i/fps).toFixed(1)}s / ${duration.toFixed(1)}s)`);
 }
 encoder.stdin.end();await finished;if(errors.length)throw Error(errors.join('\n'));
 await fs.rename(temp,path.join(out,'film.mp4'));
 for(const [name,t] of [['poster',2.5],['scene-2',10],['scene-3',17],['scene-4',25],['scene-5',36],['scene-6',42]]){await page.evaluate(t=>window.renderAt(t),t);await page.screenshot({path:path.join(out,name+'.jpg'),type:'jpeg',quality:92});}
 await fs.writeFile(path.join(out,'render-validation.json'),JSON.stringify({duration,frames,fps,width:1080,height:1920,textOverflow:false,browserErrors:errors,source:'biais-de-confirmation-aux-echecs',sound:'Original instrumental music and effects, no voice'},null,2));
 console.log('Rendered prototype: '+path.join(out,'film.mp4'));
}finally{if(encoder&&!encoder.stdin.destroyed)encoder.stdin.destroy();await browser.close();}
