import type {SiteLang} from './lang-paths';
export type SearchFormat='article'|'dissertation'|'definition'|'parcours'|'outil';
export interface SearchEntry {
  href:string;title:string;excerpt:string;format:SearchFormat;category:string;keywords?:string[];searchText?:string;
  hero?:string|null;heroAlt?:string;heroSrcset?:string;date?:string;readingTime?:string;imageCredit?:string;imageSource?:string;imageLicense?:string;
}
export interface SearchIndex {lang:SiteLang;entries:SearchEntry[];categories:Record<string,{label:string;accent:string}>;formats:SearchFormat[];}
export interface SearchHit {entry:SearchEntry;score:number;excerpt?:string;}
export const normalizeSearch=(text:string)=>text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/œ/gi,'oe').replace(/æ/gi,'ae').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
/** AND matching across words, with title matches ahead of incidental body mentions. */
export function searchCatalogue(entries:SearchEntry[],query:string):SearchHit[]{
  const phrase=normalizeSearch(query),words=phrase.split(/\s+/).filter(Boolean);
  return entries.flatMap(entry=>{
    const title=normalizeSearch(entry.title),summary=normalizeSearch(entry.excerpt),keywords=normalizeSearch((entry.keywords??[]).join(' '));
    const text=[title,summary,keywords,normalizeSearch(entry.searchText??'')].join(' ');
    if(!words.every(word=>text.includes(word)))return [];
    const score=!words.length?0:(title===phrase?1000:0)+(title.includes(phrase)?300:0)+words.reduce((n,word)=>n+(title.includes(word)?40:0)+(keywords.includes(word)?15:0)+(summary.includes(word)?5:0),0);
    return [{entry,score}];
  }).sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title));
}
/** Keep body matches inside the published catalogue and preserve metadata ranking. */
export function mergeArticleHits(entries:SearchEntry[],hits:SearchHit[],bodyMatches:{url:string;excerpt:string}[]):SearchHit[]{
  const path=(href:string)=>{try{return new URL(href,'https://catalogue.invalid').pathname.replace(/\/$/,'');}catch{return '';}};
  const articles=new Map(entries.filter(entry=>entry.format==='article').map(entry=>[path(entry.href),entry]));
  const merged=new Map(hits.map(hit=>[hit.entry.href,hit]));
  for(const [i,result] of bodyMatches.entries()){
    const entry=articles.get(path(result.url));if(!entry)continue;
    const previous=merged.get(entry.href);
    merged.set(entry.href,{entry,score:previous?.score??Math.max(1,30-i/100),excerpt:result.excerpt});
  }
  return [...merged.values()].sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title));
}
export const searchFormatUi=(lang:SiteLang)=>({
  fr:{all:'Tous les formats',label:'Filtrer par format',article:'Articles',dissertation:'Dissertations',definition:'Définitions',parcours:'Parcours & séries',outil:'Outils & ressources',kicker:'Dans tout le site',intro:'Articles, dissertations, définitions, parcours et outils : retrouve une idée, puis choisis le format qui te convient.',searchLabel:'Rechercher dans le site',guide:'Une même idée peut se trouver dans un dossier, une définition ou un outil. La recherche explore aussi le corps des articles.',partial:'La recherche dans le texte intégral des articles est indisponible. Les autres résultats restent consultables.',browse:'ressources',clearFilters:'Effacer les filtres',empty:'Essaie un autre mot ou retire un filtre de format ou de rubrique.'},
  en:{all:'All formats',label:'Filter by format',article:'Articles',dissertation:'Essays',definition:'Definitions',parcours:'Reading paths & series',outil:'Tools & resources',kicker:'Across the site',intro:'Find an idea across the available articles, reading paths and resources, then choose the format that suits you.',searchLabel:'Search the site',guide:'Follow an idea through an article or a reading path. Search also looks inside the articles.',partial:'Full-text article search is unavailable. Other results are still available.',browse:'resources',clearFilters:'Clear filters',empty:'Try another word or remove a format or section filter.'},
  'pt-br':{all:'Todos os formatos',label:'Filtrar por formato',article:'Artigos',dissertation:'Ensaios',definition:'Definições',parcours:'Percursos e séries',outil:'Ferramentas e recursos',kicker:'Em todo o site',intro:'Encontre uma ideia nos artigos, percursos e recursos disponíveis e escolha o formato mais adequado.',searchLabel:'Buscar no site',guide:'Acompanhe uma ideia em um artigo ou percurso. A busca também percorre o texto dos artigos.',partial:'A busca no texto completo dos artigos está indisponível. Os outros resultados continuam disponíveis.',browse:'recursos',clearFilters:'Limpar filtros',empty:'Tente outra palavra ou remova um filtro de formato ou seção.'},
  nl:{all:'Alle vormen',label:'Filter op vorm',article:'Artikelen',dissertation:'Essays',definition:'Definities',parcours:'Leesroutes en reeksen',outil:'Hulpmiddelen en bronnen',kicker:'Op de hele site',intro:'Vind een idee in de beschikbare artikelen, leesroutes en bronnen en kies de vorm die bij je past.',searchLabel:'Zoek op de site',guide:'Volg een idee in een artikel of leesroute. De zoekfunctie doorzoekt ook de tekst van de artikelen.',partial:'Zoeken in de volledige artikeltekst is niet beschikbaar. Andere resultaten blijven beschikbaar.',browse:'bronnen',clearFilters:'Filters wissen',empty:'Probeer een ander woord of verwijder een filter voor vorm of rubriek.'},
}[lang]);
