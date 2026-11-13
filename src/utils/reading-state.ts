export interface SavedReading {url:string;title:string;format:string;addedAt:number;}
export interface ReadingProgress {url:string;title:string;anchor:string;ratio:number;updatedAt:number;}
export interface ReadingState {version:1;saved:SavedReading[];progress:ReadingProgress[];completed:string[];}
export const READING_KEY='blogdungaucher.reading.v1';
export const emptyReadingState=():ReadingState=>({version:1,saved:[],progress:[],completed:[]});
export function safeReadingPath(value:unknown):string|null{
 if(typeof value!=='string'||value.length>500||!/^\/(fr|en|pt-br|nl)\//.test(value)||/[\\\u0000-\u0020]/.test(value))return null;
 try{const url=new URL(value,'https://blogdungaucher.com');if(url.origin!=='https://blogdungaucher.com'||!/^\/(fr|en|pt-br|nl)\//.test(url.pathname))return null;return url.pathname;}catch{return null;}
}
export function normalizeReadingState(value:unknown):ReadingState{
 const result=emptyReadingState();if(!value||typeof value!=='object')return result;
 const data=value as Record<string,unknown>;
 const saved=Array.isArray(data.saved)?data.saved:[];const visited=new Set<string>();
 for(const item of saved){if(!item||typeof item!=='object')continue;const url=safeReadingPath(item.url);if(!url||visited.has(url)||typeof item.title!=='string')continue;visited.add(url);result.saved.push({url,title:item.title.slice(0,300),format:typeof item.format==='string'?item.format.slice(0,24):'article',addedAt:Number.isFinite(item.addedAt)?item.addedAt:0});if(result.saved.length===200)break;}
 visited.clear();
 for(const item of Array.isArray(data.progress)?data.progress:[]){if(!item||typeof item!=='object')continue;const url=safeReadingPath(item.url);if(!url||visited.has(url)||typeof item.title!=='string'||!Number.isFinite(item.ratio))continue;visited.add(url);result.progress.push({url,title:item.title.slice(0,300),anchor:typeof item.anchor==='string'?item.anchor.slice(0,300):'',ratio:Math.max(0,Math.min(1,item.ratio)),updatedAt:Number.isFinite(item.updatedAt)?item.updatedAt:0});if(result.progress.length===300)break;}
 result.completed=[...new Set((Array.isArray(data.completed)?data.completed:[]).map(safeReadingPath).filter((v):v is string=>!!v))].slice(0,500);
 return result;
}
