// paginaHome/assets/js/script.js (Refatorado para usar a API em window.estudioIdeias)

document.addEventListener("DOMContentLoaded", () => {
  // Seletores DOM Globais
  const searchInput = document.getElementById("search-input");
  const searchForm = document.getElementById("search-form");
  const filterFieldSelect = document.getElementById("filter-field");
  const sortBySelect = document.getElementById("sort-by");
  const yearFilterSelect = document.getElementById("year-filter");
  const areaFilterSelect = document.getElementById("area-filter");
  const projectListContainer = document.getElementById("lista-projetos");
  const projectTemplate = document.getElementById("projeto-template");
  // console.log('DEBUG: Elemento projectTemplate encontrado no DOM:', projectTemplate);
  const suggestionsContainer = document.getElementById("search-suggestions");
  const verMaisBtn = document.getElementById("ver-mais-btn");

  // Variáveis de estado para filtros e paginação
  let currentPage = 1;
  const PROJECTS_PER_LOAD = 8; // Quantos projetos carregar por vez

  // Estado atual dos filtros
  let currentSearchTerm = "";
  let currentSearchBy = "all";
  let currentSortBy = "relevance"; // Valor inicial do select
  let currentYear = ""; // Vazio para "Todos"
  let currentArea = ""; // Vazio para "Todas"

  // Mapeamento dos valores do select de ordenação para os valores da API
  function mapSortValue(selectValue) {
    const map = {
      "date-desc": "newest",
      relevance: "newest",
      "date-asc": "oldest",
      citations: "citations",
    };
    return map[selectValue] || "newest"; // Default para 'newest' se não mapeado
  }

  // --- FUNÇÕES DE RENDERIZAÇÃO ---
  function getDisplayArea(areaValue) {
    if (!areaValue) return "Não especificada";
    const areaMap = {
      networking: "Redes", // Se o JSON da API ainda usa 'networking'
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobile",
      "banco-dados": "Banco de Dados", // Se o JSON da API usa 'banco-dados'
      seguranca: "Segurança da Informação", // Se o JSON da API usa 'seguranca'
      database: "Banco de Dados", // Fallback se a API usar 'database'
      cybersecurity: "Segurança da Informação", // Fallback se a API usar 'cybersecurity'
    };
    return areaMap[String(areaValue).toLowerCase()] || areaValue;
  }

  function renderProjectCard(project) {
    if (!projectTemplate || !projectTemplate.content) {
      console.error(
        "ERRO em renderProjectCard: projectTemplate ou .content é inválido."
      );
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("project-card-error");
      errorDiv.textContent = `Erro: Template do card não pôde ser carregado.`;
      errorDiv.style.color = "red";
      return errorDiv;
    }
    const cardContent = projectTemplate.content.cloneNode(true);
    const cardElement = cardContent.firstElementChild;
    if (!cardElement) {
      console.error(
        "ERRO em renderProjectCard: Nenhum elemento filho encontrado dentro do template."
      );
      const errorDiv = document.createElement("div");
      errorDiv.textContent = "Erro interno no template do card.";
      errorDiv.style.color = "red";
      return errorDiv;
    }

    const titleLink = cardElement.querySelector(".project-title a");
    if (titleLink) {
      titleLink.textContent = project.title || "Título Indisponível";
      // A API (db.readAsSet) adiciona 'id' (UUID) ao objeto projeto.
      // Ajuste 'detalhes_projeto.html' para o nome correto da sua página de detalhes, se diferente.
      titleLink.href = `detalhes.html?id=${encodeURIComponent(
        project.id || ""
      )}`;
    }

    // Preenche o nome do autor no span com classe 'author-name-value'
    const authorNameSpan = cardElement.querySelector(".author-name-value");
    if (authorNameSpan) {
      authorNameSpan.textContent = project.author || "Desconhecido";
    }

    // Preenche o número de citações no span com classe 'citations-count-value'
    const citationsCountSpan = cardElement.querySelector(
      ".citations-count-value"
    );
    if (citationsCountSpan) {
      citationsCountSpan.textContent =
        project.citations !== undefined ? project.citations.toString() : "0";
    }

    const areaTag = cardElement.querySelector(".area-tag");
    if (areaTag) areaTag.textContent = getDisplayArea(project.area);

    const techTag = cardElement.querySelector(".tech-tag");
    if (techTag)
      techTag.textContent = Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "N/A";

    const yearTag = cardElement.querySelector(".year-tag");
    if (yearTag) yearTag.textContent = project.year || "N/A";

    const descriptionP = cardElement.querySelector(".project-description");
    if (descriptionP)
      descriptionP.textContent = project.summary || "Sem resumo.";

    return cardElement;
  }

  // --- LÓGICA DE EXIBIÇÃO E "VER MAIS" COM A API ---
  function updateVerMaisButton(totalProjectsInFilter, projectsFetchedThisTime) {
    if (!verMaisBtn) return;
    const totalCurrentlyVisible =
      (currentPage - 1) * PROJECTS_PER_LOAD + projectsFetchedThisTime;

    if (totalCurrentlyVisible < totalProjectsInFilter) {
      verMaisBtn.style.display = "inline-block";
    } else {
      verMaisBtn.style.display = "none";
    }
  }

  function displayFilteredProjects() {
    if (!window.estudioIdeias || !window.estudioIdeias.projects) {
      console.error("HOME JS: API estudioIdeias.projects não está pronta.");
      if (projectListContainer)
        projectListContainer.innerHTML =
          "<p class='no-results-message'>Erro ao carregar API de dados dos projetos.</p>";
      if (verMaisBtn) verMaisBtn.style.display = "none";
      return;
    }
    if (!projectListContainer) {
      console.error(
        "HOME JS: Container da lista de projetos (lista-projetos) não encontrado."
      );
      return;
    }

    const params = {
      page: currentPage,
      perPage: PROJECTS_PER_LOAD,
      search: currentSearchTerm || null,
      searchBy: currentSearchBy,
      orderBy: mapSortValue(currentSortBy),
      year: currentYear || null,
      area: currentArea || null,
    };

    const paginatedData = window.estudioIdeias.projects.paginate(params);

    if (currentPage === 1) {
      projectListContainer.innerHTML = "";
    }

    if (
      paginatedData &&
      paginatedData.results &&
      paginatedData.results.length > 0
    ) {
      paginatedData.results.forEach((project) => {
        if (project) {
          const projectCardElement = renderProjectCard(project);
          projectListContainer.appendChild(projectCardElement);
        }
      });
      updateVerMaisButton(paginatedData.total, paginatedData.results.length);
    } else if (currentPage === 1) {
      projectListContainer.innerHTML =
        '<p class="no-results-message">Nenhum projeto encontrado com os critérios selecionados.</p>';
      updateVerMaisButton(0, 0);
    } else {
      updateVerMaisButton(paginatedData.total, 0);
    }
  }

  function handleFilterOrSortChange() {
    currentPage = 1;
    currentSearchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    currentSearchBy = filterFieldSelect ? filterFieldSelect.value : "all";
    currentSortBy = sortBySelect ? sortBySelect.value : "relevance";
    currentYear = yearFilterSelect
      ? yearFilterSelect.value === "all"
        ? ""
        : yearFilterSelect.value
      : "";
    currentArea = areaFilterSelect
      ? areaFilterSelect.value === "all"
        ? ""
        : areaFilterSelect.value
      : "";

    displayFilteredProjects();
  }

  function loadMoreProjectsOnClick() {
    currentPage++;
    displayFilteredProjects();
  }

  // --- POPULAR FILTRO DE ANO COM A API ---
  function populateYearFilterWithApi() {
    if (
      !window.estudioIdeias ||
      !window.estudioIdeias.projects ||
      !yearFilterSelect
    )
      return;

    const years = window.estudioIdeias.projects.getAvailableYears();

    const defaultOption = yearFilterSelect.options[0];
    yearFilterSelect.innerHTML = "";
    if (defaultOption) yearFilterSelect.appendChild(defaultOption);

    if (years && years.length > 0) {
      years.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearFilterSelect.appendChild(option);
      });
    }
  }

  // --- SUGESTÕES DE BUSCA COM A API ---
  function updateSearchSuggestionsWithApi() {
    if (
      !window.estudioIdeias ||
      !searchInput ||
      !filterFieldSelect ||
      !suggestionsContainer
    )
      return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    const searchField = filterFieldSelect.value;

    suggestionsContainer.innerHTML = "";
    activeSuggestionIndex = -1;

    if (searchTerm.length < 2) {
      suggestionsContainer.style.display = "none";
      return;
    }
    const paginatedSuggestions = window.estudioIdeias.projects.paginate({
      search: searchTerm,
      searchBy: searchField,
      perPage: 5,
    });

    const suggestedItems = [];
    if (
      paginatedSuggestions &&
      paginatedSuggestions.results &&
      paginatedSuggestions.results.length > 0
    ) {
      paginatedSuggestions.results.forEach((project) => {
        let matchText = null;
        let originalTextToFillInput = project.title || "";
        if (searchField === "title" || searchField === "all") {
          if (
            project.title &&
            project.title.toLowerCase().includes(searchTerm)
          ) {
            matchText = project.title;
          }
        }
        if (!matchText && (searchField === "author" || searchField === "all")) {
          if (
            project.author &&
            project.author.toLowerCase().includes(searchTerm)
          ) {
            matchText = `${project.author} (Autor)`;
            originalTextToFillInput = project.author;
          }
        }

        if (
          matchText &&
          !suggestedItems.some(
            (item) => item.text.toLowerCase() === matchText.toLowerCase()
          )
        ) {
          suggestedItems.push({
            text: matchText,
            fillValue: originalTextToFillInput,
          });
        }
      });
    }

    if (suggestedItems.length > 0) {
      suggestionsContainer.style.display = "block";
      suggestedItems.forEach((item, index) => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add("suggestion-item");
        suggestionDiv.textContent = item.text;
        suggestionDiv.dataset.index = index;
        suggestionDiv.addEventListener("click", () => {
          searchInput.value = item.fillValue;
          suggestionsContainer.innerHTML = "";
          suggestionsContainer.style.display = "none";
          activeSuggestionIndex = -1;
          handleFilterOrSortChange();
        });
        suggestionsContainer.appendChild(suggestionDiv);
      });
    } else {
      suggestionsContainer.style.display = "none";
    }
  }

  // --- CONFIGURAÇÃO DOS EVENT LISTENERS ---
  function setupEventListeners() {
    // console.log("--- Iniciando setupEventListeners na Home ---");
    if (
      !searchForm ||
      !searchInput ||
      !filterFieldSelect ||
      !sortBySelect ||
      !yearFilterSelect ||
      !areaFilterSelect ||
      !suggestionsContainer ||
      !verMaisBtn
    ) {
      console.error(
        "HOME JS: ERRO CRÍTICO - Um ou mais elementos de UI não foram encontrados para configurar listeners."
      );
      // Adicione logs individuais para cada elemento se precisar depurar qual está faltando
      return;
    }

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleFilterOrSortChange();
    });

    searchInput.addEventListener("input", updateSearchSuggestionsWithApi);

    searchInput.addEventListener("keydown", (e) => {
      if (!suggestionsContainer) return;
      const items = suggestionsContainer.querySelectorAll(".suggestion-item");
      if (suggestionsContainer.style.display === "block" && items.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
          updateActiveSuggestion(items);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          activeSuggestionIndex =
            (activeSuggestionIndex - 1 + items.length) % items.length;
          updateActiveSuggestion(items);
        } else if (e.key === "Enter") {
          if (activeSuggestionIndex > -1 && items[activeSuggestionIndex]) {
            e.preventDefault();
            items[activeSuggestionIndex].click();
          }
        } else if (e.key === "Escape") {
          suggestionsContainer.innerHTML = "";
          suggestionsContainer.style.display = "none";
          activeSuggestionIndex = -1;
        }
      }
    });

    filterFieldSelect.addEventListener("change", handleFilterOrSortChange);
    sortBySelect.addEventListener("change", handleFilterOrSortChange);
    yearFilterSelect.addEventListener("change", handleFilterOrSortChange);
    areaFilterSelect.addEventListener("change", handleFilterOrSortChange);

    verMaisBtn.addEventListener("click", loadMoreProjectsOnClick);

    document.addEventListener("click", (event) => {
      if (
        searchInput &&
        suggestionsContainer &&
        !searchInput.contains(event.target) &&
        !suggestionsContainer.contains(event.target)
      ) {
        suggestionsContainer.innerHTML = "";
        suggestionsContainer.style.display = "none";
        activeSuggestionIndex = -1;
      }
    });
    // console.log("HOME JS: Event listeners configurados com SUCESSO.");
  }

  function updateActiveSuggestion(items) {
    // Definindo a função que faltava
    items.forEach((item, index) => {
      if (index === activeSuggestionIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // --- INICIALIZAÇÃO DA PÁGINA HOME ---
  function initializeHomePage() {
    if (!projectTemplate) {
      console.error(
        "CRÍTICO (Home): O <template id='projeto-template'> não foi encontrado!"
      );
      if (projectListContainer)
        projectListContainer.innerHTML =
          "<p class='no-results-message'>Erro: Template de projeto ausente.</p>";
      if (verMaisBtn) verMaisBtn.style.display = "none";
      return;
    }
    populateYearFilterWithApi();
    handleFilterOrSortChange();
    setupEventListeners();
  }

  // Espera a API estar pronta
  if (window.estudioIdeias && window.estudioIdeias.projects) {
    // console.log("HOME JS: API estudioIdeias já pronta. Inicializando...");
    initializeHomePage();
  } else {
    // console.log("HOME JS: Aguardando evento 'estudioApiReady'...");
    document.addEventListener(
      "estudioApiReady",
      function handler() {
        // console.log("HOME JS: Evento 'estudioApiReady' recebido. Inicializando página home.");
        document.removeEventListener("estudioApiReady", handler);
        initializeHomePage();
      },
      { once: true }
    );

    setTimeout(() => {
      if (
        window.estudioIdeias &&
        window.estudioIdeias.projects &&
        !document.body.dataset.homeInitializedByApi
      ) {
        // console.warn("HOME JS: Inicializando via fallback setTimeout.");
        document.body.dataset.homeInitializedByApi = "true";
        initializeHomePage();
      } else if (
        !window.estudioIdeias &&
        !document.body.dataset.homeInitializedByApi
      ) {
        console.error(
          "HOME JS: API não carregou após timeout. Verifique o script da API (projetos.js)."
        );
        if (projectListContainer)
          projectListContainer.innerHTML =
            "<p class='no-results-message'>Falha ao carregar base de dados.</p>";
      }
    }, 1500);
  }
});
