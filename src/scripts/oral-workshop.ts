import { trackEngagement } from "./engagement";
import { buildIntroduction, buildConclusion, matchesOralTopic } from "../utils/oral-generator";
import type { OralTopic, SpecialtyId } from "../data/oral-generator/types";
import { WORKSHOP_KEY, WORKSHOP_STEPS, emptyWorkshopState, parseWorkshopState, elapsedPracticeMs, formatPracticeTime, type WorkshopDraft, type WorkshopState, type WorkshopStep } from "./oral-workshop-state";

let activeRoot: HTMLElement | null = null;
let dispose: (() => void) | undefined;

function initOralGenerator() {
  const root = document.querySelector<HTMLElement>("[data-oral-generator]");
  if (root === activeRoot) return;
  dispose?.(); activeRoot = root;
  if (!root) return;
  const payload = root.querySelector("[data-oral-catalog]")?.textContent;
  if (!payload) return;
  const { topics, specialties, officialResources } = JSON.parse(payload) as {
    topics: OralTopic[];
    specialties: { id: SpecialtyId; short: string; track: string }[];
    officialResources: { label: string; url: string }[];
  };
  if (!topics.length) return;
  root.dataset.bound = "true";
  const controller = new AbortController(), { signal } = controller;
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const form = find<HTMLFormElement>("[data-builder-form]");
  const primary = find<HTMLSelectElement>("#oral-specialty"), second = find<HTMLSelectElement>("#oral-second");
  const theme = find<HTMLSelectElement>("#oral-theme"), query = find<HTMLInputElement>("#oral-query");
  const fields = [...root.querySelectorAll<HTMLTextAreaElement>("[data-draft]")];
  const steps = [...root.querySelectorAll<HTMLInputElement>("[data-step]")];
  const savedSelect = find<HTMLSelectElement>("[data-saved-drafts]");
  const timerTarget = find<HTMLInputElement>("#oral-timer-target");
  const timerButton = find<HTMLButtonElement>("[data-timer-toggle]");
  const confirmDialog = find<HTMLDialogElement>("[data-confirm]");
  let pendingConfirmation: (() => void) | undefined;
  const printValues = new Map<string, HTMLElement>();
  fields.forEach(field => {
    field.maxLength = 20000;
    const mirror = document.createElement("p"); mirror.className = "oral-builder__print-value";
    mirror.dataset.printFor = field.dataset.draft!; mirror.setAttribute("aria-hidden", "true");
    field.after(mirror); printValues.set(field.dataset.draft!, mirror);
  });
  const validKeys = new Set(topics.flatMap(topic => topic.variants.map((_, i) => `${topic.id}:${i}`)));
  let state: WorkshopState = emptyWorkshopState(`${topics[0].id}:0`);
  let persistenceBlocked = false, hasUnsavedChanges = false, allowLeave = false, lastWritten: string | null = null;
  let savedMessage = "Tes modifications seront enregistrées sur cet appareil.";
  try {
    const raw = localStorage.getItem(WORKSHOP_KEY);
    if (raw) {
      state = parseWorkshopState(raw, validKeys); lastWritten = raw;
      savedMessage = Object.keys(state.drafts).length ? "Tes brouillons ont été retrouvés sur cet appareil." : savedMessage;
    }
  } catch {
    persistenceBlocked = true;
    savedMessage = "La sauvegarde locale est indisponible ou illisible. Tes modifications restent ici pendant la visite : télécharge ta fiche avant de partir.";
  }
  let selected = topics[0], angle = 0, offset = 0;
  let matches: { topic: OralTopic; index: number }[] = [];
  const pageSize = 3;
  let elapsed = 0, startedAt: number | null = null, targetReached = false;
  let timerInterval: ReturnType<typeof setInterval> | undefined;
  let lastTimerSave = 0;
  const key = () => `${selected.id}:${angle}`;
  const elapsedNow = () => elapsedPracticeMs(elapsed, startedAt, Date.now());
  const label = (topic: OralTopic) => topic.specialties.map(id => specialties.find(s => s.id === id)?.short ?? id).join(" · ");

  function status(message: string) {
    const node = find("[data-save-status]");
    if (node.textContent !== message) node.textContent = message;
  }
  function resize(field: HTMLTextAreaElement) {
    field.style.height = "auto"; field.style.height = `${field.scrollHeight + 3}px`;
  }
  function defaults(topic: OralTopic, index: number): Record<string, string> {
    const variant = topic.variants[index];
    return { question: variant.question, introduction: buildIntroduction(topic, index), conclusion: buildConclusion(topic, index), notes: "", sources: "", objections: "", responses: "", "practice-notes": "", ...Object.fromEntries(variant.parts.flatMap((part, i) => [[`part-${i}`, part.title], [`points-${i}`, part.points.join("\n")]])) };
  }
  function renderSaved() {
    const entries = Object.entries(state.drafts).sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt));
    savedSelect.replaceChildren(new Option(entries.length ? "Choisir un brouillon…" : "Aucun brouillon enregistré", ""));
    for (const [draftKey, draft] of entries) {
      const topic = topics.find(t => draftKey.startsWith(`${t.id}:`))!;
      const title = draft.fields.question || topic.title;
      savedSelect.add(new Option(title.length > 100 ? `${title.slice(0, 97)}…` : title, draftKey));
    }
    savedSelect.value = state.drafts[key()] ? key() : "";
    find<HTMLButtonElement>("[data-forget-drafts]").disabled = !entries.length && !persistenceBlocked;
  }
  function persist() {
    if (persistenceBlocked) { status(savedMessage); return; }
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(WORKSHOP_KEY, serialized); lastWritten = serialized; hasUnsavedChanges = false;
      savedMessage = "Brouillons enregistrés sur cet appareil. Aucun texte n’est envoyé.";
      status(savedMessage);
    } catch {
      persistenceBlocked = true;
      savedMessage = "La sauvegarde sur cet appareil a échoué. Tes modifications restent dans cette page : télécharge ta fiche avant de partir.";
      status(savedMessage);
    }
  }
  function saveDraft(persistNow = true) {
    const values = Object.fromEntries(fields.map(field => [field.dataset.draft!, field.value]));
    const completed = steps.filter(field => field.checked).map(field => field.dataset.step as WorkshopStep);
    const model = defaults(selected, angle);
    const changed = Object.keys(values).some(name => values[name] !== (model[name] ?? ""));
    const draft: WorkshopDraft = { fields: values, completed, elapsedMs: elapsedNow(), targetMinutes: Number(timerTarget.value) || 10, updatedAt: new Date().toISOString() };
    if (changed || completed.length || draft.elapsedMs > 0 || draft.targetMinutes !== 10 || state.drafts[key()]) state.drafts[key()] = draft;
    state.selected = key();
    fields.forEach(field => { printValues.get(field.dataset.draft!)!.textContent = field.value; });
    if (persistNow) persist();
    renderSaved();
  }
  function renderProgress() {
    const completed = steps.filter(step => step.checked).map(step => step.dataset.step);
    find("[data-progress]").textContent = `${completed.length} étape${completed.length === 1 ? "" : "s"} sur 5 cochée${completed.length === 1 ? "" : "s"}`;
    root!.querySelectorAll<HTMLElement>("[data-step-link]").forEach(link => {
      const done = completed.includes(link.dataset.stepLink);
      link.classList.toggle("is-complete", done);
      link.querySelector("span")!.textContent = done ? "✓" : String(WORKSHOP_STEPS.indexOf(link.dataset.stepLink as WorkshopStep) + 1).padStart(2, "0");
    });
  }
  function renderTimer() {
    const value = elapsedNow(), goal = (Number(timerTarget.value) || 10) * 60000;
    find("[data-timer-output]").textContent = formatPracticeTime(value);
    timerButton.textContent = startedAt === null ? (value > 0 ? "Reprendre" : "Démarrer") : "Mettre en pause";
    timerButton.setAttribute("aria-pressed", String(startedAt !== null));
    timerTarget.disabled = startedAt !== null;
    find("[data-timer-output]").classList.toggle("is-over-target", value >= goal);
    if (startedAt !== null && value >= goal && !targetReached) {
      targetReached = true;
      find("[data-timer-status]").textContent = "Objectif de durée atteint. Le chronomètre continue pour mesurer la fin de ton essai.";
    }
  }
  function pauseTimer(announce = false) {
    if (startedAt !== null) { elapsed = elapsedNow(); startedAt = null; }
    if (timerInterval) clearInterval(timerInterval); timerInterval = undefined;
    renderTimer();
    if (announce) find("[data-timer-status]").textContent = `Pause à ${formatPracticeTime(elapsed)}.`;
  }
  function requestConfirmation(message: string, action: () => void) {
    pendingConfirmation = action;
    find("[data-confirm-message]").textContent = message;
    confirmDialog.showModal(); find<HTMLButtonElement>("[data-confirm-cancel]").focus();
  }
  find("[data-confirm-cancel]").addEventListener("click", () => { pendingConfirmation = undefined; confirmDialog.close(); }, { signal });
  confirmDialog.addEventListener("cancel", () => { pendingConfirmation = undefined; }, { signal });
  find("[data-confirm-accept]").addEventListener("click", () => { const action = pendingConfirmation; pendingConfirmation = undefined; confirmDialog.close(); action?.(); }, { signal });

  function addLink(list: HTMLElement, href: string, text: string) {
    const item = document.createElement("li"), link = document.createElement("a");
    link.href = href; link.textContent = `${text} ↗`; link.target = "_blank"; link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${text} (nouvel onglet)`); item.append(link); list.append(item);
  }
  function choose(topic: OralTopic, index: number, moveFocus = true, saveCurrent = true) {
    if (saveCurrent) { pauseTimer(); saveDraft(); }
    selected = topic; angle = index; state.selected = key();
    const stored = state.drafts[key()], values = { ...defaults(topic, index), ...stored?.fields };
    fields.forEach(field => { field.value = values[field.dataset.draft!] ?? ""; resize(field); printValues.get(field.dataset.draft!)!.textContent = field.value; });
    steps.forEach(field => { field.checked = stored?.completed.includes(field.dataset.step as WorkshopStep) ?? false; });
    elapsed = stored?.elapsedMs ?? 0; startedAt = null; timerTarget.value = String(stored?.targetMinutes ?? 10); targetReached = false;
    renderProgress(); renderTimer(); find("[data-timer-status]").textContent = elapsed > 0 ? "La durée du dernier essai a été retrouvée. Le chronomètre est en pause." : "";
    find("#oral-sheet-heading").textContent = topic.title;
    find("[data-sheet-specialties]").textContent = label(topic);
    find("[data-personalize]").textContent = topic.personalize;
    const notions = find("[data-notions]"); notions.replaceChildren();
    topic.notions.forEach(notion => { const span = document.createElement("span"); span.textContent = notion; notions.append(span); });
    root!.querySelectorAll<HTMLButtonElement>("[data-angle]").forEach((button, i) => { button.textContent = topic.variants[i].angle; button.setAttribute("aria-pressed", String(index === i)); });
    const resources = find("[data-official-resources]"); resources.replaceChildren();
    const isStav = topic.specialties.includes("stav");
    officialResources.filter((_, i) => isStav ? i === 3 : i < 3).forEach(resource => addLink(resources, resource.url, resource.label));
    const guidance = find("[data-practice-guidance]"); guidance.replaceChildren();
    if (isStav) guidance.append("STAV : règle la durée selon l’exercice et les modalités de ton oral terminal agricole. Le réglage proposé n’est pas une durée réglementaire STAV.");
    else {
      guidance.append("Tu peux viser les 10 minutes de présentation du Grand oral, ou une durée plus courte pour travailler un passage. ");
      const source = document.createElement("a"); source.href = officialResources[0].url; source.textContent = "Voir les modalités officielles"; source.target = "_blank"; source.rel = "noopener noreferrer"; guidance.append(source);
    }
    const reading = find("[data-reading-list]"); reading.replaceChildren();
    (topic.articles ?? []).forEach(slug => addLink(reading, `/fr/blog/${slug}/`, slug.startsWith("guide-") ? "Ouvrir le guide pour travailler cet exemple" : "Explorer le sujet sur le blog"));
    find("[data-reading]").hidden = !reading.children.length;
    find("[data-export-status]").textContent = ""; find("[data-copy-fallback]").hidden = true;
    renderCards(); renderSaved();
    if (saveCurrent) persist();
    if (moveFocus) { find("#oral-sheet-heading").focus(); find("[data-sheet]").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }
  }
  function renderCards() {
    const results = find("[data-results]"); results.replaceChildren();
    const subset = matches.slice(offset, offset + pageSize);
    for (const { topic, index } of subset) {
      const card = document.createElement("button"); card.type = "button"; card.className = "oral-builder__card";
      card.setAttribute("aria-pressed", String(topic.id === selected.id && index === angle));
      const meta = document.createElement("span"); meta.className = "oral-builder__card-meta"; meta.textContent = `${label(topic)} · ${topic.variants[index].angle}`;
      const title = document.createElement("span"); title.className = "oral-builder__card-title"; title.textContent = topic.variants[index].question;
      const action = document.createElement("span"); action.className = "oral-builder__card-action"; action.textContent = "Construire ma fiche →";
      card.append(meta, title, action); card.addEventListener("click", () => choose(topic, index)); results.append(card);
    }
    find("[data-empty]").hidden = matches.length > 0;
    find("[data-results-count]").textContent = `${matches.length} problématique${matches.length === 1 ? "" : "s"} dans le catalogue pour ces critères`;
    find("[data-results-range]").textContent = matches.length ? `${offset + 1}–${offset + subset.length} sur ${matches.length}` : "";
    find<HTMLButtonElement>("[data-previous]").disabled = offset === 0;
    find<HTMLButtonElement>("[data-next]").disabled = offset + pageSize >= matches.length;
  }
  function syncSpecialties() {
    const tech = specialties.find(s => s.id === primary.value)?.track === "techno";
    find("[data-second-field]").hidden = tech; second.disabled = tech || !primary.value;
    for (const option of second.options) option.disabled = option.value !== "" && option.value === primary.value;
    if (tech || !primary.value || second.value === primary.value) second.value = "";
    const note = find("[data-track-note]"); note.hidden = !tech;
    note.textContent = primary.value === "stav" ? "STAV : ces pistes concernent l’oral terminal agricole. Relie-les à ton parcours et aux modalités de ton épreuve, accessibles dans la fiche." : "Voie technologique : pars de ton projet et précise les enseignements de spécialité mobilisés. Le filtre porte ici sur ta série.";
  }
  function search() {
    syncSpecialties();
    const filtered = topics.filter(topic => matchesOralTopic(topic, { specialty: primary.value, second: second.value, theme: theme.value, query: query.value }));
    matches = [0, 1].flatMap(index => filtered.map(topic => ({ topic, index }))); offset = 0;
    // Keep the current draft usable even when a filter returns no suggestion.
    if (matches.length && !matches.some(m => m.topic.id === selected.id && m.index === angle)) choose(matches[0].topic, matches[0].index, false);
    else renderCards();
  }
  form.addEventListener("submit", event => { event.preventDefault(); search(); trackEngagement("tool_use", {tool:"grand-oral",action:"search"}); }, { signal });
  primary.addEventListener("change", search, { signal }); second.addEventListener("change", search, { signal }); theme.addEventListener("change", search, { signal }); query.addEventListener("input", search, { signal });
  form.addEventListener("reset", () => { setTimeout(() => { if (!signal.aborted) { search(); query.focus(); } }, 0); }, { signal });
  find("[data-previous]").addEventListener("click", () => { offset = Math.max(0, offset - pageSize); renderCards(); }, { signal });
  find("[data-next]").addEventListener("click", () => { offset = Math.min(Math.max(0, matches.length - 1), offset + pageSize); renderCards(); }, { signal });
  root.querySelectorAll<HTMLButtonElement>("[data-angle]").forEach(button => button.addEventListener("click", () => choose(selected, Number(button.dataset.angle), false), { signal }));
  fields.forEach(field => field.addEventListener("input", () => { hasUnsavedChanges = true; resize(field); saveDraft(); }, { signal }));
  steps.forEach(field => field.addEventListener("change", () => { hasUnsavedChanges = true; renderProgress(); saveDraft(); }, { signal }));
  savedSelect.addEventListener("change", () => {
    const value = savedSelect.value; if (!validKeys.has(value)) return;
    const topic = topics.find(t => value.startsWith(`${t.id}:`))!;
    primary.value = ""; second.value = ""; theme.value = ""; query.value = "";
    choose(topic, Number(value.slice(value.lastIndexOf(":") + 1))); search();
  }, { signal });
  find("[data-reset-draft]").addEventListener("click", () => requestConfirmation("Les textes, les étapes cochées et la durée de cet angle seront remplacés par le modèle. Télécharge ta fiche si tu veux en garder une copie. Les autres brouillons seront conservés.", () => {
    pauseTimer(); delete state.drafts[key()]; choose(selected, angle, false, false); hasUnsavedChanges = true; persist(); renderSaved();
  }), { signal });
  find("[data-forget-drafts]").addEventListener("click", () => requestConfirmation("Tous les brouillons du Grand oral enregistrés sur cet appareil seront effacés, y compris la fiche affichée. Télécharge d’abord les fiches que tu veux conserver.", () => {
    pauseTimer(); state = emptyWorkshopState(key()); hasUnsavedChanges = false;
    try { localStorage.removeItem(WORKSHOP_KEY); lastWritten = null; persistenceBlocked = false; } catch { persistenceBlocked = true; }
    savedMessage = persistenceBlocked ? "L’accès au stockage reste bloqué. La page a été remise à zéro, mais l’effacement sur cet appareil n’a pas pu être confirmé." : "Les brouillons de cet appareil ont été effacés.";
    choose(selected, angle, false, false); status(savedMessage); renderSaved();
  }), { signal });
  timerButton.addEventListener("click", () => {
    hasUnsavedChanges = true;
    if (startedAt !== null) { pauseTimer(true); saveDraft(); return; }
    startedAt = Date.now(); targetReached = elapsed >= Number(timerTarget.value) * 60000; lastTimerSave = Date.now();
    find("[data-timer-status]").textContent = "Chronomètre démarré. Parle à voix haute ; la page ne t’enregistre pas.";
    renderTimer();
    timerInterval = setInterval(() => { renderTimer(); if (Date.now() - lastTimerSave >= 15000) { lastTimerSave = Date.now(); saveDraft(); } }, 250);
  }, { signal });
  timerTarget.addEventListener("change", () => {
    timerTarget.value = String(Math.max(1, Math.min(60, Math.round(Number(timerTarget.value) || 10))));
    targetReached = false; hasUnsavedChanges = true; renderTimer(); saveDraft();
  }, { signal });
  find("[data-timer-reset]").addEventListener("click", () => {
    if (elapsedNow() === 0) return;
    requestConfirmation("La durée de cet essai sera remise à zéro. Tes notes et le texte de ta fiche seront conservés.", () => { pauseTimer(); elapsed = 0; targetReached = false; renderTimer(); find("[data-timer-status]").textContent = "Le chronomètre est remis à zéro."; hasUnsavedChanges = true; saveDraft(); });
  }, { signal });
  const text = () => {
    saveDraft(); const d = Object.fromEntries(fields.map(field => [field.dataset.draft!, field.value]));
    return [selected.specialties.includes("stav") ? "MA FICHE D’ORAL TERMINAL STAV" : "MA FICHE DE GRAND ORAL", label(selected), "", "PROBLÉMATIQUE", d.question, "", "MINI INTRODUCTION", d.introduction, "", "PLAN", ...[0, 1, 2].flatMap(i => [`${i + 1}. ${d[`part-${i}`]}`, d[`points-${i}`], ""]), "MINI CONCLUSION", d.conclusion, "", "POUR EN FAIRE MON SUJET", selected.personalize, "", "MES EXEMPLES ET MES SOURCES", d.notes, "", "VÉRIFICATION DES SOURCES", d.sources, "", "QUESTIONS ET OBJECTIONS", d.objections, "", "MES RÉPONSES", d.responses, "", "RÉPÉTITION", `Durée : ${formatPracticeTime(elapsedNow())} · Objectif : ${timerTarget.value} min`, d["practice-notes"], "", "ÉTAPES COCHÉES", ...steps.map(step => `${step.checked ? "✓" : "□"} ${step.parentElement?.textContent?.trim()}`), "", "REPÈRES OFFICIELS", ...[...find("[data-official-resources]").querySelectorAll<HTMLAnchorElement>("a")].map(a => `${a.textContent} : ${a.href}`), "", "Préparé avec le Blog d’un Gaucher — https://blogdungaucher.com/fr/grand-oral/generateur/"].join("\n");
  };
  find("[data-copy]").addEventListener("click", async () => {
    const value = text();
    try { await navigator.clipboard.writeText(value); find("[data-export-status]").textContent = "Ta fiche a été copiée."; }
    catch { const field = find<HTMLTextAreaElement>("#oral-copy-text"); field.value = value; find("[data-copy-fallback]").hidden = false; field.focus(); field.select(); find("[data-export-status]").textContent = "Sélectionne et copie le texte ci-dessous."; }
  }, { signal });
  find("[data-download]").addEventListener("click", () => {
    trackEngagement("tool_use", {tool:"grand-oral",action:"download"});
    const url = URL.createObjectURL(new Blob([text()], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `grand-oral-${selected.id}-${angle + 1}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    find("[data-export-status]").textContent = "Le téléchargement de ta fiche a été lancé.";
  }, { signal });
  find("[data-print]").addEventListener("click", () => { saveDraft(); window.print(); }, { signal });
  window.addEventListener("beforeunload", event => { saveDraft(); if (persistenceBlocked && hasUnsavedChanges && !allowLeave) { event.preventDefault(); event.returnValue = ""; } }, { signal });
  document.addEventListener("click", event => {
    if (!persistenceBlocked || !hasUnsavedChanges || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const target = new URL(link.href, location.href);
    if (target.pathname === location.pathname && target.search === location.search && target.origin === location.origin && target.hash) return;
    event.preventDefault(); event.stopPropagation();
    requestConfirmation("Tes dernières modifications n’ont pas pu être enregistrées. Annule pour télécharger ta fiche, ou confirme pour quitter cette page sans cette sauvegarde.", () => { allowLeave = true; location.assign(link.href); });
  }, { signal, capture: true });
  document.addEventListener("visibilitychange", () => { if (document.hidden) saveDraft(); }, { signal });
  window.addEventListener("storage", event => {
    if (event.key !== WORKSHOP_KEY || event.newValue === lastWritten) return;
    persistenceBlocked = true;
    savedMessage = "Les brouillons ont changé dans un autre onglet. Télécharge la fiche affichée, puis recharge la page pour retrouver la dernière sauvegarde. Aucun brouillon distant ne sera écrasé.";
    status(savedMessage);
  }, { signal });
  for (const selector of ["[data-builder-form]", "[data-suggestions]", "[data-angle-controls]", "[data-export]", "[data-draft-bar]", "[data-draft-actions]", "[data-timer-controls]"]) find(selector).hidden = false;
  const restoredTopic = topics.find(topic => state.selected.startsWith(`${topic.id}:`)) ?? topics[0];
  const restoredAngle = Number(state.selected.slice(state.selected.lastIndexOf(":") + 1));
  choose(restoredTopic, restoredAngle, false, false); search(); status(savedMessage);
  dispose = () => { pauseTimer(); saveDraft(); controller.abort(); root.querySelectorAll(".oral-builder__print-value").forEach(node => node.remove()); delete root.dataset.bound; };
}
initOralGenerator();
document.addEventListener("astro:page-load", initOralGenerator);
document.addEventListener("astro:before-swap", () => { dispose?.(); dispose = undefined; activeRoot = null; });
