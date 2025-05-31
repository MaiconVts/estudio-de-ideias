const ferramentas = [
  {
    titulo: "Gerador de Referências ABNT",
    descricao: "Ferramenta online para criar referências no padrão ABNT.",
    link: "https://www.mybib.com/pt/ferramentas/gerador-referencias-abnt",
    categoria: "abnt"
  },
  {
    titulo: "Responsividade com Bootstrap",
    descricao: "Tutorial prático sobre como tornar sua página responsiva.",
    link: "https://getbootstrap.com/docs/5.0/layout/grid/",
    categoria: "responsividade"
  },
  {
    titulo: "Git e GitHub para Iniciantes",
    descricao: "Guia passo a passo para versionamento de projetos.",
    link: "https://www.freecodecamp.org/portuguese/news/tutorial-de-git-e-github-controle-de-versao-para-iniciantes/",
    categoria: "git"
  },
  {
    titulo: "Canva para Criar Apresentações",
    descricao: "Ferramenta para criar slides bonitos e rápidos.",
    link: "https://www.canva.com/",
    categoria: "ferramentas"
  },
  {
    titulo: "Técnica Pomodoro",
    descricao: "Use o método Pomodoro para melhorar sua produtividade.",
    link: "https://pomofocus.io/",
    categoria: "estudos"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderizarFerramentas();
});

function filtrarFerramentas() {
  const valor = document.getElementById("categoriaSelect").value;
  renderizarFerramentas(valor);
}

function renderizarFerramentas(filtro = "todas") {
  const lista = document.getElementById("listaFerramentas");
  lista.innerHTML = "";

  const filtradas = ferramentas.filter(f =>
    filtro === "todas" || f.categoria === filtro
  );

  filtradas.forEach(f => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p class="project__title">${f.titulo}</p>
      <p>${f.descricao}</p>
      <a href="${f.link}" target="_blank">Acessar</a>
    `;
    lista.appendChild(card);
  });
}