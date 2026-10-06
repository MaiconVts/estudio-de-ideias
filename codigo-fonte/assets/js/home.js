// assets/js/home.js
// Página inicial: busca, filtros, teclas de área e sugestões a partir de window.estudioIdeias.

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const filterFieldSelect = document.getElementById("filter-field");
  const sortBySelect = document.getElementById("sort-by");
  const yearFilterSelect = document.getElementById("year-filter");
  const areaFilterSelect = document.getElementById("area-filter");
  const projectListContainer = document.getElementById("lista-projetos");
  const suggestionsContainer = document.getElementById("search-suggestions");
  const verMaisBtn = document.getElementById("ver-mais-btn");
  const resultCount = document.getElementById("result-count");
  const unfoldBtn = document.querySelector(".packet__unfold");
  const areaKeys = document.querySelectorAll(".area-key");

  const PROJECTS_PER_LOAD = 8;

  const SORT_MAP = { relevance: "", "date-desc": "newest", "date-asc": "oldest", citations: "citations" };

  let currentPage = 1;
  let shownCount = 0;
  let activeSuggestionIndex = -1;
  let filters = { search: "", searchBy: "all", sortBy: "relevance", year: "", area: "" };

  const api = () => window.estudioIdeias.projects;
  const formatNumber = (n) => window.estudioIdeiasUtils.formatNumber(n);

  // --- Cartão (compartilhado em projetos-utils.js) ---
  function renderProjectCard(project) {
    const favorites = window.estudioIdeias.favorites;
    return window.estudioIdeiasUtils.createProjectElement(project, favorites ? favorites.isFavorite(project.id) : null);
  }

  function showMessage(text, { erro = false, limpar = false } = {}) {
    const p = document.createElement("p");
    p.className = "no-results-message";
    if (erro) p.dataset.tipo = "erro";
    p.textContent = text;
    if (limpar) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-ink";
      btn.textContent = "Limpar busca e filtros";
      btn.addEventListener("click", resetFilters);
      p.append(document.createElement("br"), btn);
    }
    projectListContainer.replaceChildren(p);
  }

  function updateCount(total) {
    if (!resultCount) return;
    const hasFilter = filters.search || filters.year || filters.area;
    if (total === 0) {
      resultCount.textContent = "Nenhum projeto encontrado";
    } else if (hasFilter) {
      resultCount.textContent = `${formatNumber(total)} ${total === 1 ? "projeto encontrado" : "projetos fictícios encontrados"} · exibindo ${shownCount}`;
    } else {
      resultCount.textContent = `${formatNumber(total)} projetos fictícios no acervo · exibindo ${shownCount}`;
    }
  }

  // --- Listagem ---
  function displayFilteredProjects() {
    const data = api().paginate({
      page: currentPage,
      perPage: PROJECTS_PER_LOAD,
      search: filters.search || null,
      searchBy: filters.searchBy,
      orderBy: SORT_MAP[filters.sortBy] || "newest",
      year: filters.year || null,
      area: filters.area || null,
    });

    if (currentPage === 1) {
      projectListContainer.replaceChildren();
      shownCount = 0;
    }

    const results = (data && data.results) || [];
    if (results.length) {
      const fragment = document.createDocumentFragment();
      results.forEach((project) => fragment.appendChild(renderProjectCard(project)));
      projectListContainer.appendChild(fragment);
      shownCount += results.length;
      projectListContainer.dispatchEvent(new CustomEvent("projetos:renderizados", { bubbles: true }));
    } else if (currentPage === 1) {
      showMessage("Nenhum projeto corresponde a essa busca. Tente outro termo ou abra os filtros.", { limpar: true });
    }

    const total = (data && data.total) || 0;
    verMaisBtn.hidden = shownCount >= total;
    updateCount(total);
  }

  function readFilters() {
    filters = {
      search: searchInput.value.toLowerCase().trim(),
      searchBy: filterFieldSelect.value,
      sortBy: sortBySelect.value,
      year: yearFilterSelect.value === "all" ? "" : yearFilterSelect.value,
      area: areaFilterSelect.value === "all" ? "" : areaFilterSelect.value,
    };
  }

  function handleFilterOrSortChange() {
    currentPage = 1;
    readFilters();
    syncAreaKeys();
    displayFilteredProjects();
  }

  function resetFilters() {
    searchInput.value = "";
    [filterFieldSelect, sortBySelect, yearFilterSelect, areaFilterSelect].forEach((s) => (s.selectedIndex = 0));
    handleFilterOrSortChange();
    searchInput.focus();
  }

  // --- Teclas de área (atalhos do select de área) ---
  function syncAreaKeys() {
    const value = areaFilterSelect.value;
    areaKeys.forEach((key) => key.setAttribute("aria-pressed", String(key.dataset.area === value)));
  }

  function fillHeroData() {
    const all = api().paginate({ page: 1, perPage: 10000 });
    const projects = all.results || [];
    const counts = {};
    projects.forEach((p) => (counts[p.area] = (counts[p.area] || 0) + 1));

    document.querySelectorAll("[data-total-projetos]").forEach((el) => (el.textContent = formatNumber(all.total)));
    document.querySelectorAll("[data-contagem]").forEach((el) => {
      const area = el.dataset.contagem;
      el.textContent = area === "all" ? all.total : counts[area] || 0;
    });

    const years = api().getAvailableYears().map(Number).filter(Boolean);
    if (years.length) {
      const range = `${Math.min(...years)}–${Math.max(...years)}`;
      document.querySelectorAll("[data-intervalo-anos]").forEach((el) => (el.textContent = range));
    }
  }

  function populateYearFilter() {
    const first = yearFilterSelect.options[0];
    yearFilterSelect.replaceChildren(first);
    api().getAvailableYears().forEach((year) => yearFilterSelect.add(new Option(year, year)));
  }

  // --- Sugestões ---
  function closeSuggestions() {
    suggestionsContainer.replaceChildren();
    suggestionsContainer.classList.remove("is-open");
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
    activeSuggestionIndex = -1;
  }

  function updateSuggestions() {
    const term = searchInput.value.toLowerCase().trim();
    const field = filterFieldSelect.value;
    closeSuggestions();
    if (term.length < 2) return;

    const { results = [] } = api().paginate({ search: term, searchBy: field, perPage: 5 });
    const items = [];
    results.forEach((project) => {
      let item = null;
      if ((field === "title" || field === "all") && project.title?.toLowerCase().includes(term)) {
        item = { text: project.title, fill: project.title, kind: "TÍT" };
      } else if ((field === "author" || field === "all") && project.author?.toLowerCase().includes(term)) {
        item = { text: project.author, fill: project.author, kind: "AUT" };
      }
      if (item && !items.some((i) => i.text.toLowerCase() === item.text.toLowerCase())) items.push(item);
    });

    if (!items.length) return;
    items.forEach((item, index) => {
      const option = document.createElement("div");
      option.className = "suggestion-item";
      option.id = `sugestao-${index}`;
      option.setAttribute("role", "option");
      option.dataset.kind = item.kind;
      option.textContent = item.text;
      option.addEventListener("click", () => {
        searchInput.value = item.fill;
        closeSuggestions();
        handleFilterOrSortChange();
      });
      suggestionsContainer.appendChild(option);
    });
    suggestionsContainer.classList.add("is-open");
    searchInput.setAttribute("aria-expanded", "true");
  }

  function updateActiveSuggestion(items) {
    items.forEach((item, index) => {
      const active = index === activeSuggestionIndex;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });
    if (items[activeSuggestionIndex]) searchInput.setAttribute("aria-activedescendant", items[activeSuggestionIndex].id);
  }

  // --- Eventos ---
  function setupEventListeners() {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      closeSuggestions();
      handleFilterOrSortChange();
      document.getElementById("acervo").scrollIntoView({ block: "start" });
    });

    searchInput.addEventListener("input", updateSuggestions);
    // Limpar pelo "x" do campo de busca restaura a lista
    searchInput.addEventListener("search", () => {
      if (!searchInput.value) handleFilterOrSortChange();
    });

    searchInput.addEventListener("keydown", (e) => {
      const items = suggestionsContainer.querySelectorAll(".suggestion-item");
      if (!items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        activeSuggestionIndex = (activeSuggestionIndex + step + items.length) % items.length;
        updateActiveSuggestion(items);
      } else if (e.key === "Enter" && activeSuggestionIndex > -1) {
        e.preventDefault();
        items[activeSuggestionIndex].click();
      } else if (e.key === "Escape") {
        closeSuggestions();
      }
    });

    [filterFieldSelect, sortBySelect, yearFilterSelect, areaFilterSelect].forEach((select) =>
      select.addEventListener("change", handleFilterOrSortChange)
    );

    areaKeys.forEach((key) =>
      key.addEventListener("click", () => {
        areaFilterSelect.value = key.dataset.area;
        areaFilterSelect.dispatchEvent(new Event("change"));
      })
    );

    unfoldBtn.addEventListener("click", () => {
      const open = searchForm.dataset.state !== "open";
      searchForm.dataset.state = open ? "open" : "folded";
      unfoldBtn.setAttribute("aria-expanded", String(open));
      document.getElementById("packet-filters").inert = !open;
      unfoldBtn.querySelector(".packet__unfold-label").textContent = open ? "Dobrar filtros" : "Mais filtros";
      if (open) filterFieldSelect.focus({ preventScroll: true });
    });

    verMaisBtn.addEventListener("click", () => {
      currentPage++;
      displayFilteredProjects();
    });

    document.addEventListener("click", (event) => {
      if (!searchForm.contains(event.target)) closeSuggestions();
    });
  }

  function initializeHomePage() {
    populateYearFilter();
    fillHeroData();
    setupEventListeners();
    handleFilterOrSortChange();
  }

  if (!window.estudioIdeias || !window.estudioIdeiasUtils || !projectListContainer) {
    if (projectListContainer) showMessage("Não foi possível iniciar o acervo.", { erro: true });
    return;
  }

  window.estudioIdeias.ready.then(initializeHomePage).catch(() => {
    showMessage(window.estudioIdeias.mensagemDeFalha, { erro: true });
    if (resultCount) resultCount.textContent = "Acervo indisponível";
  });
});
