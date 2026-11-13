import {loadPagefind} from '../utils/pagefind-client';
import {mergeArticleHits,normalizeSearch,searchCatalogue,searchFormatUi,type SearchHit,type SearchIndex} from '../utils/search-catalogue';
import type {SiteLang} from '../utils/lang-paths';

const MESSAGES={
  fr:{searching:'Recherche…',empty:'Aucun résultat pour',min:'Écris au moins deux caractères.',unavailable:'La recherche est momentanément indisponible. Ouvre la page de recherche pour réessayer.',count:(n:number)=>`${n} résultat${n>1?'s':''}`,shown:'affichés'},
  en:{searching:'Searching…',empty:'No results for',min:'Type at least two characters.',unavailable:'Search is temporarily unavailable. Open the search page to try again.',count:(n:number)=>`${n} result${n===1?'':'s'}`,shown:'shown'},
  'pt-br':{searching:'Buscando…',empty:'Nenhum resultado para',min:'Digite pelo menos dois caracteres.',unavailable:'A busca está temporariamente indisponível. Abra a página de busca para tentar novamente.',count:(n:number)=>`${n} resultado${n===1?'':'s'}`,shown:'exibidos'},
  nl:{searching:'Zoeken…',empty:'Geen resultaten voor',min:'Typ minstens twee tekens.',unavailable:'Zoeken is tijdelijk niet beschikbaar. Open de zoekpagina om het opnieuw te proberen.',count:(n:number)=>`${n} ${n===1?'resultaat':'resultaten'}`,shown:'getoond'},
};
let controller:AbortController|undefined;

function initSearchOverlay(){
  const overlay=document.querySelector<HTMLElement>('[data-search-overlay]');
  if(!overlay||overlay.dataset.ready==='1')return;
  controller?.abort();controller=new AbortController();const {signal}=controller;overlay.dataset.ready='1';
  const input=overlay.querySelector<HTMLInputElement>('#searchOverlayInput')!;
  const state=overlay.querySelector<HTMLElement>('[data-search-state]')!;
  const list=overlay.querySelector<HTMLUListElement>('[data-search-results]')!;
  const partial=overlay.querySelector<HTMLElement>('[data-search-partial]')!;
  const all=overlay.querySelector<HTMLAnchorElement>('[data-search-all]')!;
  const lang=(overlay.dataset.lang||'fr') as SiteLang,M=MESSAGES[lang],S=searchFormatUi(lang);
  const start=state.textContent??'',searchPage=all.getAttribute('href')!;
  let pending:Promise<SearchIndex>|undefined;
  let version=0,timer:ReturnType<typeof setTimeout>|undefined;
  let returnFocus:HTMLElement|null=null,previousOverflow='';

  function getIndex(){
    if(!pending){
      pending=fetch(overlay!.dataset.searchIndex!,{signal}).then(async response=>{
        if(!response.ok)throw Error('Index');
        const index=await response.json() as SearchIndex;
        if(index.lang!==lang||!Array.isArray(index.entries))throw Error('Index');
        return index;
      });
      pending.catch(()=>{pending=undefined;});
    }
    return pending;
  }
  function isOpen(){return !overlay!.hidden;}
  function open(trigger?:HTMLElement){
    if(isOpen())return;
    returnFocus=trigger??(document.activeElement instanceof HTMLElement?document.activeElement:null);
    previousOverflow=document.documentElement.style.overflow;
    overlay!.hidden=false;document.documentElement.style.overflow='hidden';
    requestAnimationFrame(()=>{if(!isOpen()||signal.aborted)return;overlay!.classList.add('is-open');input.focus();input.select();});
    void getIndex().catch(()=>{});
    void loadPagefind(lang).catch(()=>{});
    void search(input.value);
  }
  function close(restoreFocus=true){
    if(!isOpen())return;
    version++;if(timer)clearTimeout(timer);
    overlay!.classList.remove('is-open');overlay!.hidden=true;
    document.documentElement.style.overflow=previousOverflow;
    if(restoreFocus&&returnFocus?.isConnected&&!returnFocus.closest('[inert]'))returnFocus.focus({preventScroll:true});
  }
  function excerpt(text:string){
    const parsed=new DOMParser().parseFromString(text,'text/html'),fragment=document.createDocumentFragment();
    function append(node:Node,parent:Node){
      if(node.nodeType===Node.TEXT_NODE)parent.appendChild(document.createTextNode(node.textContent??''));
      else if(node instanceof Element){
        if(node.tagName==='MARK'){const mark=document.createElement('mark');mark.textContent=node.textContent;parent.appendChild(mark);}
        else if(!['SCRIPT','STYLE'].includes(node.tagName))node.childNodes.forEach(child=>append(child,parent));
      }
    }
    parsed.body.childNodes.forEach(node=>append(node,fragment));return fragment;
  }
  function render(hits:SearchHit[],index:SearchIndex,q:string){
    // A late body-search response must not drop keyboard focus from an existing result.
    const focused=list.contains(document.activeElement)?(document.activeElement as HTMLAnchorElement).getAttribute('href'):null;
    list.replaceChildren();
    state.textContent=hits.length?`${M.count(hits.length)}${hits.length>8?` · 8 ${M.shown}`:''}`:`${M.empty} « ${q} »`;
    for(const hit of hits.slice(0,8)){
      const li=document.createElement('li'),link=document.createElement('a'),format=document.createElement('small'),title=document.createElement('strong'),summary=document.createElement('span');
      link.className='search-overlay__result';link.href=hit.entry.href;
      format.textContent=[S[hit.entry.format],index.categories[hit.entry.category]?.label].filter(Boolean).join(' · ');
      title.textContent=hit.entry.title;
      if(hit.excerpt)summary.append(excerpt(hit.excerpt));else summary.textContent=hit.entry.excerpt;
      link.append(format,title,summary);li.append(link);list.append(li);
    }
    if(focused){const links=[...list.querySelectorAll<HTMLAnchorElement>('a')];(links.find(link=>link.getAttribute('href')===focused)??input).focus({preventScroll:true});}
    list.setAttribute('aria-busy','false');
  }
  async function search(raw:string){
    if(timer)clearTimeout(timer);
    const q=raw.trim(),mine=++version;
    all.href=searchPage+(q?`?${new URLSearchParams({q})}`:'');
    partial.hidden=true;list.replaceChildren();list.setAttribute('aria-busy','false');
    if(normalizeSearch(q).length<2){state.textContent=q?M.min:start;return;}
    state.textContent=M.searching;list.setAttribute('aria-busy','true');
    try{
      const index=await getIndex();if(mine!==version||signal.aborted||!isOpen())return;
      const hits=searchCatalogue(index.entries,q);render(hits,index,q);
      let deadline:ReturnType<typeof setTimeout>|undefined;
      try{
        const found=await Promise.race([
          loadPagefind(lang).then(pf=>pf.search(q)).then(result=>Promise.all(result.results.map(hit=>hit.data()))),
          new Promise<never>((_,reject)=>{deadline=setTimeout(()=>reject(Error('Search timeout')),6000);}),
        ]);
        if(mine!==version||signal.aborted||!isOpen())return;
        render(mergeArticleHits(index.entries,hits,found),index,q);
      }catch{if(mine===version&&!signal.aborted&&isOpen()){partial.textContent=S.partial;partial.hidden=false;}}
      finally{if(deadline)clearTimeout(deadline);}
    }catch{if(mine===version&&!signal.aborted&&isOpen()){state.textContent=M.unavailable;list.setAttribute('aria-busy','false');}}
  }
  input.addEventListener('input',()=>{version++;if(timer)clearTimeout(timer);timer=setTimeout(()=>void search(input.value),150);},{signal});
  input.addEventListener('keydown',event=>{
    const links=list.querySelectorAll<HTMLAnchorElement>('a');
    if(event.key==='ArrowDown'&&links.length){event.preventDefault();links[0].focus();}
    else if(event.key==='ArrowUp'&&links.length){event.preventDefault();links[links.length-1].focus();}
    else if(event.key==='Enter'&&!event.isComposing){event.preventDefault();if(timer){clearTimeout(timer);timer=undefined;}all.href=searchPage+(input.value.trim()?`?${new URLSearchParams({q:input.value.trim()})}`:'');all.click();}
  },{signal});
  list.addEventListener('keydown',event=>{
    const links=[...list.querySelectorAll<HTMLAnchorElement>('a')],current=links.indexOf(document.activeElement as HTMLAnchorElement);
    if(current<0)return;
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();const next=current+(event.key==='ArrowDown'?1:-1);
      if(next<0)input.focus();else links[Math.min(next,links.length-1)].focus();
    }
  },{signal});
  document.querySelectorAll<HTMLElement>('[data-search-trigger]').forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();open(trigger);},{signal}));
  overlay.querySelectorAll('[data-search-close]').forEach(button=>button.addEventListener('click',()=>close(),{signal}));
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab'&&isOpen()){
      const controls=[...overlay.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node=>!node.closest('[hidden],[inert]')&&node.getClientRects().length>0);
      const first=controls[0],last=controls[controls.length-1],active=document.activeElement;
      if(first&&last&&(!overlay.contains(active)||(event.shiftKey&&active===first)||(!event.shiftKey&&active===last))){event.preventDefault();(event.shiftKey?last:first).focus();}
    }
    const target=event.target as HTMLElement|null,typing=target?.closest('input,textarea,select,[contenteditable]');
    const onSearchPage=/\/recherche\/?$/.test(location.pathname);
    if((event.key==='/'&&!typing&&!onSearchPage&&!event.ctrlKey&&!event.metaKey&&!event.altKey)||(event.key.toLowerCase()==='k'&&(event.ctrlKey||event.metaKey))){event.preventDefault();open();}
    else if(event.key==='Escape'&&isOpen()){event.preventDefault();close();}
  },{signal});
  document.addEventListener('astro:before-swap',()=>{close(false);version++;if(timer)clearTimeout(timer);delete overlay.dataset.ready;controller?.abort();},{once:true,signal});
}
initSearchOverlay();document.addEventListener('astro:page-load',initSearchOverlay);
