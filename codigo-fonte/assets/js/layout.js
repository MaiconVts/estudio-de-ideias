// assets/js/layout.js
// Monta header, footer e botão "voltar ao topo" em todas as páginas.
// Uso no HTML: <header id="site-header"></header> ... <footer id="site-footer"></footer>
// Carregue com `defer` antes dos scripts da página: os elementos já existem no DOMContentLoaded.

(function () {
  const NAV_LINKS = [
    { href: "index.html", label: "Início" },
    { href: "projetos.html", label: "Projetos" },
    { href: "submissao.html", label: "Enviar projeto" },
    { href: "favoritos.html", label: "Favoritos" },
    { href: "ferramentas.html", label: "Ferramentas" },
    { href: "login.html", label: "Entrar", cta: true },
  ];

  // Com sessão aberta (conta.js), o CTA leva à conta em vez de "Entrar"
  const conectado = (() => {
    try {
      const sessao = JSON.parse(localStorage.getItem("estudio:sessao"));
      return Boolean(sessao && sessao.expira > Date.now());
    } catch {
      return false;
    }
  })();
  if (conectado) NAV_LINKS[NAV_LINKS.length - 1].label = "Minha conta";

  const FOOTER_COLUMNS = [
    {
      title: "Navegação",
      links: [
        ["index.html", "Início"],
        ["projetos.html", "Projetos"],
        ["submissao.html", "Publicar projeto"],
        ["favoritos.html", "Favoritos"],
      ],
    },
    {
      title: "Recursos acadêmicos",
      links: [
        ["normas.html", "Normas de publicação"],
        ["guia_apresentacao.html", "Guia de apresentação"],
        ["eventos.html", "Eventos"],
        ["tutoriais.html", "Tutoriais técnicos"],
      ],
    },
  ];

  const CONTACT_LINKS = [
    ["contato.html", "Fale conosco"],
    ["faq.html", "Perguntas frequentes"],
    ["carreiras.html", "Trabalhe conosco"],
    ["privacidade.html", "Política de privacidade"],
  ];

  // Páginas internas que destacam um item do menu
  const PAGE_ALIASES = { "detalhes.html": "projetos.html", "admin.html": "login.html" };

  const currentPage = (() => {
    const file = location.pathname.split("/").pop() || "index.html";
    return PAGE_ALIASES[file] || file;
  })();

  const ICON_MENU =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const ICON_UP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  function renderHeader(el) {
    const items = NAV_LINKS.map(({ href, label, cta }) => {
      const current = href === currentPage ? ' aria-current="page"' : "";
      const cls = cta ? "site-nav__link site-nav__link--cta" : "site-nav__link";
      return `<li><a class="${cls}" href="${href}"${current}>${label}</a></li>`;
    }).join("");

    el.classList.add("site-header");
    el.innerHTML = `
      <div class="site-header__inner">
        <a class="site-brand" href="index.html">
          <svg class="site-brand__mark" viewBox="0 0 40 28" aria-hidden="true" focusable="false">
            <path d="M2 4 L14 1 L14 25 L2 27 Z" class="m-ink"/>
            <path d="M14 1 L26 4 L26 27 L14 25 Z" class="m-foil"/>
            <path d="M26 4 L38 1 L38 25 L26 27 Z" class="m-valley"/>
            <path d="M2 14 L14 11 L26 14 L38 11" class="m-crease"/>
          </svg>
          <span class="site-brand__name">ESTÚDIO DE IDEIAS</span>
        </a>
        <nav class="site-nav" aria-label="Principal">
          <button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="site-nav-list" aria-label="Abrir menu">${ICON_MENU}</button>
          <ul class="site-nav__list" id="site-nav-list">${items}</ul>
        </nav>
      </div>`;

    const toggle = el.querySelector(".site-nav__toggle");
    const list = el.querySelector(".site-nav__list");
    // Mesmo corte de layout.css: abaixo dele a lista fechada sai da leitura e do Tab
    const compacto = window.matchMedia("(max-width: 992px)");
    const setOpen = (open) => {
      list.classList.toggle("is-open", open);
      list.inert = compacto.matches && !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    setOpen(false);
    compacto.addEventListener("change", () => setOpen(false));

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!list.classList.contains("is-open"));
    });
    document.addEventListener("click", (event) => {
      if (list.classList.contains("is-open") && !el.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && list.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  function renderFooter(el) {
    const columns = FOOTER_COLUMNS.map(
      ({ title, links }) => `
        <div class="footer-section">
          <h2 class="footer-title">${title}</h2>
          <ul class="footer-links">${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
        </div>`
    ).join("");

    el.classList.add("site-footer");
    el.innerHTML = `
      <div class="footer-main">
        <div class="footer-section">
          <h2 class="footer-title">Sobre o Estúdio de Ideias</h2>
          <p class="footer-text">Repositório acadêmico que preserva e compartilha os projetos produzidos pelos estudantes de TI.</p>
        </div>
        ${columns}
      </div>
      <div class="footer-contact-bar">
        <ul class="footer-contact-links" aria-label="Contato e informações">
          ${CONTACT_LINKS.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}
        </ul>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">© 2025 Estúdio de Ideias — projeto acadêmico de ADS, PUC Minas. Projetos, autores e citações do acervo são fictícios, para demonstração.</p>
        <a class="footer-credit" href="https://maicontheodoro-dev.vercel.app" target="_blank" rel="noopener">
          <img src="assets/img/mt-icon.svg" alt="" width="20" height="20">
          <span>Desenvolvido por <strong>maicontheodoro-dev</strong><span class="visually-hidden"> (abre em nova aba)</span></span>
        </a>
      </div>`;
  }

  function renderScrollTop() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-to-top-button";
    btn.setAttribute("aria-label", "Voltar ao topo");
    btn.innerHTML = ICON_UP;
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          btn.classList.toggle("is-visible", window.scrollY > 400);
          ticking = false;
        });
      },
      { passive: true }
    );
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function renderSkipLink() {
    const main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "conteudo";
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = `#${main.id}`;
    link.textContent = "Pular para o conteúdo";
    document.body.prepend(link);
  }

  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) renderHeader(header);
  if (footer) renderFooter(footer);
  renderScrollTop();
  renderSkipLink();
})();
