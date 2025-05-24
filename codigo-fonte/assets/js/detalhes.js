document.addEventListener("DOMContentLoaded", () => {
  // console.log("Detalhes.js: DOMContentLoaded.");

  // Objeto para armazenar referências aos elementos do DOM
  const elements = {
    title: document.getElementById("detail-project-title"),
    author: document.getElementById("detail-project-author"),
    summary: document.getElementById("detail-project-summary"),
    year: document.getElementById("detail-project-year"),
    area: document.getElementById("detail-project-area"),
    technologies: document.getElementById("detail-project-technologies"),
    citations: document.getElementById("detail-project-citations"),
    type: document.getElementById("detail-project-type"), // Campo para tipo/categoria
    discipline: document.getElementById("detail-project-discipline"), // Campo para disciplina
    downloadLink: document.getElementById("detail-project-download-link"),
    cardContent: document.getElementById("project-detail-content"), // O <article> principal
    notFoundMessage: document.getElementById("project-not-found"), // O <div> para mensagens de erro
  };

  // Função auxiliar para formatar a exibição da área
  function getDisplayArea(areaValue) {
    if (!areaValue) return "Não especificada";
    const areaMap = {
      redes: "Redes",
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobile",
      "banco-dados": "Banco de Dados",
      seguranca: "Segurança da Informação",
      // Mantenha mapeamentos se o JSON usar valores diferentes dos que você quer exibir
      networking: "Redes",
      database: "Banco de Dados",
      cybersecurity: "Segurança da Informação",
    };
    return areaMap[String(areaValue).toLowerCase()] || areaValue;
  }

  // Função para preencher os detalhes do projeto na página
  function populateProjectDetails(project) {
    if (!project) {
      displayProjectNotFoundError(
        "Dados do projeto não puderam ser carregados ou projeto inválido."
      );
      return;
    }
    // console.log("Detalhes.js: Populando detalhes para:", project);
    document.title = `${
      project.title || "Detalhes do Projeto"
    } - Estúdio de Ideias`;

    if (elements.title)
      elements.title.textContent = project.title || "Título não disponível";
    if (elements.author)
      elements.author.textContent = project.author || "Autor não disponível";
    if (elements.summary)
      elements.summary.innerHTML = project.summary
        ? project.summary.replace(/\n/g, "<br>")
        : "Resumo não disponível.";
    if (elements.year) elements.year.textContent = project.year || "N/A";
    if (elements.area) elements.area.textContent = getDisplayArea(project.area);
    if (elements.technologies)
      elements.technologies.textContent = Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "N/A";
    if (elements.citations)
      elements.citations.textContent =
        project.citations !== undefined ? project.citations.toString() : "N/A";

    // Para campos que podem ou não existir no seu JSON principal (type, discipline)
    if (elements.type)
      elements.type.textContent = project.type || "Não especificado";
    if (elements.discipline)
      elements.discipline.textContent =
        project.discipline || "Não especificada";

    if (elements.downloadLink) {
      if (project.file) {
        // IMPORTANTE: Ajuste este caminho base para seus arquivos de download!
        // Exemplo: se seus arquivos ZIP/PDF estiverem na pasta 'assets/data/downloadable_files/'
        // e seu HTML está na raiz, o caminho seria 'assets/data/downloadable_files/'
        const basePathForDownloads = "assets/data/downloadable_files/"; // <--- AJUSTE ESTE CAMINHO!!!
        elements.downloadLink.href = `${basePathForDownloads}${project.file}`;
        elements.downloadLink.textContent = `Baixar ${project.file}`;
        elements.downloadLink.style.pointerEvents = "auto";
        elements.downloadLink.style.color = "";
      } else {
        elements.downloadLink.textContent = "Arquivo não disponível";
        elements.downloadLink.removeAttribute("href");
        elements.downloadLink.style.pointerEvents = "none";
        elements.downloadLink.style.color = "grey";
      }
    }

    if (elements.cardContent) elements.cardContent.style.display = "block";
    if (elements.notFoundMessage)
      elements.notFoundMessage.style.display = "none";
  }

  // Função para exibir a mensagem de erro "Projeto não encontrado"
  function displayProjectNotFoundError(customMessage) {
    console.warn(
      "Detalhes.js: Exibindo mensagem de projeto não encontrado/erro.",
      customMessage
    );
    if (elements.cardContent) elements.cardContent.style.display = "none";
    if (elements.notFoundMessage) {
      elements.notFoundMessage.style.display = "block";
      let messageP = elements.notFoundMessage.querySelector("p");
      if (!messageP) {
        messageP = document.createElement("p");
        elements.notFoundMessage.appendChild(messageP);
      }
      messageP.textContent =
        customMessage ||
        "O projeto que você está procurando não foi encontrado.";

      let homeLink = elements.notFoundMessage.querySelector("a");
      if (!homeLink && customMessage) {
        // Adiciona link para home se não existir e houver mensagem customizada
        homeLink = document.createElement("a");
        homeLink.href = "index.html"; // Assumindo que a home principal é index.html na raiz
        homeLink.textContent = " Voltar para a Home.";
        homeLink.style.marginLeft = "5px";
        messageP.appendChild(homeLink);
      } else if (!homeLink && !customMessage) {
        // Adiciona link para home se não existir e não houver mensagem customizada
        elements.notFoundMessage.innerHTML = `<p>O projeto que você está procurando não foi encontrado. <a href="index.html">Voltar para a Home</a>.</p>`;
      }
    }
    if (elements.title) elements.title.textContent = "Projeto Não Encontrado";
  }

  // Função principal para inicializar a página de detalhes
  function initializeDetailsPage() {
    // console.log("Detalhes.js: Iniciando initializeDetailsPage().");
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get("id"); // Lê o parâmetro 'id' da URL
    // console.log("Detalhes.js: ID do projeto da URL:", projectIdFromUrl);

    if (!projectIdFromUrl) {
      console.error("Detalhes.js: Nenhum 'id' de projeto encontrado na URL.");
      displayProjectNotFoundError(
        "Nenhum projeto especificado para visualização."
      );
      return;
    }

    if (!window.estudioIdeias || !window.estudioIdeias.projects) {
      console.error(
        "Detalhes.js: API estudioIdeias.projects não está pronta ou não foi encontrada."
      );
      displayProjectNotFoundError(
        "A base de dados de projetos não está acessível no momento."
      );
      return;
    }

    if (!elements.cardContent || !elements.notFoundMessage) {
      console.error(
        "Detalhes.js: Elementos HTML base (cardContent ou notFoundMessage) não encontrados no DOM."
      );
      document.body.innerHTML =
        "<p style='text-align:center; color:red; padding:20px;'>Erro crítico na estrutura da página de detalhes.</p>";
      return;
    }

    const project = window.estudioIdeias.projects.get(projectIdFromUrl); // Usa a API para buscar o projeto pelo ID

    if (project) {
      populateProjectDetails(project);
    } else {
      console.warn(
        `Detalhes.js: Projeto com ID "${projectIdFromUrl}" não encontrado pela API.`
      );
      displayProjectNotFoundError(
        `O projeto com o identificador "${projectIdFromUrl}" não foi encontrado.`
      );
    }
  }

  // Espera a API estar pronta (escutando o evento 'estudioApiReady' disparado pela api_estudio.js)
  if (window.estudioIdeias && window.estudioIdeias.projects) {
    // Verifica se a API já está pronta
    // console.log("Detalhes.js: API estudioIdeias já está pronta na carga inicial. Inicializando...");
    initializeDetailsPage();
  } else {
    // console.log("Detalhes.js: API estudioIdeias ainda não pronta. Aguardando evento 'estudioApiReady'...");
    document.addEventListener(
      "estudioApiReady",
      function handler() {
        // console.log("Detalhes.js: Evento 'estudioApiReady' recebido. Inicializando página de detalhes.");
        document.removeEventListener("estudioApiReady", handler); // Garante que rode apenas uma vez
        initializeDetailsPage();
      },
      { once: true }
    );

    // Fallback com timeout caso o evento não seja capturado ou a API demore muito
    setTimeout(() => {
      if (
        window.estudioIdeias &&
        window.estudioIdeias.projects &&
        !document.body.dataset.detailsApiInitialized
      ) {
        // console.warn("Detalhes.js: Inicializando via fallback setTimeout (API pode ter carregado, mas evento não capturado).");
        document.body.dataset.detailsApiInitialized = "true"; // Evita dupla inicialização
        initializeDetailsPage();
      } else if (
        !window.estudioIdeias &&
        !document.body.dataset.detailsApiInitialized
      ) {
        console.error(
          "Detalhes.js: API não carregou após timeout. Verifique o script da API (ex: projetos.js)."
        );
        displayProjectNotFoundError(
          "Não foi possível carregar a base de dados dos projetos (timeout)."
        );
      }
    }, 1200); // Timeout um pouco maior para dar chance à API
  }
});
