// assets/js/detalhes.js
// Página de detalhes: lê ?id= da URL, preenche ficha e resumo, monta o
// visualizador do PDF (pdf-viewer.js) e as leituras relacionadas (openalex.js).

(function () {
  const AREA_NAMES = {
    frontend: "Desenvolvimento Front-end",
    backend: "Desenvolvimento Back-end",
    mobile: "Desenvolvimento Mobile",
    redes: "Redes de Computadores",
    "banco-dados": "Banco de Dados",
    seguranca: "Segurança da Informação",
  };

  const $ = (id) => document.getElementById(id);

  // Avisa o motion-base que o cabeçalho já tem conteúdo e pode entrar
  function markReady() {
    const hero = document.querySelector(".page-hero");
    if (hero) hero.setAttribute("data-pronta", "");
    document.dispatchEvent(new CustomEvent("pagina:pronta"));
  }

  function showNotFound(message) {
    $("project-detail-content").hidden = true;
    $("project-not-found").hidden = false;
    if (message) $("project-not-found-message").textContent = message;
    $("detail-breadcrumb-current").textContent = "Não encontrado";
    $("detail-project-title").textContent = "Projeto não encontrado";
    document.title = "Projeto não encontrado · Estúdio de Ideias";
    markReady();
  }

  function fillProject(project) {
    const areaName = AREA_NAMES[project.area] || project.area || "Área não informada";

    document.title = `${project.title} · Estúdio de Ideias`;
    $("detail-breadcrumb-current").textContent = project.title;
    $("detail-project-title").textContent = project.title;
    $("detail-project-author").textContent = project.author || "Autor não informado";
    $("detail-project-area").textContent = areaName;
    $("detail-project-summary").textContent = project.summary || "Resumo não disponível.";
    $("detail-project-year").textContent = project.year || "—";
    $("detail-project-area-name").textContent = areaName;
    $("detail-project-citations").textContent = project.citations ?? "—";

    const techList = $("detail-project-technologies");
    (project.technologies || []).forEach((tech) => {
      const li = document.createElement("li");
      li.className = "tag";
      li.textContent = tech;
      techList.appendChild(li);
    });

    // Só os PDFs simulados existem no site; o pacote original (.zip, .apk) não foi publicado
    $("detail-project-file").textContent = project.file
      ? `${project.file} (não disponível na demonstração)`
      : "Não informado";

    const pdfUrl = `assets/docs/${encodeURIComponent(project.id)}.pdf`;
    const download = $("detail-pdf-download");
    download.href = pdfUrl;
    download.setAttribute("download", `${slugify(project.title)}.pdf`);

    const { projectCode, formatNumber } = window.estudioIdeiasUtils;
    const plate = (name) => document.querySelector(`[data-plate="${name}"]`);
    plate("codigo").textContent = projectCode(project.id);
    plate("ano").textContent = project.year || "—";
    plate("citacoes").textContent = formatNumber(project.citations || 0);
    $("detail-plate").hidden = false;
    $("detail-actions").hidden = false;

    $("project-detail-content").hidden = false;
    markReady();
  }

  function slugify(text) {
    return text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function setupFavorite(projectId) {
    const { favorites } = window.estudioIdeias;
    const button = $("detail-favorite");
    const label = button.querySelector("span");

    const sync = () => {
      const active = favorites.isFavorite(projectId);
      button.setAttribute("aria-pressed", String(active));
      label.textContent = active ? "Favoritado" : "Favoritar";
    };

    button.addEventListener("click", () => {
      favorites.toggle(projectId);
      sync();
    });
    sync();
  }

  function formatAuthors(work) {
    if (!work.autores || !work.autores.length) return "Autoria não informada";
    return work.autores.join(", ") + (work.mais_autores ? " et al." : "");
  }

  async function loadReadings(project) {
    const list = $("detail-readings");
    const sourceNote = $("detail-readings-source");

    try {
      const { works, source, savedAt } = await window.openAlex.relatedWorks(project);
      list.replaceChildren(
        ...works.map((work) => {
          const li = document.createElement("li");
          li.className = "readings__item";

          const link = document.createElement("a");
          link.className = "readings__title";
          link.href = work.doi || work.openalex;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = work.titulo;

          const meta = document.createElement("p");
          meta.className = "readings__meta";
          meta.textContent = [formatAuthors(work), work.fonte, work.ano].filter(Boolean).join(" · ");

          li.append(link, meta);
          if (work.acesso_aberto) {
            const badge = document.createElement("span");
            badge.className = "tag tag--success";
            badge.textContent = "Acesso aberto";
            li.appendChild(badge);
          }
          return li;
        })
      );

      if (source === "snapshot") {
        sourceNote.textContent = "Seleção salva da área do projeto (a consulta em tempo real não estava disponível).";
      } else {
        const date = new Date(savedAt).toLocaleDateString("pt-BR");
        sourceNote.textContent = `Consulta feita em ${date}; os resultados ficam guardados por 24 horas.`;
      }
    } catch (error) {
      console.error("detalhes: leituras relacionadas", error);
      list.innerHTML = '<li class="readings__empty">Não foi possível carregar as leituras agora.</li>';
    } finally {
      list.removeAttribute("aria-busy");
    }
  }

  async function init() {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) return showNotFound("Nenhum projeto foi indicado no endereço.");

    try {
      await window.estudioIdeias.ready;
    } catch {
      return showNotFound(window.estudioIdeias.mensagemDeFalha);
    }

    const project = window.estudioIdeias.projects.get(id);
    if (!project) return showNotFound();

    fillProject(project);
    setupFavorite(project.id);
    window.pdfViewer.mount($("pdf-viewer"), `assets/docs/${encodeURIComponent(project.id)}.pdf`);
    loadReadings(project);
  }

  init();
})();
