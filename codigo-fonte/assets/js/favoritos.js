(async () => {
  const favorites = window.estudioIdeias.favorites.getAll();

  function renderTotalResults() {
    const totalProjectsCount = document.createElement("strong");
    totalProjectsCount.textContent = `${favorites.length} `;

    const totalProjectsText = document.createElement("span");
    totalProjectsText.textContent =
      favorites.length === 1 ? "favorito" : "favoritos";

    const totalProjectsContainer = document.createElement("p");
    totalProjectsContainer.appendChild(totalProjectsCount);
    totalProjectsContainer.appendChild(totalProjectsText);

    document
      .querySelector(".projects__header")
      .appendChild(totalProjectsContainer);
  }

  function renderProjects() {
    const projects = favorites.map((project) =>
      window.estudioIdeias.projects.get(project)
    );

    const projectsList = document.querySelector(".projects-list");
    projectsList.innerHTML = "";

    if (projects.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.classList.add("no-results-message");
      noResultsMessage.textContent = "Você ainda não favoritou nenhum projeto.";
      projectsList.appendChild(noResultsMessage);
      return;
    }

    projects.forEach((project) => {
      if (!project) return;
      const projectElement = window.estudioIdeiasUtils.createProjectElement(
        project,
        true
      );
      projectsList.appendChild(projectElement);
    });
  }

  renderTotalResults();
  renderProjects();
})();
