import { getCollection } from 'astro:content';
import { filterPostsForLang, getAllPosts, getLocalizedPostText, getPostSlug, getPostUrlLang, type BlogEntry } from '../utils/blog';
import type { SiteLang } from '../utils/lang-paths';

export type ReadingStep = { href:string; title:string; why:string; format:'article'|'outil'; slug?:string };
export type ReadingPath = { id:string; title:string; intro:string; category:string; steps:ReadingStep[] };
type PathCopy = { title:string; intro:string; reasons:string[] };
const definitions = [
  {id:'comprendre-mon-jeu',category:'esprit',slugs:['analyser-ses-parties','echecs-et-memoire','formation-des-habitudes-aux-echecs']},
  {id:'travailler-mon-mental',category:'esprit',slugs:['echecs-et-concentration','5-biais-cognitifs-blunder','echecs-stress-tournoi']},
  {id:'explorer-la-science',category:'science',slugs:['les-echecs-et-le-cerveau','echecs-memoire-de-travail','echecs-alphazero-stockfish']},
  {id:'preparer-mon-grand-oral',category:'grand-oral',slugs:['guide-grand-oral-echecs-toutes-specialites','grand-oral-maths-spe-echecs']},
] as const;
const copy:Record<SiteLang,PathCopy[]> = {
  fr:[
    {title:'Comprendre mon jeu',intro:'Passer d’une partie jouée à une question à travailler.',reasons:['Repérer une décision à analyser avant de demander un verdict au moteur.','Comprendre ce qui distingue une position reconnue d’une variante calculée.','Transformer le bilan de tes parties en une pratique régulière que tu peux ajuster.']},
    {title:'Travailler mon mental',intro:'Observer l’attention, les jugements et la pression pendant une partie.',reasons:['Décrire les moments où ton attention se détourne de la position.','Examiner les raccourcis de jugement qui peuvent orienter le choix d’un coup.','Préparer des réponses concrètes à la pression du tournoi et en évaluer l’utilité.']},
    {title:'Explorer la science',intro:'Relier les recherches sur le joueur aux modèles des machines.',reasons:['Distinguer les observations sur le cerveau des promesses de transfert à d’autres activités.','Examiner les contraintes de la mémoire pendant le calcul des variantes.','Comparer la recherche d’un moteur aux méthodes apprises par un système d’intelligence artificielle.']},
    {title:'Préparer mon Grand oral',intro:'D’une question délimitée à un raisonnement que tu peux défendre.',reasons:['Choisir une question liée à une spécialité et identifier ce qu’il faudra démontrer.','Étudier un exemple de raisonnement mathématique, avec ses hypothèses et ses limites.']},
  ],
  en:[
    {title:'Understand my play',intro:'Turn a game you played into a question to work on.',reasons:['Identify a decision to analyse before asking the engine for its verdict.','Understand the difference between recognising a position and calculating a variation.','Turn your game review into a regular practice you can adjust.']},
    {title:'Work on my mental game',intro:'Observe attention, judgement and pressure during a game.',reasons:['Describe the moments when your attention moves away from the position.','Examine shortcuts in judgement that may guide your choice of move.','Prepare practical responses to tournament pressure and assess their usefulness.']},
    {title:'Explore the science',intro:'Connect research on players with the models used by machines.',reasons:['Distinguish observations about the brain from promises of transfer to other activities.','Examine the limits of working memory when calculating variations.','Compare engine search with methods learned by an artificial intelligence system.']},
  ],
  'pt-br':[
    {title:'Entender meu jogo',intro:'Transformar uma partida jogada em uma questão para trabalhar.',reasons:['Identificar uma decisão para analisar antes de pedir o veredito do motor.','Entender a diferença entre reconhecer uma posição e calcular uma variante.','Transformar a análise das partidas em uma prática regular que você pode ajustar.']},
    {title:'Trabalhar meu mental',intro:'Observar a atenção, os julgamentos e a pressão durante a partida.',reasons:['Descrever os momentos em que sua atenção se afasta da posição.','Examinar atalhos de julgamento que podem orientar a escolha de um lance.','Preparar respostas práticas à pressão do torneio e avaliar sua utilidade.']},
    {title:'Explorar a ciência',intro:'Relacionar pesquisas sobre jogadores aos modelos das máquinas.',reasons:['Distinguir observações sobre o cérebro de promessas de transferência para outras atividades.','Examinar os limites da memória de trabalho ao calcular variantes.','Comparar a busca de um motor com os métodos aprendidos por um sistema de inteligência artificial.']},
  ],
  nl:[
    {title:'Mijn spel begrijpen',intro:'Van een gespeelde partij naar een vraag om aan te werken.',reasons:['Een beslissing onderzoeken voordat je het oordeel van de engine vraagt.','Het verschil begrijpen tussen een stelling herkennen en een variant berekenen.','Je partijanalyse omzetten in een regelmatige aanpak die je kunt bijstellen.']},
    {title:'Aan mijn mentale spel werken',intro:'Aandacht, oordelen en druk tijdens een partij onderzoeken.',reasons:['Beschrijven wanneer je aandacht van de stelling afdwaalt.','Denkpatronen onderzoeken die de keuze van een zet kunnen sturen.','Praktische reacties op toernooidruk voorbereiden en hun bruikbaarheid beoordelen.']},
    {title:'De wetenschap verkennen',intro:'Onderzoek naar spelers verbinden met de modellen van machines.',reasons:['Waarnemingen over het brein onderscheiden van beloften over overdracht naar andere activiteiten.','De beperkingen van het werkgeheugen bij het berekenen van varianten onderzoeken.','Het zoeken van een engine vergelijken met aangeleerde methoden van kunstmatige intelligentie.']},
  ],
};
export const readingPathUi = (lang:SiteLang) => ({
  fr:{heading:'Par quoi veux-tu commencer ?',intro:'Choisis une intention, puis avance à ton rythme dans les lectures proposées.',open:'Voir les étapes',start:'Commencer',step:'Étape terminée',next:'Pour poursuivre cette réflexion',steps:'étapes'},
  en:{heading:'Where would you like to begin?',intro:'Choose an aim, then work through the suggested reading at your own pace.',open:'See the steps',start:'Begin',step:'Step completed',next:'Continue this line of thought',steps:'steps'},
  'pt-br':{heading:'Por onde você quer começar?',intro:'Escolha um objetivo e avance no seu ritmo pelas leituras propostas.',open:'Ver as etapas',start:'Começar',step:'Etapa concluída',next:'Continue esta reflexão',steps:'etapas'},
  nl:{heading:'Waar wil je beginnen?',intro:'Kies een doel en volg de voorgestelde teksten in je eigen tempo.',open:'Bekijk de stappen',start:'Beginnen',step:'Stap afgerond',next:'Verder met deze gedachte',steps:'stappen'},
}[lang]);

/** Every linked step must already be published and have a usable translation. */
export async function getReadingPaths(lang:SiteLang='fr',posts?:BlogEntry[]):Promise<ReadingPath[]> {
  const all=filterPostsForLang(posts??await getAllPosts(),lang).filter(p=>!p.data.noindex&&p.data.publishDate<=new Date());
  let translated:Set<string>|undefined;
  if(lang!=='fr'){
    const collection=lang==='en'?'enTranslations':lang==='pt-br'?'ptBrTranslations':'nlTranslations';
    translated=new Set((await getCollection(collection)).filter(p=>!p.data.draft).map(p=>p.data.frSlug??p.id.split('/').pop()??p.id));
  }
  const bySlug=new Map(all.filter(p=>!translated||translated.has(getPostSlug(p))).map(p=>[getPostSlug(p),p]));
  const result:ReadingPath[]=[];
  for(const [index,definition] of definitions.entries()){
    const wording=copy[lang][index];if(!wording)continue;
    const steps:ReadingStep[]=[];
    for(const [i,slug] of definition.slugs.entries()){
      const post=bySlug.get(slug);if(!post)continue;
      const text=await getLocalizedPostText(post,lang);
      steps.push({href:await getPostUrlLang(post,lang),title:text.title,why:wording.reasons[i],format:'article',slug});
    }
    if(lang==='fr'&&definition.id==='preparer-mon-grand-oral')steps.push({href:'/fr/grand-oral/generateur/',title:'Mon atelier de préparation',why:'Construire et conserver ton brouillon, préparer les objections puis répéter à voix haute.',format:'outil'});
    if(steps.length)result.push({id:definition.id,title:wording.title,intro:wording.intro,category:definition.category,steps});
  }
  return result;
}
