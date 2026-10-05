// assets/js/openalex.js
// Leituras relacionadas a um projeto, vindas da API pública do OpenAlex (https://openalex.org).
//
// A cota gratuita do OpenAlex é por IP e por dia, então o uso é contido:
// - cache de 24 h por projeto no localStorage (reabrir a página não chama a API);
// - no máximo 1 chamada a cada 3 s e 30 por dia neste navegador;
// - uma requisição por vez, com tempo limite de 8 s;
// - em qualquer falha ou limite, usa o snapshot assets/data/referencias.json,
//   gerado por scripts/gerar_documentos.py.

(function () {
  const API = "https://api.openalex.org/works";
  const SNAPSHOT_URL = "assets/data/referencias.json";
  const CACHE_PREFIX = "openalex:v2:";
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
  const MIN_INTERVAL_MS = 3000;
  const DAILY_LIMIT = 30;
  const TIMEOUT_MS = 8000;
  const RESULTS = 5;

  // Termo em inglês da área, buscado como frase exata junto às tecnologias
  const AREA_TERMS = {
    frontend: "web interface",
    backend: "web services",
    mobile: "mobile application",
    redes: "computer network",
    "banco-dados": "database",
    seguranca: "information security",
  };

  let inFlight = null;

  const storage = {
    read(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        return null;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* armazenamento cheio ou bloqueado: segue sem cache */
      }
    },
  };

  function canCallApi() {
    const today = new Date().toISOString().slice(0, 10);
    const budget = storage.read("openalex:budget") || {};
    const used = budget.date === today ? budget.count : 0;
    const last = storage.read("openalex:last") || 0;
    if (used >= DAILY_LIMIT || Date.now() - last < MIN_INTERVAL_MS) return false;
    storage.write("openalex:budget", { date: today, count: used + 1 });
    storage.write("openalex:last", Date.now());
    return true;
  }

  function normalize(work) {
    const authors = (work.authorships || []).map((a) => a.author.display_name);
    return {
      titulo: work.display_name,
      ano: work.publication_year,
      autores: authors.slice(0, 3),
      mais_autores: authors.length > 3,
      fonte: work.primary_location?.source?.display_name || null,
      doi: work.doi,
      acesso_aberto: work.open_access?.oa_url || null,
      openalex: work.id,
    };
  }

  async function fetchFromApi(project) {
    // A área entra como frase exata para manter o tema; as tecnologias só refinam
    const term = AREA_TERMS[project.area] || "software engineering";
    const techs = (project.technologies || []).slice(0, 2).join(" ");
    const params = new URLSearchParams({
      search: `"${term}" ${techs}`.trim(),
      filter: "primary_topic.field.id:17,type:article,publication_year:2015-2025,cited_by_count:>10",
      "per-page": String(RESULTS),
      select: "id,display_name,publication_year,doi,authorships,primary_location,open_access",
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(`${API}?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`OpenAlex respondeu ${response.status}`);
      const data = await response.json();
      return data.results.map(normalize).filter((w) => w.titulo);
    } finally {
      clearTimeout(timer);
    }
  }

  async function fromSnapshot(project) {
    const response = await fetch(SNAPSHOT_URL);
    const data = await response.json();
    return (data.areas[project.area] || []).slice(0, RESULTS);
  }

  /**
   * Retorna { works, source: "api" | "cache" | "snapshot", savedAt }.
   */
  async function relatedWorks(project) {
    const key = CACHE_PREFIX + project.id;
    const cached = storage.read(key);
    if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
      return { works: cached.works, source: "cache", savedAt: cached.savedAt };
    }

    if (!inFlight && canCallApi()) {
      inFlight = fetchFromApi(project);
      try {
        const works = await inFlight;
        if (works.length) {
          const entry = { savedAt: Date.now(), works };
          storage.write(key, entry);
          return { works, source: "api", savedAt: entry.savedAt };
        }
      } catch (error) {
        console.warn("openalex: usando a seleção offline.", error.message);
      } finally {
        inFlight = null;
      }
    }

    return { works: await fromSnapshot(project), source: "snapshot", savedAt: null };
  }

  window.openAlex = { relatedWorks };
})();
