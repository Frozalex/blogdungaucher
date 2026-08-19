/**
 * Filtre par rubrique des pages /blog/.
 *
 * Les listings sont paginés à 9 articles côté serveur. Filtrer les seules cartes
 * présentes dans le DOM ne montrerait donc que les articles de la page courante,
 * ce qui donne l'impression que le filtre « perd » des articles. On charge à la
 * place l'index complet de la langue (/blog-index/{lang}.json) au premier clic,
 * et on affiche toute la rubrique d'un coup — la pagination serveur n'a plus de
 * sens dans cet état, on la masque.
 *
 * Les cartes générées sont des clones d'un gabarit rendu par ArticleCard côté
 * serveur : c'est ce qui garantit qu'elles héritent des attributs `data-astro-cid-*`
 * du CSS scopé d'Astro, impossible à reproduire à la main sans dupliquer le hash.
 */

type IndexPost = {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
  iso: string;
  hero: string | null;
  heroAlt: string;
};

type CategoryMeta = { label: string; shortLabel: string; accent: string };

type BlogIndex = {
  categories: Record<string, CategoryMeta>;
  posts: IndexPost[];
};

const indexCache = new Map<string, Promise<BlogIndex>>();

function loadIndex(url: string): Promise<BlogIndex> {
  let pending = indexCache.get(url);
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`blog index ${res.status}`);
      return res.json() as Promise<BlogIndex>;
    });
    // Un échec réseau ne doit pas condamner la fonctionnalité pour la session.
    pending.catch(() => indexCache.delete(url));
    indexCache.set(url, pending);
  }
  return pending;
}

function setText(root: ParentNode, selector: string, value: string) {
  const el = root.querySelector(selector);
  if (el) el.textContent = value;
}

export function initBlogFilter() {
  const grid = document.getElementById("post-grid");
  const templates = document.getElementById("card-templates");
  if (!grid || !templates) return;

  // Le DOM est remplacé à chaque navigation ClientRouter : le drapeau repart à zéro.
  if (grid.dataset.filterReady === "1") return;
  grid.dataset.filterReady = "1";

  const indexUrl = grid.dataset.blogIndex;
  const chips = Array.from(
    document.querySelectorAll<HTMLElement>("[data-filter-category]"),
  );
  if (!indexUrl || !chips.length) return;

  const empty = document.getElementById("listing-empty");
  const count = document.getElementById("filter-count");
  // Wrapper neutre plutôt que le <nav class="pagination"> : son `display` scopé
  // l'emporterait sur la règle `[hidden]` de la feuille de style utilisateur.
  const pagination = document.getElementById("listing-pagination");
  const serverItems = Array.from(grid.children) as HTMLElement[];

  const heroTemplate = templates.querySelector<HTMLElement>('[data-template="hero"]');
  const plainTemplate = templates.querySelector<HTMLElement>('[data-template="plain"]');

  let generated: HTMLElement[] = [];
  let activeCategory = "all";

  function buildCard(post: IndexPost, meta: CategoryMeta | undefined) {
    const template = post.hero ? (heroTemplate ?? plainTemplate) : (plainTemplate ?? heroTemplate);
    if (!template) return null;

    const node = template.cloneNode(true) as HTMLElement;
    node.removeAttribute("data-template");
    node.hidden = false;
    node.dataset.category = post.category;

    const card = node.querySelector<HTMLElement>(".card");
    if (card && meta) card.style.setProperty("--accent", meta.accent);

    const link = node.querySelector<HTMLAnchorElement>(".card-link");
    if (link) link.href = post.href;

    const img = node.querySelector<HTMLImageElement>("img.card-thumb");
    if (img) {
      if (post.hero) {
        img.src = post.hero;
        img.alt = post.heroAlt;
      }
      // Le gabarit peut venir d'une carte above-the-fold rendue en priorité.
      img.loading = "lazy";
      img.setAttribute("fetchpriority", "auto");
    }

    setText(node, ".card-title", post.title);
    setText(node, ".card-excerpt", post.excerpt);
    setText(node, ".card-time", post.readingTime);

    const badge = node.querySelector(".card-badge");
    if (badge && meta) {
      badge.textContent = meta.label;
      badge.setAttribute("data-t", `categories.${post.category}.label`);
    }

    const kicker = node.querySelector(".card-thumb-fallback__kicker");
    if (kicker && meta) {
      kicker.textContent = meta.shortLabel;
      kicker.setAttribute("data-t", `categories.${post.category}.shortLabel`);
    }

    const time = node.querySelector<HTMLTimeElement>(".card-date");
    if (time) {
      time.dateTime = post.iso;
      time.textContent = post.date;
    }

    return node;
  }

  function clearGenerated() {
    generated.forEach((el) => el.remove());
    generated = [];
  }

  function showServerPage() {
    clearGenerated();
    serverItems.forEach((el) => {
      el.hidden = false;
    });
    if (pagination) pagination.hidden = false;
    if (count) count.hidden = true;
    if (empty) empty.hidden = true;
  }

  function showFiltered(index: BlogIndex, category: string) {
    const matches = index.posts.filter((p) => p.category === category);

    clearGenerated();
    serverItems.forEach((el) => {
      el.hidden = true;
    });

    generated = matches
      .map((post) => buildCard(post, index.categories[post.category]))
      .filter((node): node is HTMLElement => node !== null);
    if (grid) grid.append(...generated);

    // La grille porte .reveal-group : sans .is-visible ses enfants restent à opacity 0.
    grid?.classList.add("is-visible");

    if (pagination) pagination.hidden = true;
    if (empty) empty.hidden = matches.length > 0;
    if (count) {
      const template = count.dataset.countTemplate ?? "{count}";
      count.textContent = template.replace("{count}", String(matches.length));
      count.hidden = matches.length === 0;
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const category = chip.dataset.filterCategory ?? "all";
      activeCategory = category;
      chips.forEach((el) => {
        const isActive = el === chip;
        el.classList.toggle("is-active", isActive);
        el.setAttribute("aria-pressed", String(isActive));
      });

      if (category === "all") {
        showServerPage();
        return;
      }

      loadIndex(indexUrl!)
        .then((index) => {
          // L'utilisateur a pu recliquer pendant le chargement.
          if (activeCategory === category) showFiltered(index, category);
        })
        .catch(() => {
          // Index indisponible : on laisse la pagination serveur en place plutôt
          // que d'afficher une grille vide.
          showServerPage();
        });
    });
  });

  chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.classList.contains("is-active")));
  });

  // Pré-charge l'index dès qu'un chip est survolé/focalisé : le premier clic paraît instantané.
  const prefetch = () => void loadIndex(indexUrl!).catch(() => {});
  chips.forEach((chip) => {
    chip.addEventListener("pointerenter", prefetch, { once: true });
    chip.addEventListener("focus", prefetch, { once: true });
  });
}

// `astro:page-load` ne se déclenche au premier chargement qu'au `load` de la
// fenêtre (voir le ClientRouter d'Astro), donc après le chargement de toutes les
// images de la grille : les chips resteraient inertes plusieurs secondes. On
// initialise aussi dès l'exécution du module, qui suit le parsing du DOM.
initBlogFilter();
document.addEventListener("astro:page-load", initBlogFilter);
