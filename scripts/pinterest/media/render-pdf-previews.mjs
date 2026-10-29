import fs from 'node:fs/promises';import {spawn}from'node:child_process';import path from'node:path';import sharp from'sharp';
const data=JSON.parse(await fs.readFile('work/pinterest-media/data.json')),cards=data.filter(c=>c.format==='pdf');
const run=(cmd,args)=>new Promise((resolve,reject)=>{const p=spawn(cmd,args,{stdio:['ignore','ignore','pipe']});let err='';p.stderr.on('data',d=>err+=d);p.on('exit',code=>code===0?resolve():reject(Error(err)));});
let cursor=0,done=0;await fs.mkdir('work/pinterest-media/pdf-qa',{recursive:true});
async function worker(){while(cursor<cards.length){const c=cards[cursor++],prefix=path.resolve('work/pinterest-media/pdf-qa',c.id);await run('pdftoppm',['-scale-to-x','1000','-scale-to-y','-1','-jpeg',`public/pinterest-media/pdf/${c.id}.pdf`,prefix]);
 await sharp(prefix+'-1.jpg').resize(1000,1500,{fit:'contain',background:'#f6f5f1'}).jpeg({quality:90}).toFile(`public/pinterest-media/covers/${c.id}.jpg`);done++;if(done%25===0||done===cards.length)console.log(`[pdf-preview] ${done}/${cards.length}`);}}
await Promise.all(Array.from({length:4},worker));
