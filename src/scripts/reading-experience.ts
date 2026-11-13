import {emptyReadingState,normalizeReadingState,READING_KEY,safeReadingPath,type ReadingState} from '../utils/reading-state';
import {trackEngagement} from './engagement';
const copy={
 fr:{save:'Lire plus tard ♡',saved:'Lecture gardée ♥',done:'Lecture terminée ✓',undo:'Marquer comme non lu',remove:'Retirer',stored:'Enregistré sur cet appareil.',session:'Stockage indisponible : ces repères resteront seulement pendant cette visite.',clear:'Effacer toutes les lectures gardées, les positions de lecture et les étapes terminées sur cet appareil ?',cleared:'Tes repères ont été effacés.',resume:'Reprendre',step:'Étape terminée',steps:'étapes terminées'},
 en:{save:'Read later ♡',saved:'Saved reading ♥',done:'Finished reading ✓',undo:'Mark as unread',remove:'Remove',stored:'Saved on this device.',session:'Storage unavailable: bookmarks will only remain during this visit.',clear:'Clear all saved reading, reading positions and completed steps on this device?',cleared:'Your reading data has been cleared.',resume:'Resume',step:'Step completed',steps:'steps completed'},
 'pt-br':{save:'Ler mais tarde ♡',saved:'Leitura guardada ♥',done:'Leitura concluída ✓',undo:'Marcar como não lido',remove:'Retirar',stored:'Salvo neste aparelho.',session:'Armazenamento indisponível: os registros ficam apenas nesta visita.',clear:'Apagar todas as leituras guardadas, posições e etapas concluídas neste aparelho?',cleared:'Seus registros foram apagados.',resume:'Retomar',step:'Etapa concluída',steps:'etapas concluídas'},
 nl:{save:'Later lezen ♡',saved:'Lezing bewaard ♥',done:'Uitgelezen ✓',undo:'Markeren als ongelezen',remove:'Verwijderen',stored:'Opgeslagen op dit apparaat.',session:'Opslag niet beschikbaar: gegevens blijven alleen tijdens dit bezoek bewaard.',clear:'Alle bewaarde teksten, leesposities en voltooide stappen op dit apparaat wissen?',cleared:'Je leesgegevens zijn gewist.',resume:'Verder lezen',step:'Stap voltooid',steps:'stappen voltooid'}
};
let memory:ReadingState=emptyReadingState();let persistent=true;
function load(){try{const raw=localStorage.getItem(READING_KEY);if(raw)memory=normalizeReadingState(JSON.parse(raw));}catch{persistent=false;}return memory;}
function save(state:ReadingState){memory=normalizeReadingState(state);try{localStorage.setItem(READING_KEY,JSON.stringify(memory));persistent=true;}catch{persistent=false;}return persistent;}
let cleanup:(()=>void)|undefined;
function init(){
 cleanup?.();const controller=new AbortController(),{signal}=controller;
 const lang=(document.documentElement.lang.toLowerCase() in copy?document.documentElement.lang.toLowerCase():'fr') as keyof typeof copy,L=copy[lang];
 load();let timer:ReturnType<typeof setTimeout>|undefined;
 const tools=document.querySelector<HTMLElement>('[data-reading-tools]');
 const current=tools&&safeReadingPath(tools.dataset.readingUrl);
 const title=tools?.dataset.readingTitle||document.querySelector('h1')?.textContent?.trim()||document.title;
 const saveButton=tools?.querySelector<HTMLButtonElement>('[data-save-reading]'),doneButton=tools?.querySelector<HTMLButtonElement>('[data-complete-reading]'),resume=tools?.querySelector<HTMLAnchorElement>('[data-resume-reading]');
 const notice=(text:string)=>{const el=document.querySelector('[data-reading-status],[data-library-status]');if(el)el.textContent=text;};
 const notifySave=()=>notice(persistent?L.stored:L.session);
 function render(){
  const state=load();
  if(current){const saved=state.saved.some(s=>s.url===current),complete=state.completed.includes(current);if(saveButton){saveButton.hidden=false;saveButton.textContent=saved?L.saved:L.save;saveButton.setAttribute('aria-pressed',String(saved));}if(doneButton){doneButton.hidden=false;doneButton.textContent=complete?L.undo:L.done;doneButton.setAttribute('aria-pressed',String(complete));}}
  document.querySelectorAll<HTMLElement>('[data-reading-path]').forEach(path=>{const steps=[...path.querySelectorAll<HTMLElement>('[data-reading-step]')];let count=0;for(const step of steps){const url=safeReadingPath(step.dataset.readingStep),on=!!url&&state.completed.includes(url);if(on)count++;const button=step.querySelector<HTMLButtonElement>('[data-reading-step-toggle]');if(button){button.hidden=false;button.setAttribute('aria-pressed',String(on));button.textContent=(on?'✓ ':'')+L.step;}}const progress=path.querySelector('[data-reading-path-progress]');if(progress)progress.textContent=`${count}/${steps.length} ${L.steps}`;});
  const savedList=document.querySelector('[data-saved-list]'),progressList=document.querySelector('[data-progress-list]');
  if(savedList){savedList.replaceChildren();for(const item of state.saved){const li=document.createElement('li'),a=document.createElement('a'),button=document.createElement('button');a.href=item.url;a.textContent=item.title;button.type='button';button.textContent=L.remove;button.setAttribute('aria-label',`${L.remove} : ${item.title}`);button.addEventListener('click',()=>{const state=load();state.saved=state.saved.filter(s=>s.url!==item.url);save(state);render();notifySave();},{signal});li.append(a,button);savedList.append(li);}const empty=document.querySelector<HTMLElement>('[data-library-empty]');if(empty)empty.hidden=state.saved.length>0;}
  if(progressList){progressList.replaceChildren();const progress=state.progress.filter(p=>p.ratio>.01&&!state.completed.includes(p.url)).sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,20);for(const item of progress){const li=document.createElement('li'),wrap=document.createElement('div'),a=document.createElement('a'),small=document.createElement('small');a.href=item.url+(item.anchor?'#'+encodeURIComponent(item.anchor):'');a.textContent=item.title;small.textContent=`${L.resume} · ${Math.round(item.ratio*100)} %`;wrap.append(a,small);li.append(wrap);progressList.append(li);}const empty=document.querySelector<HTMLElement>('[data-progress-empty]');if(empty)empty.hidden=progress.length>0;}
 }
 if(current&&saveButton)saveButton.addEventListener('click',()=>{const state=load();if(state.saved.some(s=>s.url===current))state.saved=state.saved.filter(s=>s.url!==current);else{state.saved.unshift({url:current,title,format:tools?.dataset.readingFormat||'article',addedAt:Date.now()});trackEngagement('reading_saved',{format:tools?.dataset.readingFormat||'article'});}save(state);render();notifySave();},{signal});
 const toggleComplete=(url:string)=>{const state=load();state.completed=state.completed.includes(url)?state.completed.filter(p=>p!==url):[url,...state.completed];save(state);render();notifySave();trackEngagement('reading_step',{completed:state.completed.includes(url)});};
 if(current&&doneButton)doneButton.addEventListener('click',()=>toggleComplete(current),{signal});
 document.querySelectorAll<HTMLButtonElement>('[data-reading-step-toggle]').forEach(button=>button.addEventListener('click',()=>{const url=safeReadingPath(button.closest<HTMLElement>('[data-reading-step]')?.dataset.readingStep);if(url)toggleComplete(url);},{signal}));
 const clear=document.querySelector<HTMLButtonElement>('[data-reading-clear]');if(clear){clear.hidden=false;clear.addEventListener('click',()=>{if(!confirm(L.clear))return;save(emptyReadingState());render();notice(L.cleared);},{signal});}
 const body=document.querySelector<HTMLElement>('.article-body');
 let flush=()=>{};
 if(current&&body){
  const previous=load().progress.find(p=>p.url===current);
  if(resume&&previous&&previous.ratio>.01&&!memory.completed.includes(current)){resume.hidden=false;resume.href=previous.anchor?'#'+encodeURIComponent(previous.anchor):'#main-content';resume.addEventListener('click',e=>{const target=previous.anchor?document.getElementById(previous.anchor):null;if(!target){e.preventDefault();window.scrollTo({top:scrollY+body.getBoundingClientRect().top+previous.ratio*Math.max(0,body.offsetHeight-innerHeight),behavior:'smooth'});}trackEngagement('reading_resumed');},{signal});}
  let dirty=false;
  flush=()=>{if(!dirty)return;dirty=false;const box=body.getBoundingClientRect();if(box.top>innerHeight*.7)return;const ratio=Math.max(0,Math.min(1,(-box.top+innerHeight*.4)/Math.max(1,box.height)));const headings=[...body.querySelectorAll<HTMLElement>('h2[id],h3[id]')];let anchor='';for(const heading of headings){if(heading.getBoundingClientRect().top<innerHeight*.4)anchor=heading.id;else break;}const state=load();state.progress=[{url:current,title,anchor,ratio,updatedAt:Date.now()},...state.progress.filter(p=>p.url!==current)].slice(0,300);save(state);};
  window.addEventListener('scroll',()=>{dirty=true;if(timer)clearTimeout(timer);timer=setTimeout(flush,350);},{passive:true,signal});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();},{signal});window.addEventListener('pagehide',flush,{signal});
  try{const last=sessionStorage.getItem('gaucher.lastReading');if(last&&last!==current)trackEngagement('second_reading',{format:tools?.dataset.readingFormat||'article'});sessionStorage.setItem('gaucher.lastReading',current);}catch{}
 }
 window.addEventListener('storage',e=>{if(e.key===READING_KEY){memory=emptyReadingState();render();}},{signal});
 render();if(!persistent)notice(L.session);
 cleanup=()=>{if(timer)clearTimeout(timer);flush();controller.abort();};
}
init();document.addEventListener('astro:page-load',init);document.addEventListener('astro:before-swap',()=>cleanup?.());
