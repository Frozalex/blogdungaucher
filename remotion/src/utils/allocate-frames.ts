/** Répartition de durées (frames) pour séquences vidéo courtes. */

export function allocateParagraphFrames(
  paragraphs: string[],
  budgetFrames: number,
  fps: number,
  minSec = 2.5,
): number[] {
  const n = paragraphs.length;
  if (n === 0 || budgetFrames <= 0) return [];
  const minF = Math.max(1, Math.round(minSec * fps));

  const weights = paragraphs.map((p) => {
    const len = p.length;
    return len > 180 ? 4 : len > 90 ? 3.5 : 3;
  });
  const wSum = weights.reduce((a, b) => a + b, 0);

  let frames = weights.map((w) =>
    Math.max(minF, Math.round((w / wSum) * budgetFrames)),
  );

  let sum = frames.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (sum > budgetFrames && guard++ < budgetFrames) {
    const idx = frames.indexOf(Math.max(...frames));
    if (frames[idx] <= minF) break;
    frames[idx] -= 1;
    sum -= 1;
  }
  guard = 0;
  while (sum < budgetFrames && guard++ < budgetFrames) {
    frames[frames.length - 1] += 1;
    sum += 1;
  }

  return frames;
}

export function allocateBlockFrames(
  bodies: string[],
  usableFrames: number,
  fps: number,
): number[] {
  if (bodies.length === 0 || usableFrames <= 0) return [];
  const minF = Math.round(2.5 * fps);

  const secs = bodies.map((body) => {
    const len = body.length;
    return len > 220 ? 4 : len > 130 ? 4 : len > 60 ? 3.5 : 3;
  });

  const sumSec = secs.reduce((a, b) => a + b, 0);
  let frames = secs.map((s) =>
    Math.max(minF, Math.round((s / sumSec) * usableFrames)),
  );

  let sum = frames.reduce((a, b) => a + b, 0);
  let guard = 0;
  while (sum > usableFrames && guard++ < usableFrames) {
    const idx = frames.indexOf(Math.max(...frames));
    if (frames[idx] <= minF) break;
    frames[idx] -= 1;
    sum -= 1;
  }
  guard = 0;
  while (sum < usableFrames && guard++ < usableFrames) {
    frames[frames.length - 1] += 1;
    sum += 1;
  }

  return frames;
}
