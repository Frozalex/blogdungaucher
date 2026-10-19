#!/usr/bin/env python3
"""Inventaire éditorial en lecture seule des articles ; écrit uniquement ses rapports."""
import argparse
import json
import re
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def body(text):
    parts = re.split(r"^---\s*$", text, maxsplit=2, flags=re.M)
    return parts[2] if len(parts) == 3 else text


def words(text):
    text = body(text)
    text = re.sub(r"<!--[\s\S]*?-->", " ", text)
    text = re.sub(r"^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$", " ", text, flags=re.M)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"https?://\S+", " ", text)
    return len(re.findall(r"\b[^\W_]+(?:['’\-][^\W_]+)*\b", text))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", default="40dc7b9")
    parser.add_argument("--date", required=True, help="Date éditoriale AAAA-MM-JJ")
    args = parser.parse_args()
    from datetime import date
    date.fromisoformat(args.date)
    commit = subprocess.check_output(
        ["git", "rev-parse", "--verify", f"{args.base}^{{commit}}"], cwd=ROOT, text=True
    ).strip()
    rows = []
    for path in sorted((ROOT / "src/content/blog").rglob("*.md")):
        relative = path.relative_to(ROOT).as_posix()
        previous = subprocess.run(
            ["git", "show", f"{commit}:{relative}"], cwd=ROOT,
            text=True, capture_output=True,
        )
        if previous.returncode and "does not exist" not in previous.stderr and "exists on disk, but not in" not in previous.stderr:
            raise RuntimeError(previous.stderr)
        text = path.read_text()
        before = words(previous.stdout) if previous.returncode == 0 else None
        current = words(text)
        loss = before - current if before is not None else None
        pct = round(100 * loss / before, 1) if before else None
        published = re.search(r'^publishDate:\s*[\'"]?(\d{4}-\d{2}-\d{2})', text, re.M)
        noindex = bool(re.search(r'^noindex:\s*true\s*$', text, re.M))
        rows.append(dict(
            path=relative, category=path.parent.name,
            publication=published[1] if published else None,
            status=("publication inconnue" if not published else
                    "publié" if published[1] <= args.date else "programmé"),
            noindex=noindex, before=before, current=current, loss=loss, loss_pct=pct,
            alert=bool(before and loss / before > .15),
        ))
    comparable = [r for r in rows if r['before'] is not None]
    old = sum(r['before'] for r in comparable)
    now = sum(r['current'] for r in comparable)
    summary = dict(date=args.date, baseline=commit, articles=len(rows),
                   comparable=len(comparable), before=old, current=now,
                   loss_pct=round(100 * (old - now) / old, 1) if old else 0,
                   alerts=sum(r['alert'] for r in rows))
    out = ROOT / "docs/audits-editoriaux"
    out.mkdir(parents=True, exist_ok=True)
    name = f"volume-{args.date}"
    (out / f"{name}.json").write_text(json.dumps(dict(summary=summary, articles=rows), ensure_ascii=False, indent=2) + "\n")
    lines = [f"# Profondeur éditoriale : inventaire du {args.date}", "",
             f"Référence Git : `{commit}`. État actuel : fichiers de travail, modifications locales incluses.", "",
             f"Sur {len(comparable)} articles comparables : {old:,} mots avant, {now:,} maintenant, "
             f"soit une baisse nette de {summary['loss_pct']} %. {summary['alerts']} articles dépassent 15 % de réduction.", "",
             "Comptage approximatif du corps hors métadonnées, code, commentaires, balises, URL et images. "
             "Titres, tableaux et bibliographie inclus. Ni la longueur ni une alerte ne constituent un verdict de qualité.", "",
             "## Par rubrique", "",
             "| Rubrique | Articles comparables | Avant | Actuel | Baisse nette |",
             "| --- | ---: | ---: | ---: | ---: |"]
    for category in sorted(Counter(r['category'] for r in comparable)):
        group = [r for r in comparable if r['category'] == category]
        a, b = sum(r['before'] for r in group), sum(r['current'] for r in group)
        lines.append(f"| {category} | {len(group)} | {a} | {b} | {100*(a-b)/a:.1f} % |")
    lines += ["", "## Articles publiés à relire en priorité", "",
              "Tri par perte absolue, à compléter par une analyse qualitative et concurrentielle. "
              "Les pages noindex sont isolées ci-dessous pour éviter d’annuler une consolidation approuvée.", "",
              "| Article | Avant | Actuel | Réduction |", "| --- | ---: | ---: | ---: |"]
    ordered = sorted(rows, key=lambda r: r['loss'] if r['loss'] is not None else -10**9, reverse=True)
    for r in ordered:
        if r['alert'] and r['status'] == 'publié' and not r['noindex']:
            lines.append(f"| [{Path(r['path']).stem}](../../{r['path']}) | {r['before']} | {r['current']} | {r['loss_pct']} % |")
    for label, selected in [
        ("Articles programmés en alerte", [r for r in ordered if r['alert'] and r['status'] == 'programmé' and not r['noindex']]),
        ("Pages noindex : consolidation à examiner séparément", [r for r in ordered if r['noindex']]),
        ("Articles sans version de référence", [r for r in rows if r['before'] is None]),
    ]:
        lines += ["", f"## {label}", ""]
        lines += [f"- [{Path(r['path']).stem}](../../{r['path']}) : {r['current']} mots actuels" +
                  (f", {r['loss_pct']} % de réduction." if r['loss_pct'] is not None else ".") for r in selected] or ["Aucun."]
    lines += ["", "## État de la reprise", "",
              "Inventaire quantitatif réalisé. Voir [le suivi de reprise](reprise-2026-10-19.md). "
              "L’enrichissement de l’ensemble du corpus et la comparaison concurrentielle article par article "
              "ne sont pas achevés. Ne pas restaurer automatiquement "
              "les anciennes affirmations : les corrections de sources et de raisonnement restent nécessaires.", ""]
    (out / f"{name}.md").write_text("\n".join(lines))
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
