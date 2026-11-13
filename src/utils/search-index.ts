import {getCollection} from 'astro:content';
import {categoryMap,categorySlugs,NL_LAUNCH_DATE} from '../data/site';
import {glossaryTerms} from '../data/glossary';
import {getReadingPaths} from '../data/reading-paths';
import {t} from '../i18n/translations';
import {buildSrcset} from './image-variants';
import {calculateReadingTime,filterPostsForLang,formatDateForLang,getAllPosts,getLocalizedPostText,getPostHeroSrc,getPostSlug,getPostUrlLang} from './blog';
import type {SiteLang} from './lang-paths';
import type {SearchEntry,SearchIndex} from './search-catalogue';

const plain=(text:string)=>text.replace(/```[\s\S]*?```/g,' ').replace(/<[^>]+>/g,' ').replace(/!\[[^\]]*\]\([^)]*\)/g,' ').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[#*_`>]/g,' ').replace(/\s+/g,' ').trim();
const cached=new Map<SiteLang,Promise<SearchIndex>>();
export function buildSearchIndex(lang:SiteLang):Promise<SearchIndex>{
  let result=cached.get(lang);if(!result){result=createIndex(lang);cached.set(lang,result);result.catch(()=>cached.delete(lang));}return result;
}
async function createIndex(lang:SiteLang):Promise<SearchIndex>{
  const categories=Object.fromEntries(categorySlugs.map(slug=>[slug,{label:t(lang,`categories.${slug}.label`),accent:categoryMap[slug].accent}]));
  if(lang==='nl'&&new Date()<NL_LAUNCH_DATE)return {lang,entries:[],categories,formats:[]};
  const posts=filterPostsForLang(await getAllPosts(),lang).filter(post=>!post.data.noindex);
  let translations:Map<string,{tags?:string[]}>|undefined;
  if(lang!=='fr'){
    const collection=lang==='en'?'enTranslations':lang==='pt-br'?'ptBrTranslations':'nlTranslations';
    translations=new Map((await getCollection(collection)).filter(p=>!p.data.draft).map(p=>[p.data.frSlug??p.id.split('/').pop()??p.id,{tags:p.data.tags}]));
  }
  const entries:SearchEntry[]=await Promise.all(posts.filter(post=>!translations||translations.has(getPostSlug(post))).map(async post=>{
    const text=await getLocalizedPostText(post,lang),hero=getPostHeroSrc(post);
    return {href:await getPostUrlLang(post,lang),title:text.title,excerpt:text.excerpt,format:'article' as const,category:post.data.category,keywords:lang==='fr'?post.data.tags:translations?.get(getPostSlug(post))?.tags,
      hero,heroAlt:text.heroImageAlt??'',heroSrcset:hero?buildSrcset(hero):undefined,date:formatDateForLang(post.data.publishDate,lang),readingTime:post.data.readingTime,
      imageCredit:post.data.heroImage?.credit,imageSource:post.data.heroImage?.sourceUrl,imageLicense:post.data.heroImage?.license};
  }));
  for(const path of await getReadingPaths(lang,posts))entries.push({href:`/${lang}/#parcours-${path.id}`,title:path.title,excerpt:path.intro,format:'parcours',category:path.category,searchText:path.steps.map(step=>`${step.title} ${step.why}`).join(' ')});
  if(lang==='fr'){
    for(const essay of (await getCollection('dissertations')).filter(p=>p.data.publishDate<=new Date()))entries.push({href:`/fr/dissertations/${essay.id}/`,title:essay.data.title,excerpt:essay.data.excerpt,searchText:plain(essay.body??''),keywords:essay.data.tags,format:'dissertation',category:'',date:formatDateForLang(essay.data.publishDate,'fr'),readingTime:calculateReadingTime(essay.body??'')});
    for(const term of glossaryTerms)entries.push({href:`/fr/glossaire/#${term.slug}`,title:term.title,excerpt:term.def,searchText:term.example,keywords:term.related,format:'definition',category:term.cat==='neuro'?'science':term.cat==='psycho'||term.cat==='compet'?'esprit':''});
    entries.push(
      {href:'/fr/infographie/',title:'L’Atlas du Gaucher',excerpt:'Explorer les articles par thèmes et trouver un parcours entre science, esprit et société.',format:'outil',category:'',keywords:['atlas','carte','navigation']},
      {href:'/fr/glossaire/',title:'Le glossaire du Gaucher',excerpt:'Retrouver une notion des échecs, des neurosciences ou de la psychologie, avec des exemples et des lectures liées.',format:'outil',category:'',keywords:['lexique','définition','vocabulaire']},
      {href:'/fr/grand-oral/',title:'Préparer le Grand oral avec les échecs',excerpt:'Choisir une spécialité, explorer des questions, lire les guides et télécharger les fiches de préparation.',format:'outil',category:'grand-oral',keywords:['bac','oral','pdf','spécialité']},
      {href:'/fr/grand-oral/generateur/',title:'Atelier de préparation du Grand oral',excerpt:'Choisir une question, construire un plan, conserver son brouillon, vérifier les sources et répéter avec un chronomètre.',format:'outil',category:'grand-oral',keywords:['générateur','problématique','brouillon','répétition']},
      {href:'/fr/series/moteur-python/',title:'Programmer son moteur d’échecs en Python',excerpt:'Découvrir le programme de la série : échiquier, coups légaux, recherche et évaluation. Les articles prévus sont annoncés sur la page du parcours.',format:'parcours',category:'science',keywords:['code','programmation','minimax','moteur']},
    );
  }
  if(lang!=='nl'){
    const text={fr:['La psychologie appliquée aux échecs','Un parcours sur les biais, la mémoire, la motivation et l’influence : chaque concept est examiné avec ses limites.'],en:['The psychology of chess','A reading path through bias, memory, motivation and influence, examining each concept and its limits.'],'pt-br':['A psicologia aplicada ao xadrez','Um percurso sobre vieses, memória, motivação e influência, examinando cada conceito e seus limites.']}[lang];
    entries.push({href:`/${lang}/series/psychologie/`,title:text[0],excerpt:text[1],format:'parcours',category:'esprit'});
  }
  const unique=[...new Map(entries.map(entry=>[entry.href,entry])).values()];
  return {lang,entries:unique,categories,formats:['article','dissertation','definition','parcours','outil'].filter(format=>unique.some(entry=>entry.format===format)) as SearchIndex['formats']};
}
export async function buildSearchIndexResponse(lang:SiteLang){return new Response(JSON.stringify(await buildSearchIndex(lang)),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=3600'}});}
