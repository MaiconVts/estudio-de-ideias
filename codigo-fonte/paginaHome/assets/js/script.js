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
  console.log(
    "DEBUG: Elemento projectTemplate encontrado no DOM:",
    projectTemplate
  );
  const suggestionsContainer = document.getElementById("search-suggestions");
  const verMaisBtn = document.getElementById("ver-mais-btn");

  let allProjects = [];
  let currentFilteredResults = [];
  const PROJECTS_PER_PAGE = 8;
  let projectsCurrentlyDisplayedCount = 0;
  let activeSuggestionIndex = -1;

  // --- 1. CARREGAMENTO E PREPARAÇÃO DOS DADOS ---
  async function fetchProjects() {
    // console.log('Iniciando fetchProjects...'); // Log mais verboso removido
    try {
      const filePath = "projetosIniciais.json";
      // console.log(`Tentando buscar o arquivo: ${filePath}`); // Log mais verboso removido
      const response = await fetch(filePath);
      // console.log('Resposta do fetch recebida. Status OK:', response.ok, 'Status:', response.status); // Log mais verboso removido

      if (!response.ok) {
        throw new Error(
          `Erro HTTP! Status: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();
      // console.log('JSON parseado com sucesso. Número de projetos carregados:', data ? data.length : 0); // Log mais verboso removido

      if (Array.isArray(data)) {
        allProjects = data;
        currentFilteredResults = [...allProjects];
      } else {
        console.error("Os dados carregados do JSON não são um array:", data);
        allProjects = [];
        currentFilteredResults = [];
        throw new Error("Formato de dados inválido no arquivo JSON.");
      }

      if (!projectTemplate) {
        console.error(
          "CRÍTICO: O elemento <template id='projeto-template'> não foi encontrado no HTML!"
        );
        projectListContainer.innerHTML =
          "<p class='no-results-message'>Erro crítico: Template de projeto não encontrado.</p>";
        if (verMaisBtn) verMaisBtn.style.display = "none";
        return;
      }

      populateYearFilter();
      resetAndDisplayProjects();
      setupEventListeners();
    } catch (error) {
      console.error("Falha ao carregar ou processar projetos:", error);
      projectListContainer.innerHTML =
        "<p class='no-results-message'>Desculpe, não foi possível carregar os projetos.</p>";
      if (verMaisBtn) verMaisBtn.style.display = "none";
    }
  }

  function populateYearFilter() {
    if (!allProjects || allProjects.length === 0 || !yearFilterSelect) return;
    const years = [
      ...new Set(
        allProjects.map((project) => project.year).filter((year) => year)
      ),
    ].sort((a, b) => b - a);

    const defaultOption = yearFilterSelect.options[0];
    yearFilterSelect.innerHTML = "";
    if (defaultOption) yearFilterSelect.appendChild(defaultOption);

    years.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearFilterSelect.appendChild(option);
    });
  }

  // --- 2. RENDERIZAÇÃO DOS CARDS ---
  function getDisplayArea(areaValue) {
    if (!areaValue) return "Não especificada";
    const areaMap = {
      networking: "Redes",
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobile",
      "banco-dados": "Banco de Dados",
      seguranca: "Segurança da Informação",
    };
    return areaMap[areaValue.toLowerCase()] || areaValue;
  }

  // Substitua a função renderProjectCard existente por esta:
  function renderProjectCard(project) {
    if (!projectTemplate || !projectTemplate.content) {
      console.error(
        "ERRO em renderProjectCard: projectTemplate ou projectTemplate.content é inválido."
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
      errorDiv.classList.add("project-card-error");
      errorDiv.textContent = `Erro: Estrutura interna do template inválida.`;
      errorDiv.style.color = "red";
      return errorDiv;
    }

    // Log para ver os dados do projeto atual (pode remover depois que funcionar)
    // console.log(`Renderizando card para: "${project.title}"`, project);

    const titleLink = cardElement.querySelector(".project-title a");
    if (titleLink) {
      titleLink.textContent = project.title || "Título Indisponível";
      titleLink.href = `../paginaDetalhesProjetos/index.html?file=${encodeURIComponent(
        project.file || ""
      )}`;
    }

    // --- ATUALIZANDO AUTOR E CITAÇÕES COM OS SELETORES CORRETOS ---
    const authorNameValueSpan = cardElement.querySelector(".author-name-value"); // Procura por <span class="author-name-value">
    // console.log(`  - Buscando .author-name-value:`, authorNameValueSpan); // Log de depuração
    if (authorNameValueSpan) {
      // console.log(`    - Valor de project.author:`, project.author); // Log de depuração
      authorNameValueSpan.textContent = project.author || "Desconhecido";
    } else {
      console.warn(
        `    - Elemento com classe '.author-name-value' NÃO encontrado no card para "${project.title}"`
      );
    }

    const citationsCountValueSpan = cardElement.querySelector(
      ".citations-count-value"
    ); // Procura por <span class="citations-count-value">
    // console.log(`  - Buscando .citations-count-value:`, citationsCountValueSpan); // Log de depuração
    if (citationsCountValueSpan) {
      // console.log(`    - Valor de project.citations:`, project.citations); // Log de depuração
      citationsCountValueSpan.textContent =
        project.citations !== undefined ? project.citations.toString() : "0";
    } else {
      console.warn(
        `    - Elemento com classe '.citations-count-value' NÃO encontrado no card para "${project.title}"`
      );
    }
    // --- FIM DA ATUALIZAÇÃO ---

    const areaTag = cardElement.querySelector(".area-tag");
    if (areaTag) areaTag.textContent = getDisplayArea(project.area); // getDisplayArea já foi definida antes

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

  // --- 3. LÓGICA DE EXIBIÇÃO E "VER MAIS" ---
  function updateVerMaisButton() {
    if (!verMaisBtn) return;
    if (projectsCurrentlyDisplayedCount < currentFilteredResults.length) {
      verMaisBtn.style.display = "inline-block";
    } else {
      verMaisBtn.style.display = "none";
    }
  }

  function loadMoreProjects() {
    if (!Array.isArray(currentFilteredResults) || !projectListContainer) return;

    const startIndex = projectsCurrentlyDisplayedCount;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const batchToDisplay = currentFilteredResults.slice(startIndex, endIndex);

    if (
      batchToDisplay.length === 0 &&
      startIndex === 0 &&
      projectListContainer.innerHTML.trim() === ""
    ) {
      projectListContainer.innerHTML =
        '<p class="no-results-message">Nenhum projeto encontrado com os critérios selecionados.</p>';
    } else {
      batchToDisplay.forEach((project) => {
        if (project) {
          const projectCardElement = renderProjectCard(project);
          projectListContainer.appendChild(projectCardElement);
        }
      });
    }

    projectsCurrentlyDisplayedCount += batchToDisplay.length;
    updateVerMaisButton();
  }

  function resetAndDisplayProjects() {
    if (!projectListContainer) return;

    projectListContainer.innerHTML = "";
    projectsCurrentlyDisplayedCount = 0;

    if (
      !Array.isArray(currentFilteredResults) ||
      currentFilteredResults.length === 0
    ) {
      projectListContainer.innerHTML =
        '<p class="no-results-message">Nenhum projeto encontrado com os critérios selecionados.</p>';
    }
    loadMoreProjects();
    updateVerMaisButton();
  }

  // --- 4. SUGESTÕES, FILTRAGEM E ORDENAÇÃO ---
  function updateSearchSuggestions() {
    if (!searchInput || !filterFieldSelect || !suggestionsContainer) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    const searchField = filterFieldSelect.value;

    suggestionsContainer.innerHTML = "";
    activeSuggestionIndex = -1;

    if (searchTerm.length < 2) {
      suggestionsContainer.style.display = "none";
      return;
    }

    const MAX_SUGGESTIONS = 5;
    let suggestedItems = [];

    if (!Array.isArray(allProjects)) {
      console.warn("allProjects não é um array ao tentar gerar sugestões.");
      suggestionsContainer.style.display = "none";
      return;
    }

    for (const project of allProjects) {
      if (suggestedItems.length >= MAX_SUGGESTIONS) break;
      if (!project) continue;

      let matchText = null;
      let originalTextToFillInput = project.title || "";

      if (searchField === "title" || searchField === "all") {
        if (project.title && project.title.toLowerCase().includes(searchTerm)) {
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
          handleSearchAndFilter();
        });
        suggestionsContainer.appendChild(suggestionDiv);
      });
    } else {
      suggestionsContainer.style.display = "none";
    }
  }

  function mapJsonAreaToFilterValue(jsonArea) {
    if (
      jsonArea &&
      typeof jsonArea === "string" &&
      jsonArea.toLowerCase() === "networking"
    ) {
      return "redes";
    }
    // Se você padronizou os valores de "area" no seu JSON para corresponderem
    // aos values do select HTML (ex: "banco-dados", "seguranca"),
    // você pode simplificar ou remover esta função e usar jsonArea.toLowerCase() diretamente no filtro.
    return jsonArea
      ? typeof jsonArea === "string"
        ? jsonArea.toLowerCase()
        : jsonArea
      : "";
  }

  function handleSearchAndFilter() {
    if (
      !searchInput ||
      !filterFieldSelect ||
      !sortBySelect ||
      !yearFilterSelect ||
      !areaFilterSelect
    )
      return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    const searchField = filterFieldSelect.value;
    const sortBy = sortBySelect.value;
    const selectedYearValue = yearFilterSelect.value;
    const selectedAreaValue = areaFilterSelect.value;

    if (suggestionsContainer) {
      suggestionsContainer.innerHTML = "";
      suggestionsContainer.style.display = "none";
      activeSuggestionIndex = -1;
    }

    if (!Array.isArray(allProjects)) {
      console.warn("allProjects não é um array ao tentar filtrar e ordenar.");
      currentFilteredResults = [];
      resetAndDisplayProjects();
      return;
    }

    let newFilteredResults = allProjects.filter((project) => {
      if (!project) return false;
      if (
        selectedYearValue !== "all" &&
        (!project.year || project.year.toString() !== selectedYearValue)
      )
        return false;
      if (
        selectedAreaValue !== "all" &&
        (!project.area ||
          mapJsonAreaToFilterValue(project.area) !== selectedAreaValue)
      )
        return false;

      if (searchTerm) {
        const titleMatch =
          project.title && project.title.toLowerCase().includes(searchTerm);
        const authorMatch =
          project.author && project.author.toLowerCase().includes(searchTerm);
        const summaryMatch =
          project.summary && project.summary.toLowerCase().includes(searchTerm);
        const techMatch =
          Array.isArray(project.technologies) &&
          project.technologies.some(
            (tech) => tech && tech.toLowerCase().includes(searchTerm)
          );
        if (searchField === "title" && !titleMatch) return false;
        if (searchField === "author" && !authorMatch) return false;
        if (
          searchField === "all" &&
          !(titleMatch || authorMatch || summaryMatch || techMatch)
        )
          return false;
      }
      return true;
    });

    switch (sortBy) {
      case "date-desc":
      case "relevance":
        newFilteredResults.sort(
          (a, b) =>
            b.year - a.year || (a.title || "").localeCompare(b.title || "")
        );
        break;
      case "date-asc":
        newFilteredResults.sort(
          (a, b) =>
            a.year - b.year || (a.title || "").localeCompare(b.title || "")
        );
        break;
      case "citations":
        newFilteredResults.sort(
          (a, b) => b.citations - a.citations || b.year - a.year
        );
        break;
    }
    currentFilteredResults = newFilteredResults;
    resetAndDisplayProjects();
  }

  // --- 5. CONFIGURAÇÃO DOS EVENT LISTENERS ---
  function updateActiveSuggestion(items) {
    items.forEach((item, index) => {
      if (index === activeSuggestionIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  function setupEventListeners() {
    // Logs de depuração para cada seletor
    console.log("--- Iniciando setupEventListeners ---");
    console.log("Verificando searchForm:", searchForm);
    console.log("Verificando searchInput:", searchInput);
    console.log("Verificando filterFieldSelect:", filterFieldSelect);
    console.log("Verificando sortBySelect:", sortBySelect);
    console.log("Verificando yearFilterSelect:", yearFilterSelect);
    console.log("Verificando areaFilterSelect:", areaFilterSelect);
    console.log("Verificando suggestionsContainer:", suggestionsContainer);
    console.log("Verificando verMaisBtn:", verMaisBtn);

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
        "ERRO CRÍTICO: Um ou mais elementos de UI NÃO foram encontrados. Listeners podem não funcionar."
      );
      if (!searchForm)
        console.error(
          "Elemento 'searchForm' (id='search-form') não encontrado."
        );
      if (!searchInput)
        console.error(
          "Elemento 'searchInput' (id='search-input') não encontrado."
        );
      if (!filterFieldSelect)
        console.error(
          "Elemento 'filterFieldSelect' (id='filter-field') não encontrado."
        );
      if (!sortBySelect)
        console.error("Elemento 'sortBySelect' (id='sort-by') não encontrado.");
      if (!yearFilterSelect)
        console.error(
          "Elemento 'yearFilterSelect' (id='year-filter') não encontrado."
        );
      if (!areaFilterSelect)
        console.error(
          "Elemento 'areaFilterSelect' (id='area-filter') não encontrado."
        );
      if (!suggestionsContainer)
        console.error(
          "Elemento 'suggestionsContainer' (id='search-suggestions') não encontrado."
        );
      if (!verMaisBtn)
        console.error(
          "Elemento 'verMaisBtn' (id='ver-mais-btn') não encontrado."
        );
      return;
    }

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleSearchAndFilter();
    });

    searchInput.addEventListener("input", updateSearchSuggestions);

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

    filterFieldSelect.addEventListener("change", () => {
      if (typeof updateSearchSuggestions === "function")
        updateSearchSuggestions();
      handleSearchAndFilter();
    });
    sortBySelect.addEventListener("change", handleSearchAndFilter);
    yearFilterSelect.addEventListener("change", handleSearchAndFilter);
    areaFilterSelect.addEventListener("change", handleSearchAndFilter);

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

    verMaisBtn.addEventListener("click", loadMoreProjects);

    console.log("Event listeners configurados com SUCESSO.");
  }
  // Inicia o processo
  fetchProjects();
});



// Em assets/js/script.js (da paginaHome)

document.addEventListener('DOMContentLoaded', () => {
    // ... (seus seletores e código existentes da home page) ...

    console.log("Tentando configurar o botão 'Voltar ao Topo'...");
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // 1. Verifica se o botão foi encontrado no HTML
    if (scrollToTopBtn) {
        console.log("Botão 'Voltar ao Topo' (scrollToTopBtn) ENCONTRADO no DOM.");

        // Inicialmente, o botão deve estar escondido pelo CSS (display: none)
        // O JavaScript o tornará visível conforme a rolagem.

        // 2. Listener para o evento de rolagem da página
        window.addEventListener('scroll', () => {
            const scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
            // console.log("Scroll position:", scrollPosition); // Descomente para ver a posição do scroll

            if (scrollPosition > 200) { // Se rolou mais de 200 pixels
                if (scrollToTopBtn.style.display !== 'flex') { // Mostra apenas se já não estiver visível
                    scrollToTopBtn.style.display = 'flex';
                    console.log("Botão 'Voltar ao Topo' DEVE APARECER.");
                }
            } else { // Se está perto do topo
                if (scrollToTopBtn.style.display !== 'none') { // Esconde apenas se já não estiver escondido
                    scrollToTopBtn.style.display = 'none';
                    console.log("Botão 'Voltar ao Topo' DEVE SUMIR.");
                }
            }
        });

        // 3. Listener para o evento de clique no botão
        scrollToTopBtn.addEventListener('click', () => {
            console.log("Botão 'Voltar ao Topo' CLICADO.");
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

    } else {
        // Se o botão não foi encontrado
        console.error("ERRO: Elemento do botão 'Voltar ao Topo' com id='scrollToTopBtn' NÃO FOI ENCONTRADO no HTML.");
    }

    // ... (resto do seu código dentro do DOMContentLoaded para a home page) ...
});

// Dentro do seu DOMContentLoaded na paginaHome/assets/js/script.js
    const menuIconImage = document.getElementById('menuIconImg');
    const mainDropdown = document.getElementById('mainDropdownMenu');

    if (menuIconImage && mainDropdown) {
        menuIconImage.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique no ícone feche o menu imediatamente (se houver listener no document)
            mainDropdown.classList.toggle('is-active');
            // Atualiza o aria-expanded do botão/imagem se você tiver um elemento <button> envolvendo a imagem
            // const isExpanded = mainDropdown.classList.contains('is-active');
            // menuIconImage.parentElement.setAttribute('aria-expanded', isExpanded); // Assumindo que a imagem está dentro de um botão
        });

        // Opcional: Fechar o menu se clicar fora dele
        document.addEventListener('click', (event) => {
            if (mainDropdown.classList.contains('is-active') && 
                !menuIconImage.contains(event.target) && // Se o clique não foi no ícone
                !mainDropdown.contains(event.target)) { // E nem dentro do menu
                mainDropdown.classList.remove('is-active');
                // menuIconImage.parentElement.setAttribute('aria-expanded', 'false'); // Atualiza aria
            }
        });
    } else {
        console.warn("Ícone do menu (menuIconImg) ou menu dropdown (mainDropdownMenu) não encontrado. Navegação mobile pode não funcionar.");
    }