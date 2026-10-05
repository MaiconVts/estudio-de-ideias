// assets/js/ferramentas.js
// Lista de ferramentas com filtro por categoria. Os cartões entram pelo reveal em lote
// de motion-base.js (data-revelavel + projetos:renderizados).
const ferramentas = [
  {
    titulo: "Gerador de Referências ABNT",
    descricao: "Ferramenta online para criar referências no padrão ABNT.",
    link: "https://www.mybib.com/pt/ferramentas/gerador-referencias-abnt",
    categoria: "abnt",
  },
  {
    titulo: "Responsividade com Bootstrap",
    descricao: "Tutorial prático sobre como tornar sua página responsiva.",
    link: "https://getbootstrap.com/docs/5.0/layout/grid/",
    categoria: "responsividade",
  },
  {
    titulo: "Git e GitHub para Iniciantes",
    descricao: "Guia passo a passo para versionamento de projetos.",
    link: "https://www.freecodecamp.org/portuguese/news/tutorial-de-git-e-github-controle-de-versao-para-iniciantes/",
    categoria: "git",
  },
  {
    titulo: "Canva para Criar Apresentações",
    descricao: "Ferramenta para criar slides bonitos e rápidos.",
    link: "https://www.canva.com/",
    categoria: "ferramentas",
  },
  {
    titulo: "Técnica Pomodoro",
    descricao: "Use o método Pomodoro para melhorar sua produtividade.",
    link: "https://pomofocus.io/",
    categoria: "estudos",
  },
];

const ICONE_EXTERNO =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

function nomeCategoria(valor) {
  const opcao = document.querySelector(`#categoriaSelect option[value="${valor}"]`);
  return opcao ? opcao.textContent : valor;
}

function renderizarFerramentas(filtro = "todas") {
  const lista = document.getElementById("listaFerramentas");
  lista.innerHTML = "";

  const filtradas = ferramentas.filter((f) => filtro === "todas" || f.categoria === filtro);

  filtradas.forEach((f) => {
    const card = document.createElement("a");
    card.className = "tool-card";
    card.href = f.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.dataset.revelavel = "";
    card.innerHTML = `
      <span class="tool-card__category"></span>
      <h2 class="tool-card__title"></h2>
      <p class="tool-card__text"></p>
      <span class="tool-card__cta">Acessar ${ICONE_EXTERNO}<span class="visually-hidden"> (abre em nova aba)</span></span>`;
    card.querySelector(".tool-card__category").textContent = nomeCategoria(f.categoria);
    card.querySelector(".tool-card__title").textContent = f.titulo;
    card.querySelector(".tool-card__text").textContent = f.descricao;
    lista.appendChild(card);
  });

  const contagem = document.querySelector('[data-plate="contagem"]');
  if (contagem) contagem.textContent = filtradas.length;
  lista.dispatchEvent(new CustomEvent("projetos:renderizados", { bubbles: true }));
}

document.addEventListener("DOMContentLoaded", () => {
  const total = document.querySelector('[data-plate="total"]');
  if (total) total.textContent = String(ferramentas.length).padStart(2, "0");
  const select = document.getElementById("categoriaSelect");
  select.addEventListener("change", () => renderizarFerramentas(select.value));
  renderizarFerramentas();
});
