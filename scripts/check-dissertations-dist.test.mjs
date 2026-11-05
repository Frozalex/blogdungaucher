import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkDissertationOutput} from './check-dissertations-dist.mjs';
const plan={entries:[{slug:'premier-texte',title:'Une question originale ?',publishAt:'2026-11-03T06:00:00Z',status:'ready'}]};
function fixture(t,files={}){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dissertation-dist-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));for(const[file,body]of Object.entries(files)){const dest=path.join(dir,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,body);}return dir;}
test('le mardi avant 06 h UTC reste masqué',t=>{const dir=fixture(t,{'index.html':'Rien de programmé ici'});assert.deepEqual(checkDissertationOutput(plan,dir,new Date('2026-11-03T05:59:59Z')).errors,[]);});
test('une page future est refusée même sans titre ni lien',t=>{const dir=fixture(t,{'fr/dissertations/premier-texte/index.html':'contenu'});assert(checkDissertationOutput(plan,dir,new Date('2026-11-03T05:59:59Z')).errors.some(e=>e.includes('Page future')));});
test('un titre futur dans le sommaire est refusé',t=>{const dir=fixture(t,{'fr/dissertations/index.html':'Une question originale ?'});assert(checkDissertationOutput(plan,dir,new Date('2026-11-02T12:00:00Z')).errors.some(e=>e.includes('exposée')));});
test('un lien futur dans le sitemap est refusé',t=>{const dir=fixture(t,{'sitemap.xml':'<loc>/fr/dissertations/premier-texte/</loc>'});assert(checkDissertationOutput(plan,dir,new Date('2026-11-02T12:00:00Z')).errors.some(e=>e.includes('sitemap.xml')));});
test('à 06 h UTC la page devient requise',t=>{const dir=fixture(t);assert(checkDissertationOutput(plan,dir,new Date('2026-11-03T06:00:00Z')).errors.some(e=>e.includes('absente')));fs.mkdirSync(path.join(dir,'fr/dissertations/premier-texte'),{recursive:true});fs.writeFileSync(path.join(dir,'fr/dissertations/premier-texte/index.html'),'Une question originale ?');assert.deepEqual(checkDissertationOutput(plan,dir,new Date('2026-11-03T06:00:00Z')).errors,[]);});
