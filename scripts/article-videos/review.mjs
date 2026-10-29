import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import {options,atomic} from './common.mjs';
const args=options(),out=path.resolve(args.out||'media/article-videos'),qa=path.resolve(args.qa||'work/article-videos/qa');
const cards=JSON.parse(await fs.readFile(path.join(out,'storyboards.json'),'utf8')).filter(c=>!args.id||c.slug===args.id).slice(0,Number(args.limit||Infinity));
await fs.mkdir(qa,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.ARTICLE_VIDEO_CHROME||process.env.PINTEREST_CHROME||puppeteer.executablePath(),headless:true,protocolTimeout:60000,args:['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files']});
const report=[];
try{const page=await browser.newPage();await page.setViewport({width:1920,height:1080});
 for(const card of cards){
  const errors=[],parts=[];const errorListener=e=>errors.push(String(e));page.on('pageerror',errorListener);
  await page.goto(pathToFileURL(path.join(out,card.html)).href+'?export=1');await page.evaluate(()=>window.ready);
  for(const [i,scene]of card.scenes.entries()){
   for(const offset of [1.5,scene.duration/2,scene.duration-.6]){
    const state=await page.evaluate(t=>window.renderAt(t),scene.start+offset);if(state.overflow)errors.push(...state.issues);
   }
   const data=await page.evaluate(t=>{window.renderAt(t);return document.querySelector('canvas').toDataURL('image/jpeg',.93).split(',')[1]},scene.start+scene.duration/2);
   const bytes=Buffer.from(data,'base64');if(args.frames)await fs.writeFile(path.join(qa,`${card.slug}-${i+1}.jpg`),bytes);
   parts.push({input:await sharp(bytes).resize(640,360).toBuffer(),left:(i%2)*640,top:Math.floor(i/2)*360});
  }
  page.off('pageerror',errorListener);
  await sharp({create:{width:1280,height:Math.ceil(parts.length/2)*360,channels:3,background:'#f6f5f1'}}).composite(parts).jpeg({quality:90}).toFile(path.join(qa,card.slug+'.jpg'));
  if((report.length+1)%10===0)console.log(`Reviewed ${report.length+1}/${cards.length}`);
  report.push({slug:card.slug,layoutSignature:card.compositionSignature,duration:card.duration,errors:[...new Set(errors)]});
 }
}finally{let timer;try{await Promise.race([browser.close().catch(()=>{}),new Promise(resolve=>{timer=setTimeout(()=>{browser.process()?.kill('SIGKILL');resolve()},5000)})])}finally{clearTimeout(timer)}}
await atomic(path.join(qa,'report.json'),JSON.stringify({checkedAt:new Date().toISOString(),checked:report.length,failed:report.filter(r=>r.errors.length).length,results:report},null,2)+'\n');
const failed=report.filter(r=>r.errors.length);console.log(JSON.stringify({checked:report.length,failed},null,2));if(failed.length)process.exitCode=1;
