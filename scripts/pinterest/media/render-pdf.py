import json,sys,pathlib,html,re,textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Flowable,Image,Table,TableStyle,Preformatted
from pypdf import PdfReader
ROOT=pathlib.Path.cwd();OUT=ROOT/'public/pinterest-media/pdf'
pdfmetrics.registerFont(TTFont('Studio',str(ROOT/'public/pinterest-media/assets/studio-regular.ttf')))
pdfmetrics.registerFont(TTFont('StudioBold',str(ROOT/'public/pinterest-media/assets/studio-bold.ttf')))
pdfmetrics.registerFont(TTFont('StudioMono',str(ROOT/'public/pinterest-media/assets/studio-mono.ttf')))
PAPER=HexColor('#f6f5f1');INK=HexColor('#171c1c');MUTED=HexColor('#596462')
W,H=595.276,841.89
def esc(s):
 return html.escape(re.sub('[\u2011\u2013\u2014]', '-', str(s))).replace('\n','<br/>')
MATH=json.loads((ROOT/'work/pinterest-media/math/index.json').read_text())
def rich(s):
 parts=[];last=0
 for m in re.finditer(r'\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$',s):
  parts.append(esc(s[last:m.start()]));tex=m.group(1) or m.group(2);asset=MATH[tex];scale=min(.42,440/asset['width']);parts.append('<img src="'+asset['file']+'" width="'+str(asset['width']*scale)+'" height="'+str(asset['height']*scale)+'" valign="middle"/>');last=m.end()
 parts.append(esc(s[last:]));return ''.join(parts)
class Board(Flowable):
 def __init__(self,fen):super().__init__();self.fen=fen;self.width=451;self.height=310
 def draw(self):
  c=self.canv;size=31;x0=102;y0=34;glyphs=dict(zip('KQRBNPkqrbnp','♔♕♖♗♘♙♚♛♜♝♞♟'))
  for row,rank in enumerate(self.fen.split()[0].split('/')):
   col=0
   for ch in rank:
    if ch.isdigit():col+=int(ch);continue
    if ch not in glyphs or col>7:raise ValueError('Invalid FEN')
    col+=1
   if col!=8:raise ValueError('Invalid FEN rank')
   for col in range(8):
    c.setFillColor(HexColor('#dce0da') if (row+col)%2 else HexColor('#ffffff'));c.rect(x0+col*size,y0+(7-row)*size,size,size,fill=1,stroke=0)
   col=0
   for ch in rank:
    if ch.isdigit():col+=int(ch);continue
    c.setFillColor(INK);c.setFont('Studio',26);c.drawCentredString(x0+(col+.5)*size,y0+(7-row)*size+6,glyphs[ch]);col+=1
  c.setFillColor(MUTED);c.setFont('Studio',8)
  for i in range(8):c.drawCentredString(x0+(i+.5)*size,y0-14,chr(97+i));c.drawRightString(x0-12,y0+i*size+12,str(i+1))

body=ParagraphStyle('Body',fontName='Studio',fontSize=11.5,leading=18,textColor=INK,spaceAfter=14,autoLeading='max')
small=ParagraphStyle('Small',parent=body,fontSize=9,leading=14,textColor=MUTED)
heading=ParagraphStyle('Heading',parent=body,fontName='StudioBold',fontSize=18,leading=23,spaceBefore=18,spaceAfter=12,keepWithNext=True)
class Cover(Flowable):
 def __init__(self,card):super().__init__();self.card=card;self.width=451;self.height=670
 def draw(self):
  c=self.canv;card=self.card;accent=HexColor(card['accent']);y=630
  c.setFillColor(MUTED);c.setFont('Studio',10);c.drawString(0,y,'FICHE DE LECTURE  /  '+card['categoryLabel'].upper());y-=55
  title=Paragraph(esc(card['title']),ParagraphStyle('Title',fontName='StudioBold',fontSize=31,leading=37,textColor=INK))
  _,height=title.wrap(451,250);title.drawOn(c,0,y-height);y-=height+30
  c.setStrokeColor(accent);c.setLineWidth(3);c.line(0,y,90,y);y-=36
  p=Paragraph(esc(card['description']),ParagraphStyle('Lead',parent=body,fontSize=13.2,leading=21))
  _,height=p.wrap(451,260);p.drawOn(c,0,y-height);y-=height
  if y<145:raise ValueError('Cover overflow '+card['id'])
  c.setStrokeColor(INK);c.setLineWidth(1);c.circle(30,95,30,fill=0);c.setFillColor(accent);c.roundRect(82,65,116,60,30,fill=1,stroke=0);c.setFillColor(INK);c.circle(232,95,9,fill=1,stroke=0)
  p=Paragraph('COMPRENDRE. NUANCER. APPROFONDIR.',small);p.wrap(451,25);p.drawOn(c,0,23)
def frame(c,doc,card):
 c.saveState();c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0);c.setFillColor(INK);c.setFont('StudioBold',8.4);c.drawString(60,H-42,'BLOG D’UN GAUCHER');c.setFillColor(HexColor(card['accent']));c.circle(W-65,H-39,5,fill=1,stroke=0)
 c.setStrokeColor(HexColor('#c4c7c2'));c.setLineWidth(.5);c.line(60,H-57,W-60,H-57);c.line(60,51,W-60,51)
 c.setFillColor(MUTED);c.setFont('Studio',8);c.drawString(60,32,'blogdungaucher.com');c.drawRightString(W-60,32,str(doc.page));c.restoreState()
def create(card):
 filename=OUT/(card['id']+'.pdf');doc=SimpleDocTemplate(str(filename),pagesize=(W,H),leftMargin=60,rightMargin=60,topMargin=80,bottomMargin=72,title=card['title'],author='Blog d’un Gaucher',subject=card['articleTitle'])
 story=[Cover(card),PageBreak(),Paragraph('Le passage, dans son contexte',heading),Paragraph('Cette fiche reprend un passage du dossier ci-dessous. Le texte complet et sa bibliographie permettent d’en approfondir le contexte.',small),Paragraph(esc(card['articleTitle']),ParagraphStyle('ArticleTitle',parent=body,fontName='StudioBold',fontSize=12,leading=18)),Spacer(1,12)]
 for block in card['section']:
  if block['type']=='code':
   text=block['text'].strip()
   if re.match(r'^[rnbqkpRNBQKP1-8/]+ [wb] ',text):story.append(Board(text))
   story.append(Preformatted('\n'.join(textwrap.fill(line,82,replace_whitespace=False,drop_whitespace=False) for line in text.splitlines()),ParagraphStyle('Code',fontName='StudioMono',fontSize=8.2,leading=11,spaceAfter=15)))
  elif block['type']=='table':
   rows=[row.split(' | ') for row in block['text'].split(' • ')];cols=max(map(len,rows));cells=[[Paragraph(rich(cell),small) for cell in row]+['']*(cols-len(row)) for row in rows];table=Table(cells,colWidths=[451/cols]*cols,repeatRows=1,hAlign='LEFT');table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),HexColor('#e2e5df')),('LINEBELOW',(0,0),(-1,0),.5,MUTED),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]));story.extend([table,Spacer(1,15)])
  elif block['text'].startswith('$$') and block['text'].endswith('$$'):
   asset=MATH[block['text'][2:-2]];scale=min(.6,451/asset['width']);story.extend([Image(asset['file'],width=asset['width']*scale,height=asset['height']*scale,hAlign='LEFT'),Spacer(1,16)])
  else:story.append(Paragraph(rich(block['text']),heading if block['type']=='heading' else body))
 story.extend([Spacer(1,20),Paragraph('Prolonger la lecture',heading),Paragraph('Relis le dossier complet pour retrouver les autres arguments, les exemples et les références citées. Cette fiche porte sur un angle précis ; elle ne remplace pas l’ensemble de l’article.',body),Paragraph('<link href="'+html.escape(card['articleUrl'],quote=True)+'" color="#254e6a">Ouvrir le dossier complet sur Blog d’un Gaucher</link>',body),Paragraph(esc(card['articleUrl']),small)])
 doc.build(story,onFirstPage=lambda c,d:frame(c,d,card),onLaterPages=lambda c,d:frame(c,d,card))
 reader=PdfReader(filename);text='\n'.join(page.extract_text() or '' for page in reader.pages)
 if len(reader.pages)<2 or card['title'][:30] not in re.sub(r'\s+',' ',text):raise ValueError('PDF verification failed '+card['id'])
 if any(len((page.extract_text()or'').strip())<50 for page in reader.pages):raise ValueError('Empty PDF page '+card['id'])
 return len(reader.pages)
items=[c for c in json.loads((ROOT/'work/pinterest-media/data.json').read_text())if c['format']=='pdf']
if '--limit=1' in sys.argv:items=items[:1]
results=[]
for i,card in enumerate(items):
 count=create(card);results.append({'id':card['id'],'pages':count});print(f'[pdf] {i+1}/{len(items)} {card["id"]} ({count} pages)',flush=True)
(ROOT/'work/pinterest-media/pdf-validation.json').write_text(json.dumps(results,indent=2))
