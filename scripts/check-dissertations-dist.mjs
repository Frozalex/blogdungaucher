/** Vérifie les pages et les références publiques de la file des 100 dissertations. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function checkDissertationOutput(plan, outputRoot, now = new Date()) {
  const errors=[];
  const future=plan.entries.filter(row=>Date.parse(row.publishAt)>now.getTime());
  const due=plan.entries.filter(row=>row.status==='ready' && Date.parse(row.publishAt)<=now.getTime());
  for(const row of due) {
    if(!fs.existsSync(path.join(outputRoot,'fr/dissertations',row.slug,'index.html'))) errors.push(`Dissertation arrivée à échéance mais absente : ${row.slug}.`);
  }
  function visit(dir) {
    if(!fs.existsSync(dir)) {errors.push(`Dossier de sortie absent : ${dir}.`);return;}
    for(const item of fs.readdirSync(dir,{withFileTypes:true})) {
      const file=path.join(dir,item.name);
      if(item.isDirectory()){visit(file);continue;}
      if(!/\.(?:html|xml|json|txt)$/i.test(item.name))continue;
      const content=fs.readFileSync(file,'utf8');
      for(const row of future) if(content.includes(row.slug)||content.includes(row.title)) errors.push(`Dissertation exposée avant sa date : ${row.slug} dans ${path.relative(outputRoot,file)}.`);
    }
  }
  visit(outputRoot);
  for(const row of future) if(fs.existsSync(path.join(outputRoot,'fr/dissertations',row.slug,'index.html'))) errors.push(`Page future générée : ${row.slug}.`);
  return {errors,due:due.length,hidden:future.length};
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  const outArg=process.argv.find(a=>a.startsWith('--out='));
  const atArg=process.argv.find(a=>a.startsWith('--at='));
  const now=atArg?new Date(atArg.slice(5)):new Date();
  if(!Number.isFinite(now.getTime())) throw new Error('Date de contrôle invalide.');
  const plan=JSON.parse(fs.readFileSync(path.join(root,'docs/dissertations-100/programmes.json'),'utf8'));
  const result=checkDissertationOutput(plan,outArg?path.resolve(outArg.slice(6)):path.join(root,'dist'),now);
  if(result.errors.length){console.error(result.errors.join('\n'));process.exitCode=1;}
  else console.log(`Dissertations : ${result.due} texte(s) arrivé(s) à échéance présent(s), ${result.hidden} créneau(x) futur(s) sans exposition publique.`);
}
