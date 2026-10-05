// assets/js/home-motion.js
// Coreografia da Home: título, pacote, teclas, parallax entre grade e folha, acervo.
// Lenis, tokens de motion e levas de cartões vêm de motion-base.js.

(() => {
  const motion = window.estudioIdeias?.motion;
  if (!motion?.gsap) return;
  const { gsap, DUR, EASE, SHIFT, STAGGER } = motion;

  // --- Entrada do hero ---
  motion.splitTitle(".hero__line", "hero__word");

  gsap
    .timeline({ defaults: { ease: EASE.out } })
    // O lede é o LCP: entra só deslocando, legível desde o primeiro frame
    .from(".hero__lede", { y: SHIFT * 0.66, duration: DUR.slow }, 0.35)
    .from(".packet", { y: SHIFT, opacity: 0, duration: DUR.slow * 1.4, ease: EASE.fold }, 0.45)
    .from(".spec-plate", { x: SHIFT * 0.83, opacity: 0, duration: DUR.slow }, 0.9)
    .from(".area-key", { y: SHIFT * 0.58, opacity: 0, duration: DUR.slow, stagger: STAGGER }, 0.7);

  // --- Parallax em camadas: a grade anda mais devagar que a folha ---
  const scrub = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__grid", { yPercent: 18, ease: "none", scrollTrigger: scrub });
  gsap.to(".hero__sheet", { yPercent: -10, ease: "none", scrollTrigger: { ...scrub } });

  // --- Acervo e chamada final ---
  motion.reveal(document.querySelectorAll(".acervo__head"), "top 85%");
  motion.reveal(document.querySelectorAll(".publique__inner > *"), "top 80%");
})();
