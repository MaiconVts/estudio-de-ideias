function createPaginationButton(pageNumber, current = false) {
  const button = document.createElement("a");
  button.classList.add("pagination__button");
  button.textContent = pageNumber;

  const url = new URL(window.location.href);
  url.searchParams.set("page", pageNumber);
  button.href = url.toString();

  if (current) {
    button.href = "javascript:void(0);";
    button.classList.add("pagination__button--current");
  }
  return button;
}

(async () => {
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
    const optionElements = areas.map((area) => {
      const option = document.createElement("option");
      option.value = area;
      option.textContent = area;
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
    totalResults.textContent = projects.total;
  }

  function renderProjects() {
    const projectsList = document.querySelector(".projects-list");
    projectsList.innerHTML = "";

    if (projects.results.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.classList.add("no-results-message");
      noResultsMessage.textContent = "Nenhum resultado encontrado.";
      projectsList.appendChild(noResultsMessage);
      return;
    }

    projects.results.forEach((project) => {
      const projectElement = window.estudioIdeiasUtils.createProjectElement(
        project,
        favorites.includes(project.id)
      );
      projectsList.appendChild(projectElement);
    });
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
