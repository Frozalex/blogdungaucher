import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';

const cards=JSON.parse(await fs.readFile('scripts/pinterest/video-storyboards.json'));
const output='work/pinterest-media/audio-qa.json',results=[];
let cursor=0;
async function inspect(card){
 const file=`public/pinterest-media/video/${card.id}.mp4`;
 const log=await new Promise((resolve,reject)=>{
  const child=spawn('ffmpeg',['-hide_banner','-nostats','-i',file,'-vn','-af','ebur128=peak=true,silencedetect=noise=-50dB:d=3','-f','null','-'],{stdio:['ignore','ignore','pipe']});
  let text='';child.stderr.on('data',b=>text+=b);child.on('error',reject);child.on('exit',code=>code===0?resolve(text):reject(Error(card.id+': '+text.slice(-1000))));
 });
 const summary=log.slice(log.lastIndexOf('Summary:'));
 const integrated=Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]);
 const peak=Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]);
 const silence=[...log.matchAll(/silence_duration:\s+([\d.]+)/g)].map(m=>Number(m[1]));
 const problems=[];
 if(!Number.isFinite(integrated)||integrated< -20||integrated> -16)problems.push('Loudness outside expected range');
 if(!Number.isFinite(peak)||peak> -0.5)problems.push('Peak above expected ceiling');
 if(silence.some(t=>t>=3)||/silence_start:/.test(log))problems.push('Unexpected prolonged silence');
 const sha256=createHash('sha256').update(await fs.readFile(file)).digest('hex');
 return {id:card.id,sha256,integratedLufs:integrated,truePeakDb:peak,problems};
}
await Promise.all(Array.from({length:3},async()=>{while(cursor<cards.length){const card=cards[cursor++];results.push(await inspect(card));if(results.length%30===0)console.log(`${results.length}/243 soundtracks checked`);}}));
results.sort((a,b)=>a.id.localeCompare(b.id));
await fs.writeFile(output,JSON.stringify({checkedAt:new Date().toISOString(),count:results.length,results},null,2)+'\n');
const failed=results.filter(r=>r.problems.length);console.log(JSON.stringify({checked:results.length,failed,minLufs:Math.min(...results.map(r=>r.integratedLufs)),maxLufs:Math.max(...results.map(r=>r.integratedLufs)),maxPeakDb:Math.max(...results.map(r=>r.truePeakDb))}));
if(failed.length)process.exitCode=1;
