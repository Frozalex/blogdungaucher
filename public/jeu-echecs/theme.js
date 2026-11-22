// Utilise la même préférence que la navigation du Blog d’un Gaucher.
(() => {
  const key = "blogdungaucher.theme";
  let theme = "light";
  try {
    if (localStorage.getItem(key) === "dark") theme = "dark";
  } catch { /* Le thème fonctionne aussi pendant une session sans stockage. */ }

  function apply(next) {
    theme = next === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#181f1b" : "#ece9df");
    document.getElementById("theme-toggle")?.setAttribute("aria-pressed", String(theme === "dark"));
  }

  apply(theme);
  document.addEventListener("DOMContentLoaded", () => {
    apply(theme);
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
      apply(theme === "dark" ? "light" : "dark");
      try { localStorage.setItem(key, theme); } catch { /* Session en mémoire. */ }
    });
  }, { once: true });
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      try { apply(localStorage.getItem(key)); } catch { /* Conserve le thème courant. */ }
    }
  });
})();
