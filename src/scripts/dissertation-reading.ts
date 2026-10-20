let stopReadingProgress: (() => void) | undefined;

function initDissertationReading() {
  stopReadingProgress?.();
  stopReadingProgress = undefined;
  const body = document.querySelector<HTMLElement>('.dissertation-page .article-body');
  const fill = document.querySelector<HTMLElement>('.dissertation-page #reading-progress-fill');
  if (!body || !fill) return;

  const controller = new AbortController();
  let frame = 0;
  function update() {
    frame = 0;
    if (!body || !fill) return;
    const rect = body.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight + 96);
    const progress = Math.min(1, Math.max(0, (96 - rect.top) / distance));
    fill.style.transform = `scaleX(${progress})`;
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true, signal: controller.signal });
  window.addEventListener('resize', schedule, { signal: controller.signal });
  const observer = new ResizeObserver(schedule);
  observer.observe(body);
  schedule();
  stopReadingProgress = () => {
    controller.abort();
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
}

initDissertationReading();
document.addEventListener('astro:page-load', initDissertationReading);
document.addEventListener('astro:before-swap', () => stopReadingProgress?.());
