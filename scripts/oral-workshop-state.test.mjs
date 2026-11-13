import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWorkshopState, emptyWorkshopState, elapsedPracticeMs, formatPracticeTime } from '../src/scripts/oral-workshop-state.ts';
const valid = new Set(['chess:0', 'chess:1', 'music:0']);
const draft = { fields:{question:'Ma question personnelle ?',sources:'Auteur réel, référence consultée',notes:'',responses:'Je distingue corrélation et cause.'},completed:['question','sources'],elapsedMs:65200,targetMinutes:10,updatedAt:'2026-11-13T12:00:00.000Z' };
test('un brouillon et ses étapes survivent à une sérialisation/relecture',()=>{
 const state={version:1,selected:'chess:1',drafts:{'chess:1':draft,'music:0':{...draft,fields:{question:'Une autre fiche'}}}};
 assert.deepEqual(parseWorkshopState(JSON.stringify(state),valid),state);
});
test('l’évolution du catalogue ignore les anciens sujets sans perdre les sujets connus',()=>{
 const state=parseWorkshopState(JSON.stringify({version:1,selected:'retired:0',drafts:{'retired:0':draft,'chess:1':draft}}),valid);
 assert.equal(state.selected,'chess:0');assert.deepEqual(Object.keys(state.drafts),['chess:1']);
});
test('les champs inconnus et états invalides ne deviennent pas des données exécutables',()=>{
 const state=parseWorkshopState(JSON.stringify({version:1,selected:'chess:0',drafts:{'chess:0':{...draft,fields:{...draft.fields,html:'<script>alert(1)</script>'},completed:['question','question','invented',9],elapsedMs:-3,targetMinutes:999}}}),valid);
 assert.equal(state.drafts['chess:0'].fields.html,undefined);assert.deepEqual(state.drafts['chess:0'].completed,['question']);assert.equal(state.drafts['chess:0'].elapsedMs,0);assert.equal(state.drafts['chess:0'].targetMinutes,60);
});
test('un format illisible ou trop volumineux est signalé au lieu d’être écrasé',()=>{
 assert.throws(()=>parseWorkshopState('{broken',valid));
 assert.throws(()=>parseWorkshopState(JSON.stringify({version:8,drafts:{}}),valid));
 assert.throws(()=>parseWorkshopState(JSON.stringify({version:1,drafts:{'chess:0':{...draft,fields:{question:'x'.repeat(20001)}}}}),valid));
});
test('un champ explicitement vidé reste vide et ne récupère pas le modèle',()=>{
 const value=parseWorkshopState(JSON.stringify({version:1,selected:'chess:0',drafts:{'chess:0':{...draft,fields:{question:''}}}}),valid);
 assert.equal(value.drafts['chess:0'].fields.question,'');
});
test('le chronomètre tient compte du temps écoulé même si les rafraîchissements sont suspendus',()=>{
 assert.equal(elapsedPracticeMs(10000,1000,61000),70000);assert.equal(formatPracticeTime(70000),'01:10');
 assert.equal(elapsedPracticeMs(10000,null,999999),10000);assert.equal(elapsedPracticeMs(10000,1000,900),10000);
 assert.equal(formatPracticeTime(3600000),'60:00');
});
test('un nouvel atelier ne contient aucun faux brouillon',()=>assert.deepEqual(emptyWorkshopState('chess:0'),{version:1,selected:'chess:0',drafts:{}}));
