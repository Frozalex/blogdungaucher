export function createPyodideLoader({ window, document, timeoutMs = 30_000 }) {
  const base = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
  return function loadOnce() {
    if (window.__pyodideReady) return window.__pyodideReady;
    let timer;
    let script;
    const loading = (async () => {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          script = document.createElement('script');
          script.src = `${base}pyodide.js`;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Échec du chargement de Pyodide'));
          document.head.appendChild(script);
        });
      }
      return window.loadPyodide({ indexURL: base });
    })();
    const pending = Promise.race([
      loading,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Délai de chargement de Pyodide dépassé')), timeoutMs); }),
    ]).catch(error => {
      if (window.__pyodideReady === pending) window.__pyodideReady = undefined;
      throw error;
    }).finally(() => {
      clearTimeout(timer);
      if (script) { script.onload = null; script.onerror = null; script.remove(); }
    });
    window.__pyodideReady = pending;
    return pending;
  };
}
