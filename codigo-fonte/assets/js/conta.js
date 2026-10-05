// assets/js/conta.js
// Contas no navegador, no limite do que o front faz sem servidor: senha guardada como
// SHA-256 com sal por usuário, sessão sem senha e com validade, papel autor ou moderador.
// Recuperação de senha, login social e verificação de e-mail dependem do back-end.
(() => {
  const CHAVE_USUARIOS = "usuarios";
  const CHAVE_SESSAO = "estudio:sessao";
  const VALIDADE = 7 * 24 * 60 * 60 * 1000;
  const DEMO = Object.freeze({
    nome: "Conta Demo",
    email: "demo@estudiodeideias.app",
    senha: "demo1234",
    papel: "moderador",
  });

  const hex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const novoSal = () => hex(crypto.getRandomValues(new Uint8Array(16)));
  const resumo = async (senha, sal) =>
    hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${sal}:${senha}`)));

  const ler = (chave, padrao) => {
    try {
      return JSON.parse(localStorage.getItem(chave)) ?? padrao;
    } catch {
      return padrao;
    }
  };
  const lerUsuarios = () => (Array.isArray(ler(CHAVE_USUARIOS, [])) ? ler(CHAVE_USUARIOS, []) : []);
  const gravarUsuarios = (lista) => localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));

  async function registro({ nome, email, senha, papel }) {
    const sal = novoSal();
    return { nome, email: email.trim().toLowerCase(), papel, sal, hash: await resumo(senha, sal) };
  }

  // Converte contas antigas (senha em texto puro) e garante a conta demo
  async function preparar() {
    const usuarios = await Promise.all(
      lerUsuarios().map((u) =>
        typeof u.password === "string"
          ? registro({ nome: u.name ?? u.nome ?? "Sem nome", email: u.email ?? "", senha: u.password, papel: "autor" })
          : u,
      ),
    );
    if (!usuarios.some((u) => u.email === DEMO.email)) usuarios.push(await registro(DEMO));
    gravarUsuarios(usuarios);
    localStorage.removeItem("usuarioLogado");
  }

  const pronto = preparar().catch(() => {});

  function sessao() {
    const atual = ler(CHAVE_SESSAO, null);
    if (!atual || typeof atual.expira !== "number" || atual.expira < Date.now()) {
      if (atual) localStorage.removeItem(CHAVE_SESSAO);
      return null;
    }
    return atual;
  }

  function abrirSessao({ nome, email, papel }) {
    const nova = { nome, email, papel, expira: Date.now() + VALIDADE };
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(nova));
    return nova;
  }

  async function entrar(email, senha) {
    await pronto;
    const alvo = lerUsuarios().find((u) => u.email === email.trim().toLowerCase());
    if (!alvo || (await resumo(senha, alvo.sal)) !== alvo.hash) return null;
    return abrirSessao(alvo);
  }

  // Retorna false se o e-mail já existe
  async function cadastrar({ nome, email, senha }) {
    await pronto;
    const usuarios = lerUsuarios();
    if (usuarios.some((u) => u.email === email.trim().toLowerCase())) return false;
    usuarios.push(await registro({ nome, email, senha, papel: "autor" }));
    gravarUsuarios(usuarios);
    return true;
  }

  const sair = () => localStorage.removeItem(CHAVE_SESSAO);

  window.estudioConta = { pronto, entrar, cadastrar, sessao, sair, DEMO };
})();
