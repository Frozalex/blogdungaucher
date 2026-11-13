#!/usr/bin/env python3
"""Contrôle ciblé des cinq dossiers ; utilise le compteur éditorial du projet."""
from pathlib import Path
import importlib.util
import json
import re

ROOT = Path(__file__).resolve().parents[3]
BASE = Path("/home/nerv/Documents/ChatGPT/Blog d'un gaucher/refonte-2026-11-13/baseline")
spec = importlib.util.spec_from_file_location('editorial_volume', ROOT / 'scripts/audit-editorial-volume.py')
volume = importlib.util.module_from_spec(spec)
spec.loader.exec_module(volume)
FILES = ['science/echecs-et-memoire.md', 'esprit/echecs-et-concentration.md', 'esprit/analyser-ses-parties.md', 'science/echecs-alphazero-stockfish.md', 'esprit/formation-des-habitudes-aux-echecs.md']

def frontmatter(text):
    return re.split(r'^---\s*$', text, maxsplit=2, flags=re.M)[1]

def fields(text):
    return {m[1]: m[2].strip() for m in re.finditer(r'^([\w]+):([^\n]*(?:\n(?:[ \t]+[^\n]*|))*?)\n(?=[\w]+:|\s*\Z)', frontmatter(text) + '\n', re.M)}

rows = []
for name in FILES:
    relative = Path('src/content/blog') / name
    old = (BASE / relative).read_text()
    new = (ROOT / relative).read_text()
    oldfields, newfields = fields(old), fields(new)
    mediafields = [key for key in oldfields if re.search('heroImage|ogImage|credit|license', key, re.I)]
    assert 'heroImage' in mediafields and 'ogImage' in mediafields
    for key in mediafields:
        assert oldfields[key] == newfields[key], (name, key)
    images = lambda text: re.findall(r'!\[[^\]]*\]\([^)]*\)|<img\b[^>]*>', text)
    assert images(old) == images(new), name
    assert oldfields['publishDate'] == newfields['publishDate'], name
    assert newfields['updatedDate'] == '"2026-11-13"', name
    assert new.count('—') <= old.count('—'), name
    before, after = volume.words(old), volume.words(new)
    assert after >= before * .85, name
    beforeheads = re.findall(r'^#{2,6} (.+)$', volume.body(old), re.M)
    afterheads = re.findall(r'^#{2,6} (.+)$', volume.body(new), re.M)
    assert all(h in afterheads for h in beforeheads), name
    rows.append(dict(path=relative.as_posix(), before=before, after=after, change=after-before, changePercent=round(100*(after-before)/before, 1), headingsBefore=len(beforeheads), headingsAfter=len(afterheads), preservedMediaFields=mediafields, bodyImagesPreserved=True, publicationDatePreserved=True))
report = dict(date='2026-11-13', baseline=str(BASE), counter='scripts/audit-editorial-volume.py:words', articles=rows, beforeTotal=sum(r['before'] for r in rows), afterTotal=sum(r['after'] for r in rows))
print(json.dumps(report, ensure_ascii=False, indent=2))
