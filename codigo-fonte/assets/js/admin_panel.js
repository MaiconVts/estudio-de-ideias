// assets/js/admin_panel.js
// Fila de moderação: lista as submissões não aprovadas e aplica aprovar, rejeitar ou
// pedir correção. As placas do cabeçalho mostram quantas estão em cada estado.
// Só abre com sessão de moderador (conta.js); sem ela, a fila dá lugar ao aviso de acesso.
(async () => {
  const tabelaBody = document.getElementById("submissoes-tbody");
  const alertas = document.getElementById("admin-alertas");
  const dialogo = document.getElementById("confirmar-acao");
  if (!tabelaBody) return;

  const sessao = window.estudioConta?.sessao();
  if (!sessao || sessao.papel !== "moderador") {
    document.querySelector(".data-table-wrap").hidden = true;
    document.querySelector(".moderation__bloqueio").hidden = false;
    return;
  }
  const conta = document.querySelector(".moderation__conta");
  conta.querySelector('[data-conta="nome"]').textContent = `Conectado como ${sessao.nome}`;
  conta.hidden = false;
  document.getElementById("sair").addEventListener("click", () => {
    window.estudioConta.sair();
    window.location.href = "./login.html";
  });

  const ICONES = {
    aprovar: '<path d="M20 6 9 17l-5-5"/>',
    rejeitar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    corrigir: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  };
  const icone = (nome) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONES[nome]}</svg>`;

  function linhaUnica(texto, tipo) {
    const modificador = tipo ? ` data-table__message--${tipo}` : "";
    tabelaBody.innerHTML = `<tr><td colspan="5" class="data-table__message${modificador}"></td></tr>`;
    tabelaBody.querySelector("td").textContent = texto;
  }

  if (!window.estudioIdeias || !window.estudioIdeias.projects) {
    linhaUnica("Erro crítico: API de projetos não carregada. O painel não pode funcionar.", "erro");
    return;
  }

  await window.estudioIdeias.ready;
  const { projects } = window.estudioIdeias;

  function exibirAlerta(mensagem, tipo) {
    const alerta = document.createElement("p");
    alerta.className = `alerta alerta--${tipo}`;
    alerta.textContent = mensagem;
    alertas.replaceChildren(alerta);
    setTimeout(() => alerta.remove(), 4000);
  }

  // "Correção Solicitada" -> "correcao-solicitada"
  const classeStatus = (status) =>
    (status || "Pendente")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const botao = (acao, classe, rotulo, id) =>
    `<button type="button" class="action-btn ${classe}" data-id="${id}">${icone(acao)} ${rotulo}</button>`;

  function atualizarPlacas(submissions) {
    const conta = (status) => submissions.filter((s) => (s.status || "Pendente") === status).length;
    const pend = document.querySelector('[data-plate="pendentes"]');
    const corr = document.querySelector('[data-plate="correcao"]');
    if (pend) pend.textContent = String(conta("Pendente")).padStart(2, "0");
    if (corr) corr.textContent = String(conta("Correção Solicitada")).padStart(2, "0");
  }

  function renderTable() {
    if (typeof projects.getSubmissions !== "function") {
      linhaUnica("Erro ao carregar submissões: API incompleta.", "erro");
      return;
    }

    const submissions = projects.getSubmissions();
    atualizarPlacas(submissions);
    tabelaBody.innerHTML = "";

    if (submissions.length === 0) {
      linhaUnica("Nenhuma submissão para análise no momento. Envie um projeto pela página Enviar projeto e ele aparece aqui.");
      return;
    }

    submissions.forEach((sub) => {
      const tr = document.createElement("tr");
      let dataCriacao = "Data Indisponível";
      if (sub.createdAt) dataCriacao = new Date(sub.createdAt).toLocaleDateString("pt-BR");
      else if (sub.id) dataCriacao = new Date(sub.id).toLocaleDateString("pt-BR");

      let acoes = "";
      if (sub.status === "Pendente") {
        acoes = [
          botao("aprovar", "approve-btn", "Aprovar", sub.id),
          botao("rejeitar", "reject-btn", "Rejeitar", sub.id),
          botao("corrigir", "correct-btn", "Correção", sub.id),
        ].join("");
      } else if (sub.status === "Correção Solicitada") {
        acoes = [
          botao("aprovar", "approve-btn", "Aprovar", sub.id),
          botao("rejeitar", "reject-btn", "Rejeitar", sub.id),
        ].join("");
      }

      tr.innerHTML = `
        <td data-rotulo="Projeto"><a class="details-link"></a></td>
        <td data-rotulo="Membros"></td>
        <td data-rotulo="Submissão" class="num"></td>
        <td data-rotulo="Status"><span class="status-badge status-${classeStatus(sub.status)}"></span></td>
        <td data-rotulo="Ações">${acoes ? `<div class="action-buttons-group" role="group">${acoes}</div>` : '<span class="moderated-text"></span>'}</td>`;

      const titulo = sub.title || "Sem título";
      const link = tr.querySelector(".details-link");
      link.href = `./detalhes.html?id=${encodeURIComponent(sub.id)}`;
      link.textContent = titulo;
      tr.children[1].textContent = sub.author || "Sem autor";
      tr.children[2].textContent = dataCriacao;
      tr.querySelector(".status-badge").textContent = sub.status || "Pendente";
      const grupo = tr.querySelector(".action-buttons-group");
      if (grupo) grupo.setAttribute("aria-label", `Ações para ${titulo}`);
      const moderado = tr.querySelector(".moderated-text");
      if (moderado) moderado.textContent = `Status: ${sub.status}`;
      tabelaBody.appendChild(tr);
    });
  }

  const ACOES = {
    "approve-btn": ["Aprovado", "Tem certeza que deseja APROVAR este projeto?", "Projeto APROVADO com sucesso!"],
    "reject-btn": ["Rejeitado", "Tem certeza que deseja REJEITAR este projeto?", "Projeto REJEITADO."],
    "correct-btn": [
      "Correção Solicitada",
      "Tem certeza que deseja solicitar CORREÇÕES para este projeto?",
      "CORREÇÃO SOLICITADA para o projeto.",
    ],
  };

  tabelaBody.addEventListener("click", (event) => {
    const button = event.target.closest(".action-btn");
    if (!button) return;
    const chave = Object.keys(ACOES).find((classe) => button.classList.contains(classe));
    if (!chave) return;
    const [novoStatus, confirmacao, feedback] = ACOES[chave];
    dialogo.querySelector("#dialogo-texto").textContent = confirmacao;
    dialogo.returnValue = "";
    dialogo.addEventListener("close", () => {
      if (dialogo.returnValue === "confirmar") aplicar(button.dataset.id, novoStatus, feedback);
      else button.focus();
    }, { once: true });
    dialogo.showModal();
  });

  function aplicar(id, novoStatus, feedback) {
    if (typeof projects.updateStatus !== "function") {
      exibirAlerta("Erro crítico: Não foi possível atualizar o status do projeto.", "erro");
      return;
    }
    projects.updateStatus(id, novoStatus);
    exibirAlerta(feedback, "sucesso");
    renderTable();
    document.getElementById("fila-titulo").focus();
  }

  renderTable();
})();
