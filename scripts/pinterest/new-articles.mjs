import {isEligible} from './content.mjs';
const DAY=86_400_000;
/** Reserve the two complementary slots; never replay entries exposed before migration. */
export function newArticleReleases(posts,config){
 const policy=config.newArticleDelivery;
 if(!policy)return new Map();
 const start=new Date(policy.from).getTime();
 if(!Number.isFinite(start)||!Array.isArray(policy.metricool))throw new Error('Invalid new article delivery policy');
 const slugs=new Set(),reserved=new Set();
 for(const entry of policy.metricool){
  const date=new Date(entry.releaseAt),time=date.getTime();
  if(slugs.has(entry.slug)||reserved.has(time)||!Number.isFinite(time)||time<start||![1,4].includes(date.getUTCDay())||date.getUTCHours()!==14||date.getUTCMinutes()||date.getUTCSeconds()||date.getUTCMilliseconds())throw new Error('Invalid or duplicate Metricool reservation');
  slugs.add(entry.slug);reserved.add(time);
 }
 const remaining=posts.filter(p=>isEligible(p,config,new Date('2100-01-01'))&&new Date(p.publishedAt).getTime()>=start&&!slugs.has(p.slug)).sort((a,b)=>a.publishedAt.localeCompare(b.publishedAt)||a.slug.localeCompare(b.slug));
 const result=new Map();
 let cursor=start;
 for(const p of remaining){
  cursor=Math.max(cursor,new Date(p.publishedAt).getTime());
  const day=new Date(cursor);day.setUTCHours(14,0,0,0);
  if(day.getTime()<cursor)day.setUTCDate(day.getUTCDate()+1);
  while(![1,4].includes(day.getUTCDay())||reserved.has(day.getTime()))day.setUTCDate(day.getUTCDate()+1);
  result.set(p.slug,day.toISOString());cursor=day.getTime()+DAY;
 }
 return result;
}
