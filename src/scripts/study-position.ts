import { Chess, type Square } from 'chess.js';
import { trackEngagement } from './engagement';
const names:Record<string,string>={k:'roi',q:'dame',r:'tour',b:'fou',n:'cavalier',p:'pion'};
class StudyPosition extends HTMLElement {
 private game?:Chess; private initial=''; private selected:Square|null=null; private steps:string[]=[]; private step=0; private guided=false;
 private root=this.attachShadow({mode:'open'}); private board!:HTMLDivElement; private status!:HTMLParagraphElement; private correction!:HTMLParagraphElement;
 connectedCallback(){if(this.board)return;this.initial=this.getAttribute('fen')||'';this.steps=(this.getAttribute('solution')||'').split('|').filter(Boolean);
  try{this.game=new Chess(this.initial);const check=new Chess(this.initial);for(const san of this.steps)check.move(san);}catch{this.root.textContent='La position interactive est indisponible. Le corrigé reste lisible dans l’article.';return;}
  const style=document.createElement('style');style.textContent=`:host{display:block;clear:both;margin:26px 0;padding:20px;border:1px solid var(--border-strong,#808675);border-radius:20px;background:var(--surface,#fffcf4);color:var(--text-main,#242923);font:16px/1.5 var(--font-body,sans-serif)}h3{margin:0 0 8px;font-size:21px}
.board{display:grid;grid-template:repeat(8,minmax(0,1fr))/repeat(8,minmax(0,1fr));width:min(100%,480px);aspect-ratio:1;margin:20px auto;border-radius:6px;overflow:hidden;box-shadow:0 2px 10px #18241838}
.sq{position:relative;display:grid;place-items:center;padding:0;border:0;border-radius:0;background:#eeeed2;color:#476135;cursor:pointer}
.dark{background:#789656;color:#f8fae8}
.sq img{width:88%;height:88%;pointer-events:none}
.sq[aria-pressed=true]{background:#c5ca59;box-shadow:inset 0 0 0 3px #566526}
.legal:after{content:'';position:absolute;width:29%;height:29%;border-radius:50%;background:#20301850}
.legal:has(img):after{inset:0;width:auto;height:auto;background:transparent;box-shadow:inset 0 0 0 5px #283d2877}
.sq:focus-visible{outline:3px solid #2c475e;outline-offset:-3px;z-index:1}
.coord{position:absolute;font:700 clamp(8px,2vw,11px)/1 sans-serif;pointer-events:none}
.rank{top:2px;left:3px}.file{bottom:2px;right:3px}
.actions{display:flex;gap:10px;flex-wrap:wrap}.action{padding:10px 15px;border:1px solid #315649;border-radius:99px;background:#315649;color:white;cursor:pointer;font:inherit}.action:focus-visible{outline:3px solid #a54f00;outline-offset:3px}.action:disabled{opacity:.6;cursor:default}.status{min-height:3em}.correction{border-left:3px solid #315649;padding-left:14px}`;
  const heading=document.createElement('h3');heading.textContent=this.getAttribute('caption')||'À toi de jouer';
  const intro=document.createElement('p');intro.textContent='Choisis une pièce, puis sa case d’arrivée. Les points indiquent les coups légaux. Au clavier : Tab, puis Entrée.';
  this.board=document.createElement('div');this.board.className='board';this.board.setAttribute('role','group');this.board.setAttribute('aria-label','Échiquier, Blancs en bas');
  this.status=document.createElement('p');this.status.className='status';this.status.setAttribute('role','status');
  this.correction=document.createElement('p');this.correction.className='correction';this.correction.hidden=true;
  const actions=document.createElement('div');actions.className='actions';
  const button=(label:string,handler:()=>void)=>{const b=document.createElement('button');b.type='button';b.className='action';b.textContent=label;b.addEventListener('click',handler);actions.append(b);return b;};
  button('Recommencer',()=>{this.game=new Chess(this.initial);this.selected=null;this.step=0;this.guided=false;this.correction.hidden=true;next.disabled=false;this.render();});
  const next=button('Voir le coup du corrigé',()=>{if(!this.game||!this.steps.length)return;if(!this.guided){this.game=new Chess(this.initial);this.step=0;this.guided=true;}const played=this.game.move(this.steps[this.step++]);this.selected=null;this.render(`${played.san}, coup ${this.step} du corrigé.`);if(this.step===this.steps.length){next.disabled=true;this.explain();}trackEngagement('tool_use',{tool:'study-position',action:'correction'});});
  if(!this.steps.length)next.hidden=true;
  this.root.append(style,heading,intro,this.board,this.status,actions,this.correction);this.render();
 }
 private explain(){this.correction.textContent=this.getAttribute('explanation')||'Compare la position finale avec le corrigé de l’article.';this.correction.hidden=false;}
 private render(message=''){
  const game=this.game;if(!game)return;const legal=this.selected?game.moves({square:this.selected,verbose:true}).map(m=>m.to):[];this.board.replaceChildren();
  for(let rank=8;rank>=1;rank--)for(let file=0;file<8;file++){const square=(String.fromCharCode(97+file)+rank) as Square;const piece=game.get(square);const b=document.createElement('button');b.type='button';b.className='sq'+((rank+file)%2!==0?' dark':'')+(piece?.color==='w'?' white-piece':'')+(legal.includes(square)?' legal':'');b.setAttribute('aria-label',`${square}, ${piece?names[piece.type]+(piece.color==='w'?' blanc':' noir'):'vide'}`);b.setAttribute('aria-pressed',String(square===this.selected));if (piece) {
    const icon = document.createElement('img');
    icon.src = '/images/pieces/cburnett/' + piece.color + piece.type.toUpperCase() + '.svg';
    icon.alt = '';
    icon.draggable = false;
    b.append(icon);
  }for (const axis of ['rank','file']) {
    if (axis === 'rank' ? file !== 0 : rank !== 1) continue;const c=document.createElement('span');c.className='coord '+axis;c.setAttribute('aria-hidden','true');c.textContent=axis==='rank'?String(rank):square[0];b.append(c);}b.addEventListener('click',()=>this.play(square));this.board.append(b);}
  this.status.textContent=message||(game.isCheckmate()?'Échec et mat.':game.isDraw()?'Position nulle.':`Trait aux ${game.turn()==='w'?'Blancs':'Noirs'}${game.isCheck()?' : échec !':'.'}`);
 }
 private play(square:Square){const game=this.game;if(!game||this.guided)return;if(this.selected){const from=this.selected;this.selected=null;try{const move=game.move({from,to:square,promotion:'q'});const actual=game.history();const matches=actual.every((san,i)=>this.steps[i]===san);const solved=matches&&actual.length===this.steps.length;this.render(solved?`${move.san}. Bien joué, tu as trouvé le corrigé !`:`${move.san}. ${matches?'Poursuis la variante.':'Coup légal. Compare cette idée au corrigé ou recommence.'}`);if(solved)this.explain();trackEngagement('tool_use',{tool:'study-position',action:solved?'solved':'move'});return;}catch{/* Un second clic sur sa pièce change la sélection. */}}
  if(game.get(square)?.color===game.turn())this.selected=square;this.render();const index=(8-Number(square[1]))*8+square.charCodeAt(0)-97;(this.board.children[index] as HTMLButtonElement)?.focus();
 }
}
if(!customElements.get('study-position'))customElements.define('study-position',StudyPosition);
