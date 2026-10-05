// assets/js/login.js
// Entrar, criar conta e conta demo (contas de conta.js, guardadas no navegador). Os painéis
// alternam por `hidden`; validação e mensagens vêm de formularios.js. Com sessão aberta,
// mostra quem está conectado no lugar dos formulários.
(() => {
  const forms = window.estudioIdeiasForms;
  const conta = window.estudioConta;
  const main = document.querySelector(".auth");
  const painelConectado = document.getElementById("painel-conectado");
  const painelEntrar = document.getElementById("painel-entrar");
  const painelCadastrar = document.getElementById("painel-cadastrar");
  const signinForm = document.getElementById("signin-form");
  const signupForm = document.getElementById("signup-form");
  const signinStatus = document.getElementById("signin-status");
  const signupStatus = document.getElementById("signup-status");
  if (!main || !forms || !conta) return;

  const PAPEIS = { moderador: "Moderador(a)", autor: "Autor(a)" };
  const semHash = () => history.replaceState(null, "", location.pathname + location.search);

  // Destino depois de entrar: ?volta= (só páginas locais) ou o padrão do papel
  function destino(sessao) {
    const volta = new URLSearchParams(location.search).get("volta");
    if (volta && /^[\w-]+\.html$/.test(volta)) return `./${volta}`;
    return sessao.papel === "moderador" ? "./admin.html" : "./submissao.html";
  }

  // "entrar", "cadastrar" ou "conectado"
  function mostrar(modo, focar) {
    main.dataset.modo = modo;
    painelConectado.hidden = modo !== "conectado";
    painelEntrar.hidden = modo !== "entrar";
    painelCadastrar.hidden = modo !== "cadastrar";
    document.querySelectorAll(".auth__swap").forEach((bloco) => {
      bloco.hidden = bloco.dataset.para !== modo;
    });
    if (focar) document.querySelector(`#painel-${modo} input, #painel-${modo} a, #painel-${modo} button`)?.focus();
  }

  function mostrarConectado(sessao, focar) {
    painelConectado.querySelector('[data-conta="nome"]').textContent = sessao.nome;
    painelConectado.querySelector('[data-conta="papel"]').textContent = PAPEIS[sessao.papel] ?? sessao.papel;
    painelConectado.querySelector('[data-conta="email"]').textContent = sessao.email;
    const ir = document.getElementById("ir-painel");
    ir.href = destino(sessao);
    ir.textContent = sessao.papel === "moderador" ? "Abrir a moderação" : "Enviar um projeto";
    mostrar("conectado", focar);
  }

  document.getElementById("signup").addEventListener("click", () => {
    history.replaceState(null, "", "#cadastro");
    mostrar("cadastrar", true);
  });
  document.getElementById("signin").addEventListener("click", () => {
    semHash();
    mostrar("entrar", true);
  });
  document.getElementById("sair").addEventListener("click", () => {
    conta.sair();
    mostrar("entrar", true);
    forms.status(signinStatus, "sucesso", "Você saiu da conta.");
  });
  document.getElementById("esqueci").addEventListener("click", () => {
    forms.status(
      signinStatus,
      "erro",
      "A recuperação de senha envia um e-mail e depende do servidor, que esta versão não tem. Crie uma conta nova ou use a conta demo.",
    );
  });

  const atual = conta.sessao();
  if (atual) mostrarConectado(atual, false);
  else mostrar(location.hash === "#cadastro" ? "cadastrar" : "entrar", false);

  async function concluirEntrada(email, senha) {
    const sessao = await conta.entrar(email, senha);
    if (!sessao) {
      forms.status(signinStatus, "erro", "Usuário ou senha inválidos.");
      return;
    }
    signinForm.reset();
    forms.status(signinStatus, "sucesso", `Bem-vindo(a), ${sessao.nome}! Redirecionando…`);
    window.location.href = destino(sessao);
  }

  forms.acompanhar(signupForm);
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    forms.status(signupStatus);
    if (!forms.validar(signupForm)) return;

    const nome = document.getElementById("signup-name").value.trim();
    const emailCampo = document.getElementById("signup-email");
    const email = emailCampo.value.trim().toLowerCase();
    const senha = document.getElementById("signup-password").value;

    if (!(await conta.cadastrar({ nome, email, senha }))) {
      forms.marcar(emailCampo, "Este e-mail já está cadastrado. Faça login ou utilize outro e-mail.");
      emailCampo.focus();
      return;
    }

    signupForm.reset();
    semHash();
    mostrar("entrar", false);
    document.getElementById("signin-email").value = email;
    document.getElementById("signin-password").focus();
    forms.status(signinStatus, "sucesso", "Cadastro realizado com sucesso! Agora faça seu login.");
  });

  forms.acompanhar(signinForm);
  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    forms.status(signinStatus);
    if (!forms.validar(signinForm)) return;
    concluirEntrada(
      document.getElementById("signin-email").value,
      document.getElementById("signin-password").value,
    );
  });

  document.getElementById("entrar-demo").addEventListener("click", () => {
    forms.status(signinStatus);
    concluirEntrada(conta.DEMO.email, conta.DEMO.senha);
  });
})();
