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
  const { formatNumber, createProjectElement } = window.estudioIdeiasUtils;
  const projectsList = document.querySelector(".projects-list");
  const header = document.querySelector(".projects__header");

  const count = document.createElement("p");
  count.className = "acervo__count";
  count.setAttribute("aria-live", "polite");
  header.appendChild(count);

  function renderTotalResults() {
    const total = projectsList.querySelectorAll(".project-card").length;
    count.innerHTML = `<strong class="num">${formatNumber(total)}</strong> ${total === 1 ? "favorito" : "favoritos"}`;
    const plate = document.querySelector('[data-plate="total"]');
    if (plate) plate.textContent = formatNumber(total);
  }

  function renderEmpty() {
    projectsList.innerHTML = `
      <div class="empty-state no-results-message">
        <p class="empty-state__title">Você ainda não favoritou nenhum projeto.</p>
        <p>Toque na estrela de qualquer cartão do acervo para guardá-lo aqui.</p>
        <a class="link-arrow" href="./projetos.html">Explorar projetos</a>
      </div>`;
  }

  function renderProjects() {
    const projects = window.estudioIdeias.favorites
      .getAll()
      .map((id) => window.estudioIdeias.projects.get(id))
      .filter(Boolean);

    projectsList.innerHTML = "";
    if (projects.length === 0) return renderEmpty();

    projects.forEach((project) => projectsList.appendChild(createProjectElement(project, true)));
    projectsList.dispatchEvent(new CustomEvent("projetos:renderizados", { bubbles: true }));
  }

  // Ao tirar a estrela, o cartão sai da estante
  projectsList.addEventListener("favorito:alterado", (event) => {
    if (event.detail.favorito) return;
    const card = event.target.closest(".project-card");
    const done = () => {
      card.remove();
      if (!projectsList.querySelector(".project-card")) renderEmpty();
      renderTotalResults();
    };
    const motion = window.estudioIdeias.motion;
    if (motion && !motion.reduce && motion.gsap) {
      const styles = getComputedStyle(document.documentElement);
      motion.gsap.to(card, {
        opacity: 0,
        scale: parseFloat(styles.getPropertyValue("--press-scale")) || 1,
        duration: (parseFloat(styles.getPropertyValue("--duration-base")) || 0) / 1000,
        onComplete: done,
      });
    } else {
      done();
    }
  });

  renderProjects();
  renderTotalResults();
})();
