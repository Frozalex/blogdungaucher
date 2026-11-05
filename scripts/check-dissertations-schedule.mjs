/** Vérifie les dates actives et les sujets volontairement laissés en pause. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function validateSchedule(plan, readContent, {requireComplete=false,initialDeployment=false,now=new Date()}={}) {
 const errors=[], rows=plan.entries??[], slugs=new Set(); let complete=0,slot=0;
 if(rows.length!==(plan.projectTotal??100)) errors.push('Nombre de textes incohérent avec le calendrier.');
 const first=Date.parse(`${plan.firstDate}T06:00:00Z`);
 if(!Number.isFinite(first)||new Date(first).getUTCDay()!==2) errors.push('Le début doit être un mardi.');
 for(const [i,row] of rows.entries()) {
  if(row.number!==i+1) errors.push(`Numéro incohérent : ${row.slug}.`);
  if(!row.slug||slugs.has(row.slug)||(plan.existingDissertations??[]).includes(row.slug)) errors.push(`Slug invalide : ${row.slug}.`);
  slugs.add(row.slug); const content=readContent(row.slug);
  if(row.status==='deferred') {
   if(row.publishAt||row.publishDate||row.scheduledOrder||content!==null) errors.push(`Sujet en pause avec publication active : ${row.slug}.`);
   continue;
  }
  const expected=new Date(first+slot++*7*86400000).toISOString().replace('.000Z','Z');
  if(row.publishAt!==expected||row.publishDate!==expected.slice(0,10)||row.scheduledOrder!==slot) errors.push(`Créneau incorrect : ${row.slug}, attendu ${expected}.`);
  if(row.status!=='ready'||content===null) {errors.push(`Texte programmé non prêt : ${row.slug}.`);continue;}
  if(content.match(/^publishDate:\s*["']([^"']+)["']/m)?.[1]!==expected) errors.push(`Date du texte incorrecte : ${row.slug}.`);
  const movements=[...content.matchAll(/<section class="dissertation-movement" aria-label="([^"]+)">/g)].map(m=>m[1]);
  if(JSON.stringify(movements)!==JSON.stringify(['Introduction','Thèse','Antithèse','Prise de position personnelle','Conclusion'])) errors.push(`Forme académique incomplète : ${row.slug}.`);
  complete++;
 }
 if(slot!==plan.scheduledCount||rows.length-slot!==plan.deferredCount) errors.push('Comptes de programmation incohérents.');
 if(slot && plan.lastDate!==new Date(first+(slot-1)*7*86400000).toISOString().slice(0,10)) errors.push('Dernière date incohérente.');
 if(initialDeployment&&now.getTime()>=first) errors.push('Publication initiale rétroactive interdite. Reprogrammer au prochain mardi.');
 if(requireComplete&&complete!==100) errors.push(`${complete}/100 textes prêts ; le projet complet reste en pause.`);
 return {errors,complete,planned:rows.length,deferred:rows.length-slot};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const plan=JSON.parse(fs.readFileSync(path.join(root,'docs/dissertations-100/programmes.json'),'utf8'));
 const result=validateSchedule(plan,slug=>{const p=path.join(root,'src/content/dissertations',`${slug}.md`);return fs.existsSync(p)?fs.readFileSync(p,'utf8'):null;},{requireComplete:process.argv.includes('--require-complete'),initialDeployment:process.argv.includes('--initial-deployment')});
 if(result.errors.length){console.error(result.errors.join('\n'));process.exitCode=1;}
 else console.log(`Calendrier vérifié : ${result.complete} textes programmés du ${plan.firstDate} au ${plan.lastDate}, chaque mardi à 06:00 UTC ; ${result.deferred} sujets en pause.`);
}
