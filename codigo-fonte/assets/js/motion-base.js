// assets/js/motion-base.js
// Linguagem de motion compartilhada: durações e curvas lidas dos tokens, Lenis ligado
// ao ScrollTrigger, reveals em [data-reveal], entrada do .page-hero e levas de cartões.
// O conteúdo é visível por padrão; nada anima sem GSAP ou com movimento reduzido.

(() => {
  const ns = (window.estudioIdeias = window.estudioIdeias || {});
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = getComputedStyle(document.documentElement);
  const token = (name) => root.getPropertyValue(name).trim();
  const num = (name, fallback) => parseFloat(token(name)) || fallback;
  const sec = (name, fallback) => num(name, fallback) / 1000;

  const motion = {
    reduce,
    DUR: {
      fast: sec("--duration-fast", 150),
      base: sec("--duration-base", 220),
      slow: sec("--duration-slow", 520),
      unfold: sec("--duration-unfold", 1800),
    },
    EASE: { out: token("--gsap-ease-out") || "power4.out", fold: token("--gsap-ease-fold") || "power3.inOut" },
    SHIFT: num("--reveal-shift", 24),
    STAGGER: sec("--stagger", 60),
    OFFSET: num("--scroll-offset", 80),
    gsap: null,
  };
  ns.motion = motion;

  if (!window.gsap || reduce) return;
  const { gsap, ScrollTrigger, SplitText } = window;
  gsap.registerPlugin(...[ScrollTrigger, SplitText].filter(Boolean));
  motion.gsap = gsap;

  // Scroll suave ligado ao ScrollTrigger
  if (window.Lenis && ScrollTrigger) {
    const lenis = new window.Lenis({ lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    ns.scrollTo = (target) => lenis.scrollTo(target, { offset: -motion.OFFSET });
  }

  // Entradas usam opacity (não autoAlpha) para nada sair da ordem do Tab; se o foco
  // chega a algo ainda entrando, a entrada termina na hora e o foco fica legível
  document.addEventListener("focusin", (event) => {
    for (let el = event.target; el && el !== document.body; el = el.parentElement) {
      gsap.getTweensOf(el).forEach((tween) => tween.progress(1));
    }
  });

  // Sobe e aparece quando entra na tela; limpa os estilos ao terminar
  motion.reveal = (targets, start = "top 90%") => {
    if (!ScrollTrigger) return;
    ScrollTrigger.batch(targets, {
      start,
      once: true,
      onEnter: (batch) =>
        gsap.from(batch, {
          y: motion.SHIFT,
          opacity: 0,
          duration: motion.DUR.slow,
          ease: motion.EASE.out,
          stagger: motion.STAGGER,
          clearProps: "transform,opacity",
        }),
    });
  };

  // Título em palavras atrás de máscara (folga para acentos no CSS de cada título)
  motion.splitTitle = (selector, wordsClass) => {
    const first = document.querySelector(selector);
    if (!SplitText || !first) return;
    // aria-label só é permitido no título; em <span> (linhas do hero) as palavras
    // continuam no DOM como texto e são lidas sem ele
    const isHeading = /^H[1-6]$/.test(first.tagName);
    SplitText.create(selector, {
      type: "words",
      aria: isHeading ? "auto" : "none",
      mask: "words",
      wordsClass,
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, { yPercent: 110, duration: motion.DUR.slow * 1.6, stagger: motion.STAGGER, ease: motion.EASE.out }),
    });
  };

  // --- Cabeçalho das páginas internas ---
  // Páginas que preenchem o cabeçalho por script (detalhes) marcam data-aguarda
  // e avisam com "pagina:pronta"; as demais entram de imediato
  const hero = document.querySelector(".page-hero");
  const introHero = () => {
    motion.splitTitle(".page-hero__title", "page-hero__word");
    const intro = gsap.timeline({ defaults: { ease: motion.EASE.out, duration: motion.DUR.slow } });
    const step = (selector, vars, at) => {
      const el = hero.querySelector(selector);
      if (el) intro.from(el, { opacity: 0, ...vars }, at);
    };
    step(".page-hero__lede", { y: motion.SHIFT }, 0.3);
    step(".page-hero__actions", { y: motion.SHIFT }, 0.4);
    step(".spec-plate", { x: motion.SHIFT }, 0.5);
    step(".page-hero__fold", { y: motion.SHIFT * 2, rotate: -6, duration: motion.DUR.slow * 2, ease: motion.EASE.fold }, 0.1);

    // Parallax em camadas: a malha desce devagar, a dobra sobe
    if (ScrollTrigger) {
      const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      const grid = hero.querySelector(".page-hero__grid");
      const fold = hero.querySelector(".page-hero__fold");
      if (grid) gsap.to(grid, { yPercent: 18, ease: "none", scrollTrigger: scrub });
      if (fold) gsap.to(fold, { yPercent: -24, ease: "none", scrollTrigger: { ...scrub } });
    }
  };
  document.addEventListener("pagina:pronta", () => ScrollTrigger && ScrollTrigger.refresh());
  if (hero) {
    if (hero.hasAttribute("data-aguarda") && !hero.hasAttribute("data-pronta")) {
      document.addEventListener("pagina:pronta", introHero, { once: true });
    } else {
      introHero();
    }
  }

  // --- Reveals declarados no HTML ---
  const marked = document.querySelectorAll("[data-reveal]");
  if (marked.length) motion.reveal(marked);

  // --- Cartões renderizados em levas (Home, Projetos, Favoritos, Ferramentas) ---
  document.addEventListener("projetos:renderizados", (event) => {
    const fresh = event.target.querySelectorAll?.(".project-card:not([data-revelado]), [data-revelavel]:not([data-revelado])") || [];
    fresh.forEach((card) => card.setAttribute("data-revelado", ""));
    if (fresh.length) {
      motion.reveal(fresh, "top 92%");
      ScrollTrigger?.refresh();
    }
  });
})();
