// assets/js/projetos-utils.js
// Cartão de projeto único do site (Home, Projetos, Favoritos): aba com código e sigla
// da área, título que leva aos detalhes, resumo, metadados em <dl> e tags.

(() => {
  const NOVO_A_PARTIR_DE = 2025; // projetos deste ano recebem a marca "novo"

  const AREAS = {
    frontend: { nome: "Frontend", sigla: "FE" },
    backend: { nome: "Backend", sigla: "BE" },
    mobile: { nome: "Mobile", sigla: "MB" },
    redes: { nome: "Redes", sigla: "RD" },
    networking: { nome: "Redes", sigla: "RD" },
    "banco-dados": { nome: "Banco de Dados", sigla: "BD" },
    database: { nome: "Banco de Dados", sigla: "BD" },
    seguranca: { nome: "Segurança da Informação", sigla: "SG" },
    cybersecurity: { nome: "Segurança da Informação", sigla: "SG" },
  };

  const areaOf = (slug) => AREAS[String(slug || "").toLowerCase()];

  // Código de chamada estável a partir do id do projeto (EI-266E)
  const projectCode = (id) => `EI-${String(id || "0000").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase()}`;

  const formatNumber = (n) => new Intl.NumberFormat("pt-BR").format(n);

  const STAR =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createFavoriteButton(project, isFavorite = false) {
    const button = el("button", "fav-toggle");
    button.type = "button";
    button.innerHTML = STAR;
    const sync = (on) => {
      button.setAttribute("aria-pressed", String(on));
      button.setAttribute("aria-label", `${on ? "Remover dos" : "Adicionar aos"} favoritos: ${project.title || "projeto"}`);
    };
    sync(isFavorite);

    button.addEventListener("click", () => {
      window.estudioIdeias.favorites.toggle(project.id);
      const on = window.estudioIdeias.favorites.isFavorite(project.id);
      sync(on);
      button.dispatchEvent(new CustomEvent("favorito:alterado", { bubbles: true, detail: { id: project.id, favorito: on } }));
    });

    return button;
  }

  // favorite: true/false mostra o botão no estado dado; null omite o botão
  function createProjectElement(project, favorite = null) {
    const area = areaOf(project.area);
    const card = el("article", "project-card");
    card.dataset.area = project.area || "";
    if (Number(project.year) >= NOVO_A_PARTIR_DE) card.dataset.novo = "";

    const tab = el("div", "project-card__tab");
    tab.append(el("span", "project-code", projectCode(project.id)), el("span", "area-code", area ? area.sigla : "—"));
    if (favorite !== null) tab.append(createFavoriteButton(project, favorite));

    const title = el("h3", "project-title");
    const link = el("a", "project-link", project.title || "Título indisponível");
    link.href = `./detalhes.html?id=${encodeURIComponent(project.id || "")}`;
    if (project.title) link.title = project.title; // título inteiro quando o cartão corta em 3 linhas
    title.append(link);

    const metadata = el("dl", "project-metadata");
    [
      ["Autor", "author-name-value", project.author || "Autor desconhecido"],
      ["Ano", "year-tag num", project.year || "—"],
      ["Citações", "citations-count-value num", formatNumber(project.citations || 0)],
    ].forEach(([label, cls, value]) => {
      const row = el("div");
      row.append(el("dt", "", label), el("dd", cls, value));
      metadata.append(row);
    });

    const tags = el("p", "project-tags");
    tags.append(
      el("span", "area-tag", area ? area.nome : "Área não informada"),
      el("span", "tech-tag", Array.isArray(project.technologies) ? project.technologies.join(", ") : "")
    );

    card.append(tab, title, el("p", "project-description", project.summary || "Sem resumo."), metadata, tags);
    return card;
  }

  window.estudioIdeiasUtils = { AREAS, areaOf, projectCode, formatNumber, createFavoriteButton, createProjectElement };
})();
