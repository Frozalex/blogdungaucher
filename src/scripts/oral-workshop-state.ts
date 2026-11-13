export const WORKSHOP_KEY = "bdg-grand-oral-v1";
export const WORKSHOP_STEPS = ["question", "reasoning", "sources", "objections", "practice"] as const;
export type WorkshopStep = typeof WORKSHOP_STEPS[number];
export const WORKSHOP_FIELDS = ["question", "introduction", "conclusion", "notes", "sources", "objections", "responses", "practice-notes", "part-0", "points-0", "part-1", "points-1", "part-2", "points-2"] as const;
export interface WorkshopDraft {
  fields: Record<string, string>;
  completed: WorkshopStep[];
  elapsedMs: number;
  targetMinutes: number;
  updatedAt: string;
}
export interface WorkshopState {
  version: 1;
  selected: string;
  drafts: Record<string, WorkshopDraft>;
}
export function emptyWorkshopState(selected: string): WorkshopState {
  return { version: 1, selected, drafts: {} };
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
export function parseWorkshopState(raw: string, validKeys: ReadonlySet<string>): WorkshopState {
  const value: unknown = JSON.parse(raw);
  if (!record(value) || value.version !== 1 || !record(value.drafts)) throw new Error("Brouillons non reconnus");
  const fallback = validKeys.values().next().value as string;
  const state = emptyWorkshopState(typeof value.selected === "string" && validKeys.has(value.selected) ? value.selected : fallback);
  for (const [key, entry] of Object.entries(value.drafts)) {
    if (!validKeys.has(key) || !record(entry) || !record(entry.fields)) continue;
    const fields: Record<string, string> = {};
    for (const name of WORKSHOP_FIELDS) {
      const field = entry.fields[name];
      if (typeof field === "string") {
        if (field.length > 20000) throw new Error("Brouillon trop volumineux");
        fields[name] = field;
      }
    }
    if (!Object.keys(fields).length) continue;
    state.drafts[key] = {
      fields,
      completed: Array.isArray(entry.completed) ? [...new Set(entry.completed.filter((v): v is WorkshopStep => typeof v === "string" && WORKSHOP_STEPS.includes(v as WorkshopStep)))] : [],
      elapsedMs: typeof entry.elapsedMs === "number" && Number.isFinite(entry.elapsedMs) ? Math.max(0, Math.min(entry.elapsedMs, 86400000)) : 0,
      targetMinutes: typeof entry.targetMinutes === "number" && Number.isFinite(entry.targetMinutes) ? Math.max(1, Math.min(60, Math.round(entry.targetMinutes))) : 10,
      updatedAt: typeof entry.updatedAt === "string" && Number.isFinite(Date.parse(entry.updatedAt)) ? entry.updatedAt : "",
    };
  }
  return state;
}
export function elapsedPracticeMs(accumulated: number, startedAt: number | null, now: number): number {
  return Math.max(0, accumulated + (startedAt === null ? 0 : Math.max(0, now - startedAt)));
}
export function formatPracticeTime(milliseconds: number): string {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
