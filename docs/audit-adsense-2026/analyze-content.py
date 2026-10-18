from pathlib import Path
import yaml,json,re,datetime,collections,itertools
now=datetime.date(2026,10,18);rows=[]
for f in Path('src/content').rglob('*.md'):
 raw=f.read_text(encoding='utf-8-sig');parts=re.split(r'^---\s*$',raw,maxsplit=2,flags=re.M)
 if len(parts)<3:continue
 try:d=yaml.safe_load(parts[1]); body=parts[2]
 except Exception:continue
 if not isinstance(d,dict):continue
 date=d.get('publishDate');date=datetime.date.fromisoformat(str(date)[:10]) if date else None
 lang=f.parts[3] if 'blog-translations' in f.parts else 'fr'
 links=re.findall(r'https?://[^\s<>\)"\]]+',body); refs=bool(re.search(r'^#{1,4}\s+.*(?:[Rr]éférences|[Rr]eferences|[Ss]ources|[Bb]ibliogr|[Rr]eferências)',body,re.M));clean=re.sub(r'!\[[^\]]*\]\([^)]*\)|<[^>]+>',' ',body); tokens=re.findall(r'\b\w+\b',clean.lower());shingles=set(zip(tokens,tokens[1:],tokens[2:],tokens[3:],tokens[4:]));
 slug=f.stem; url=('/fr/dissertations/' if 'dissertations' in f.parts else f'/{lang}/blog/')+(str(d.get('enSlug',slug)) if lang=='en' else slug)+'/'
 rows.append({'file':str(f),'lang':lang,'url':'https://blogdungaucher.com'+url,'frSlug':d.get('frSlug',slug),'publishedSource':date is not None and date<=now,'date':str(date) if date else None,'draft':d.get('draft',False),'wordsApprox':len(tokens),'externalLinks':len(set(links)),'referenceSection':refs,'pdfLinks':len(re.findall(r'\.pdf(?:\b|[?#])',body)),'category':d.get('category'),'title':d.get('title'),'shingles':shingles,'body':body})
fr={r['frSlug']:r for r in rows if r['lang']=='fr' and '/blog/' in r['url']}
for r in rows:
 if r['lang']!='fr':r['publishedSource']=fr.get(r['frSlug'],{}).get('publishedSource',False)
# Broad comparison flags related phrasing, never proves plagiarism or redundant intent.
pairs=[]
for lang in ['fr','en','pt-br','nl']:
 group=[r for r in rows if r['lang']==lang and r['publishedSource'] and not r['draft']]
 for a,b in itertools.combinations(group,2):
  union=a['shingles']|b['shingles']; score=len(a['shingles']&b['shingles'])/len(union) if union else 0
  if score>=.12:pairs.append({'file1':a['file'],'file2':b['file'],'jaccard5':round(score,3)})
for r in rows:r.pop('shingles');r.pop('body')
Path('docs/audit-adsense-2026/content-inventory.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));Path('docs/audit-adsense-2026/content-similarity.json').write_text(json.dumps(pairs,ensure_ascii=False,indent=2))
print('source docs',len(rows),'by lang',dict(collections.Counter(r['lang'] for r in rows)),'published FR',sum(r['lang']=='fr' and r['publishedSource'] for r in rows),'similar pairs',len(pairs));print('FR published science no section refs',[(r['file'],r['externalLinks']) for r in rows if r['lang']=='fr' and r['publishedSource'] and r['category']=='science' and not r['referenceSection']]);print('grand oral',[(r['file'],r['wordsApprox'],r['pdfLinks']) for r in rows if r['category']=='grand-oral' and r['publishedSource']])
