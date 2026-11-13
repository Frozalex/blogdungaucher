import {loadPagefind} from '../utils/pagefind-client';
import {editorialUi} from '../data/editorial-ui';
import {searchCatalogue,searchFormatUi,normalizeSearch,mergeArticleHits,type SearchIndex,type SearchHit,type SearchFormat} from '../utils/search-catalogue';
import type {SiteLang} from '../utils/lang-paths';
let controller:AbortController|undefined;

function initSearch(){
  const root=document.querySelector<HTMLElement>('[data-editorial-search]');
  if(!root||root.dataset.ready==='1')return;
  controller?.abort();controller=new AbortController();const {signal}=controller;root.dataset.ready='1';
  const lang=root.dataset.lang as SiteLang,L=editorialUi(lang),S=searchFormatUi(lang);
  const input=root.querySelector<HTMLInputElement>('#search-input')!,clear=root.querySelector<HTMLButtonElement>('#search-clear')!;
  const state=root.querySelector<HTMLElement>('#search-state')!,list=root.querySelector<HTMLUListElement>('#search-results')!;
  const template=root.querySelector<HTMLTemplateElement>('#search-result-template')!,guide=root.querySelector<HTMLElement>('[data-search-guide]')!;
  const empty=root.querySelector<HTMLElement>('[data-search-empty]')!,retry=root.querySelector<HTMLButtonElement>('[data-search-retry]')!;
  const more=root.querySelector<HTMLButtonElement>('[data-search-more]')!,reset=root.querySelector<HTMLButtonElement>('[data-search-reset]')!;
  const fulltext=root.querySelector<HTMLElement>('[data-search-fulltext]')!;
  const categories=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cat]')),formats=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-format]'));
  let metadata:Promise<SearchIndex>|undefined,index:SearchIndex|undefined;
  let hits:SearchHit[]=[],activeCategory='',activeFormat='',version=0,limit=20;
  let timer:ReturnType<typeof setTimeout>|undefined;
  const getIndex=()=>metadata??=fetch(root.dataset.index!,{signal}).then(async r=>{if(!r.ok)throw Error('Index');const data=await r.json() as SearchIndex;if(!Array.isArray(data.entries)||data.lang!==lang)throw Error('Index');return data;});
  const setText=(node:ParentNode,selector:string,text:string)=>{const el=node.querySelector(selector);if(el)el.textContent=text;};
  function highlighted(text:string){
    const parsed=new DOMParser().parseFromString(text,'text/html'),fragment=document.createDocumentFragment();
    function append(node:Node,parent:Node){if(node.nodeType===Node.TEXT_NODE)parent.appendChild(document.createTextNode(node.textContent??''));else if(node instanceof Element){if(node.tagName==='MARK'){const mark=document.createElement('mark');mark.textContent=node.textContent;parent.appendChild(mark);}else node.childNodes.forEach(child=>append(child,parent));}}
    parsed.body.childNodes.forEach(node=>append(node,fragment));return fragment;
  }
  function syncFilters(){
    categories.forEach(c=>{const on=c.dataset.cat===activeCategory;c.setAttribute('aria-pressed',String(on));c.classList.toggle('active',on);});
    formats.forEach(c=>{const on=c.dataset.format===activeFormat;c.setAttribute('aria-pressed',String(on));c.classList.toggle('active',on);});
    reset.hidden=!(activeCategory||activeFormat);
  }
  function updateUrl(q:string){
    const url=new URL(location.href);
    for(const [key,value] of [['q',q],['format',activeFormat],['category',activeCategory]]){if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
    history.replaceState(history.state,'',url);
  }
  function render(q:string){
    if(!index)return;
    const filtered=hits.filter(({entry})=>(!activeCategory||entry.category===activeCategory)&&(!activeFormat||entry.format===activeFormat));
    list.replaceChildren();guide.hidden=true;empty.hidden=filtered.length>0;more.hidden=filtered.length<=limit;
    const suffix=[activeFormat?S[activeFormat as SearchFormat]:'',activeCategory?index.categories[activeCategory]?.label:''].filter(Boolean).join(' · ');
    state.textContent=`${filtered.length} ${filtered.length===1?L.resultSingular:L.resultPlural}${q?` ${L.forQuery} « ${q} »`:''}${suffix?` · ${suffix}`:''}${filtered.length>limit?` · ${limit} ${L.shown}`:''}`;
    for(const {entry,excerpt} of filtered.slice(0,limit)){
      const item=template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const link=item.querySelector<HTMLAnchorElement>('.search-result__link')!;link.href=entry.href;
      setText(item,'.search-result__cat',[S[entry.format],index.categories[entry.category]?.label].filter(Boolean).join(' · '));
      setText(item,'.search-result__title',entry.title);
      const summary=item.querySelector('.search-result__excerpt')!;if(excerpt)summary.append(highlighted(excerpt));else summary.textContent=entry.excerpt;
      setText(item,'.search-result__meta',[entry.date,entry.readingTime?`${entry.readingTime} ${L.reading}`:''].filter(Boolean).join(' · '));
      const visual=item.querySelector<HTMLElement>('.search-result__visual')!;
      if(entry.hero){const img=visual.querySelector('img')!;img.src=entry.hero;img.alt=entry.heroAlt??'';if(entry.heroSrcset)img.srcset=entry.heroSrcset;}
      else{visual.remove();item.classList.add('search-result--plain');}
      const credit=item.querySelector<HTMLElement>('.search-result__credit')!;
      credit.hidden=!(entry.hero&&(entry.imageCredit||entry.imageSource||entry.imageLicense));
      setText(credit,'[data-credit]',entry.imageCredit?`${L.credit} : ${entry.imageCredit}`:'');setText(credit,'[data-license]',entry.imageLicense??'');
      const source=credit.querySelector<HTMLAnchorElement>('[data-source]')!;source.hidden=!entry.imageSource;if(entry.imageSource)source.href=entry.imageSource;
      list.append(item);
    }
    list.setAttribute('aria-busy','false');
  }
  async function search(query:string,persist=true){
    if(timer)clearTimeout(timer);const q=query.trim(),mine=++version;hits=[];limit=20;
    clear.hidden=!q;list.replaceChildren();retry.hidden=true;more.hidden=true;empty.hidden=true;fulltext.hidden=true;guide.hidden=Boolean(q||activeFormat||activeCategory);
    syncFilters();if(persist)updateUrl(q);
    if((q.length>0&&normalizeSearch(q).length<2)||(!q&&!activeFormat&&!activeCategory)){state.textContent=q?L.short:L.start;list.setAttribute('aria-busy','false');return;}
    state.textContent=L.loading;list.setAttribute('aria-busy','true');
    try{
      index=await getIndex();if(mine!==version||signal.aborted)return;
      hits=searchCatalogue(index.entries,q);render(q);
      if(!q||(activeFormat&&activeFormat!=='article'))return;
      fulltext.hidden=false;fulltext.textContent=L.loading;
      let deadline:ReturnType<typeof setTimeout>|undefined;
      try{
        const found=await Promise.race([
          loadPagefind(lang).then(pf=>pf.search(q)).then(r=>Promise.all(r.results.map(hit=>hit.data()))),
          new Promise<never>((_,reject)=>{deadline=setTimeout(()=>reject(Error('Search timeout')),6000);}),
        ]);
        if(mine!==version||signal.aborted)return;
        hits=mergeArticleHits(index.entries,hits,found);fulltext.hidden=true;render(q);
      }catch{if(mine===version&&!signal.aborted){fulltext.textContent=S.partial;fulltext.hidden=false;retry.hidden=false;}}
      finally{if(deadline)clearTimeout(deadline);}
    }catch{if(mine!==version||signal.aborted)return;state.textContent=L.unavailable;retry.hidden=false;list.setAttribute('aria-busy','false');}
  }
  categories.forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.cat??'';void search(input.value);},{signal}));
  formats.forEach(button=>button.addEventListener('click',()=>{activeFormat=button.dataset.format??'';void search(input.value);},{signal}));
  reset.addEventListener('click',()=>{activeCategory='';activeFormat='';void search(input.value);},{signal});
  input.addEventListener('input',()=>{version++;clear.hidden=!input.value;if(timer)clearTimeout(timer);timer=setTimeout(()=>void search(input.value),150);},{signal});
  root.querySelector('form')!.addEventListener('submit',e=>{e.preventDefault();void search(input.value);},{signal});
  clear.addEventListener('click',()=>{input.value='';input.focus();void search('');},{signal});
  retry.addEventListener('click',()=>{metadata=undefined;void search(input.value);},{signal});
  more.addEventListener('click',()=>{const previous=list.querySelectorAll('.search-result__link').length;limit+=20;render(input.value.trim());list.querySelectorAll<HTMLAnchorElement>('.search-result__link')[previous]?.focus();},{signal});
  root.querySelectorAll<HTMLButtonElement>('[data-query]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.query!;input.focus();void search(input.value);},{signal}));
  input.addEventListener('keydown',e=>{const links=list.querySelectorAll<HTMLAnchorElement>('.search-result__link');if(e.key==='ArrowDown'&&links.length){e.preventDefault();links[0].focus();}else if(e.key==='ArrowUp'&&links.length){e.preventDefault();links[links.length-1].focus();}else if(e.key==='Escape'){if(input.value){input.value='';void search('');}else input.blur();}},{signal});
  list.addEventListener('keydown',e=>{const links=[...list.querySelectorAll<HTMLAnchorElement>('.search-result__link')],current=links.indexOf(document.activeElement as HTMLAnchorElement);if(current<0)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const next=current+(e.key==='ArrowDown'?1:-1);if(next<0)input.focus();else links[Math.min(next,links.length-1)].focus();}else if(e.key==='Escape'){e.preventDefault();input.focus();}},{signal});
  document.addEventListener('keydown',e=>{const target=e.target as HTMLElement;if(e.key==='/'&&!target.closest('input,textarea,[contenteditable]')){e.preventDefault();input.focus();input.select();}},{signal});
  function readUrl(){const params=new URLSearchParams(location.search);input.value=params.get('q')??'';activeCategory=categories.some(c=>c.dataset.cat===params.get('category'))?params.get('category')??'':'';activeFormat=formats.some(c=>c.dataset.format===params.get('format'))?params.get('format')??'':'';void search(input.value,false);}
  window.addEventListener('popstate',readUrl,{signal});readUrl();
  document.addEventListener('astro:before-swap',()=>{version++;if(timer)clearTimeout(timer);delete root.dataset.ready;controller?.abort();},{once:true,signal});
}
initSearch();document.addEventListener('astro:page-load',initSearch);
