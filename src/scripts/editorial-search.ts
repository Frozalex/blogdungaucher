import { loadPagefind, type PagefindResult as Result } from "../utils/pagefind-client";
import { editorialUi } from "../data/editorial-ui";
import type { SiteLang } from "../utils/lang-paths";

type Post = {href:string;title:string;category:string;hero:string|null;heroAlt:string;heroSrcset?:string;date:string;readingTime:string;imageCredit?:string;imageSource?:string;imageLicense?:string};
type Index = {posts:Post[];categories:Record<string,{label:string;accent:string}>};
let controller:AbortController|undefined;

function initSearch(){
  const root=document.querySelector<HTMLElement>('[data-editorial-search]');
  if(!root||root.dataset.ready==='1')return;
  controller?.abort();controller=new AbortController();const {signal}=controller;root.dataset.ready='1';
  const lang=root.dataset.lang as SiteLang,L=editorialUi(lang);
  const input=root.querySelector<HTMLInputElement>('#search-input')!;
  const clear=root.querySelector<HTMLButtonElement>('#search-clear')!;
  const state=root.querySelector<HTMLElement>('#search-state')!;
  const list=root.querySelector<HTMLUListElement>('#search-results')!;
  const template=root.querySelector<HTMLTemplateElement>('#search-result-template')!;
  const guide=root.querySelector<HTMLElement>('[data-search-guide]')!;
  const empty=root.querySelector<HTMLElement>('[data-search-empty]')!;
  const retry=root.querySelector<HTMLButtonElement>('[data-search-retry]')!;
  const more=root.querySelector<HTMLButtonElement>('[data-search-more]')!;
  const chips=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cat]'));
  let metadata:Promise<Index>|undefined;
  let results:Result[]=[],activeCategory='',activeIdx=-1,version=0,limit=20,completedQuery='';
  let timer:ReturnType<typeof setTimeout>|undefined;
  document.addEventListener('astro:before-swap',()=>{version++;if(timer)clearTimeout(timer);controller?.abort();},{once:true,signal});
  const path=(url:string)=>new URL(url,location.origin).pathname.replace(/\/$/,'');
  const getIndex=()=>metadata??=(fetch(root.dataset.index!,{signal}).then(r=>{if(!r.ok)throw Error('Index');return r.json() as Promise<Index>}));
  function setText(node:ParentNode,selector:string,text:string){const el=node.querySelector(selector);if(el)el.textContent=text;}
  function highlighted(text:string){
    const parsed=new DOMParser().parseFromString(text,'text/html'),fragment=document.createDocumentFragment();
    function append(node:Node,parent:Node){if(node.nodeType===Node.TEXT_NODE){parent.appendChild(document.createTextNode(node.textContent??''));}else if(node instanceof Element){if(node.tagName==='MARK'){const mark=document.createElement('mark');mark.textContent=node.textContent;parent.appendChild(mark);}else node.childNodes.forEach(child=>append(child,parent));}}
    parsed.body.childNodes.forEach(node=>append(node,fragment));return fragment;
  }
  function updateUrl(q:string){const url=new URL(location.href);if(q)url.searchParams.set('q',q);else url.searchParams.delete('q');history.replaceState(history.state,'',url);}
  async function render(q:string){
    const mine=version;
    const index=await getIndex().catch(()=>({posts:[],categories:{}} as Index));
    if(mine!==version||signal.aborted)return;
    const byPath=new Map(index.posts.map(post=>[path(post.href),post]));
    const filtered=results.filter(result=>{
      if(!path(result.url).startsWith(`/${lang}/blog/`))return false;
      const post=byPath.get(path(result.url));
      return !activeCategory||(post?post.category===activeCategory:(result.meta.category??'').toLocaleLowerCase()===chips.find(c=>c.dataset.cat===activeCategory)?.textContent?.trim().toLocaleLowerCase());
    });
    list.replaceChildren();activeIdx=-1;guide.hidden=true;empty.hidden=filtered.length>0;retry.hidden=true;
    const category=activeCategory?` · ${index.categories[activeCategory]?.label??''}`:'';
    state.textContent=filtered.length?`${filtered.length} ${filtered.length===1?L.resultSingular:L.resultPlural} ${L.forQuery} « ${q} »${category}${filtered.length>limit?` · ${Math.min(limit,filtered.length)} ${L.shown}`:''}`:`${L.noResults} « ${q} »${category}.`;
    for(const result of filtered.slice(0,limit)){
      const post=byPath.get(path(result.url));
      const item=template.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const link=item.querySelector<HTMLAnchorElement>('.search-result__link')!;link.href=result.url;
      setText(item,'.search-result__cat',post?index.categories[post.category]?.label??result.meta.category??'':result.meta.category??'');
      setText(item,'.search-result__title',post?.title??result.meta.title??L.untitled);
      item.querySelector('.search-result__excerpt')!.append(highlighted(result.excerpt));
      setText(item,'.search-result__meta',post?`${post.date} · ${post.readingTime} ${L.reading}`:'');
      const visual=item.querySelector<HTMLElement>('.search-result__visual')!;
      if(post?.hero){const img=visual.querySelector('img')!;img.src=post.hero;img.alt=post.heroAlt;if(post.heroSrcset)img.srcset=post.heroSrcset;}
      else{visual.remove();item.classList.add('search-result--plain');}
      const credit=item.querySelector<HTMLElement>('.search-result__credit')!;
      credit.hidden=!(post?.hero&&(post.imageCredit||post.imageSource||post.imageLicense));
      setText(credit,'[data-credit]',post?.imageCredit?`${L.credit} : ${post.imageCredit}`:'');setText(credit,'[data-license]',post?.imageLicense??'');
      const source=credit.querySelector<HTMLAnchorElement>('[data-source]')!;source.hidden=!post?.imageSource;if(post?.imageSource)source.href=post.imageSource;
      list.append(item);
    }
    more.hidden=filtered.length<=limit;list.setAttribute('aria-busy','false');
  }
  async function search(q:string,persist=true){
    if(timer)clearTimeout(timer);q=q.trim();const mine=++version;results=[];completedQuery='';limit=20;activeIdx=-1;
    clear.hidden=!q;list.replaceChildren();retry.hidden=true;more.hidden=true;empty.hidden=true;guide.hidden=q.length>0;
    if(persist)updateUrl(q);
    if(q.length<2){state.textContent=q.length?L.short:L.start;list.setAttribute('aria-busy','false');return;}
    state.textContent=L.loading;list.setAttribute('aria-busy','true');
    try{
      const [pf]=await Promise.all([loadPagefind(lang),getIndex().catch(()=>undefined)]);
      if(mine!==version||signal.aborted)return;
      const found=await pf.search(q);
      const data=await Promise.all(found.results.map(r=>r.data()));
      if(mine!==version||signal.aborted)return;
      results=data;completedQuery=q;await render(q);
    }catch{if(mine!==version||signal.aborted)return;state.textContent=L.unavailable;retry.hidden=false;list.setAttribute('aria-busy','false');}
  }
  chips.forEach(chip=>chip.addEventListener('click',()=>{
    activeCategory=chip.dataset.cat??'';limit=20;chips.forEach(c=>{const on=c===chip;c.classList.toggle('active',on);c.setAttribute('aria-pressed',String(on));});
    if(completedQuery&&completedQuery===input.value.trim())void render(completedQuery);
  },{signal}));
  input.addEventListener('input',()=>{version++;results=[];completedQuery='';list.replaceChildren();activeIdx=-1;clear.hidden=!input.value;more.hidden=true;if(timer)clearTimeout(timer);timer=setTimeout(()=>void search(input.value),150);},{signal});
  root.querySelector('form')!.addEventListener('submit',e=>{e.preventDefault();void search(input.value);},{signal});
  clear.addEventListener('click',()=>{input.value='';input.focus();void search('');},{signal});
  retry.addEventListener('click',()=>{metadata=undefined;void search(input.value);},{signal});
  more.addEventListener('click',()=>{limit+=20;void render(completedQuery);},{signal});
  root.querySelectorAll<HTMLButtonElement>('[data-query]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.query!;input.focus();void search(input.value);},{signal}));
  function setActive(index:number){const links=Array.from(list.querySelectorAll<HTMLAnchorElement>('.search-result__link'));if(!links.length)return;activeIdx=(index+links.length)%links.length;links.forEach((link,i)=>{link.classList.toggle('is-active',i===activeIdx);if(i===activeIdx){link.setAttribute('aria-current','true');link.scrollIntoView({block:'nearest'});}else link.removeAttribute('aria-current');});}
  input.addEventListener('keydown',e=>{const links=list.querySelectorAll<HTMLAnchorElement>('.search-result__link');if(e.key==='ArrowDown'){e.preventDefault();setActive(activeIdx+1);}else if(e.key==='ArrowUp'){e.preventDefault();setActive(activeIdx<0?links.length-1:activeIdx-1);}else if(e.key==='Enter'&&links.length){e.preventDefault();links[activeIdx<0?0:activeIdx]?.click();}else if(e.key==='Escape'){if(input.value){input.value='';void search('');}else input.blur();}},{signal});
  document.addEventListener('keydown',e=>{const target=e.target as HTMLElement;if(e.key==='/'&&!target.closest('input,textarea,[contenteditable]')){e.preventDefault();input.focus();input.select();}},{signal});
  window.addEventListener('popstate',()=>{input.value=new URLSearchParams(location.search).get('q')??'';void search(input.value,false);},{signal});
  input.value=new URLSearchParams(location.search).get('q')??'';void search(input.value,false);
}
initSearch();document.addEventListener('astro:page-load',initSearch);
