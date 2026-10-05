function createPaginationButton(pageNumber, current = false) {
  const button = document.createElement("a");
  button.classList.add("pagination__button");
  button.textContent = pageNumber;

  const url = new URL(window.location.href);
  url.searchParams.set("page", pageNumber);
  button.href = url.toString();

  button.setAttribute("aria-label", `Página ${pageNumber}`);
  if (current) {
    button.removeAttribute("href");
    button.setAttribute("aria-current", "page");
    button.classList.add("pagination__button--current");
  }
  return button;
}

(async () => {
  try {
    await window.estudioIdeias.ready;
  } catch {
    const lista = document.querySelector(".projects-list");
    if (lista) {
      lista.innerHTML = `
        <div class="empty-state no-results-message" role="alert">
          <p class="empty-state__title">Acervo indisponível.</p>
          <p>${window.estudioIdeias.mensagemDeFalha}</p>
        </div>`;
    }
    return;
  }
  const url = new URL(window.location.href);
  const page = url.searchParams.get("page") || 1;
  const search = url.searchParams.get("search") || "";
  const searchBy = url.searchParams.get("searchBy") || "";
  const orderBy = url.searchParams.get("orderBy") || "";
  const year = url.searchParams.get("year") || "";
  const area = url.searchParams.get("area") || "";
  const perPage = 20;

  const pageNumber = parseInt(page, 10) || 1;

  const projects = window.estudioIdeias.projects.paginate({
    page: pageNumber,
    perPage,
    search,
    searchBy,
    orderBy,
    year,
    area,
  });

  const favorites = window.estudioIdeias.favorites.getAll();

  function initYearOptions() {
    const years = window.estudioIdeias.projects.getAvailableYears();
    const yearSelect = document.querySelector(
      ".filter-form select[name='year']"
    );
    const optionElements = years.map((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      return option;
    });
    yearSelect.append(...optionElements);
  }

  function initAreaOptions() {
    const areas = window.estudioIdeias.projects.getAvailableAreas();
    const areaSelect = document.querySelector(
      ".filter-form select[name='area']"
    );
    // só acrescenta áreas que o HTML ainda não lista (evita "frontend" ao lado de "Frontend")
    const known = new Set([...areaSelect.options].map((option) => option.value));
    const optionElements = areas
      .filter((area) => area && !known.has(area))
      .map((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = window.estudioIdeiasUtils.areaOf(area)?.nome || area;
        return option;
      });
    areaSelect.append(...optionElements);
  }

  function renderFilters() {
    initYearOptions();
    initAreaOptions();

    document
      .querySelector(".filter-form")
      .addEventListener("reset", (event) => {
        setTimeout(() => event.target.submit());
      });

    document.querySelector(".filter-form input[name='search']").value = search;

    document.querySelector(".filter-form select[name='searchBy']").value =
      searchBy;

    document.querySelector(".filter-form select[name='orderBy']").value =
      orderBy;

    document.querySelector(".filter-form select[name='year']").value = year;

    document.querySelector(".filter-form select[name='area']").value = area;
  }

  function renderTotalResults() {
    const totalResults = document.querySelector(".projects__header strong");
    totalResults.textContent = window.estudioIdeiasUtils.formatNumber(projects.total);
    const totalPages = Math.max(1, Math.ceil(projects.total / perPage));
    const plate = (name) => document.querySelector(`[data-plate="${name}"]`);
    if (plate("total")) plate("total").textContent = window.estudioIdeiasUtils.formatNumber(projects.total);
    if (plate("pagina")) plate("pagina").textContent = `${pageNumber}/${totalPages}`;
  }

  function renderProjects() {
    const projectsList = document.querySelector(".projects-list");
    projectsList.innerHTML = "";

    if (projects.results.length === 0) {
      projectsList.innerHTML = `
        <div class="empty-state no-results-message">
          <p class="empty-state__title">Nenhum resultado encontrado.</p>
          <p>Tente outro termo, outra área ou limpe os filtros.</p>
          <a class="link-arrow" href="./projetos.html">Ver todo o acervo</a>
        </div>`;
      return;
    }

    projects.results.forEach((project) => {
      const projectElement = window.estudioIdeiasUtils.createProjectElement(
        project,
        favorites.includes(project.id)
      );
      projectsList.appendChild(projectElement);
    });
    projectsList.dispatchEvent(new CustomEvent("projetos:renderizados", { bubbles: true }));
  }

  function renderPagination() {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(projects.total / perPage);

    for (let i = 1; i <= totalPages; i++) {
      const button = createPaginationButton(i, i === pageNumber);
      pagination.appendChild(button);
    }
  }

  renderFilters();
  renderProjects();
  renderTotalResults();
  renderPagination();
})();
