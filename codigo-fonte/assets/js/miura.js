// assets/js/miura.js
// Folha Miura do hero, desenhada em canvas 2D (sem biblioteca: são ~200 faces).
// A folha se desdobra no carregamento, abre mais com o scroll e respira de leve;
// a poeira dourada usa o mesmo canvas para não carregar o tsParticles só para isso.
// Pausa no próprio visual (WCAG 2.2.2), parada fora da tela e com prefers-reduced-motion.

(() => {
  const canvas = document.getElementById("miura-canvas");
  if (!canvas) return;
  const figure = canvas.closest(".hero__sheet");
  const pauseBtn = figure.querySelector("[data-pausa]");
  const angleOut = figure.querySelector("[data-angulo]");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Geometria do padrão (unidades arbitrárias, escaladas no desenho)
  const A = 1; // lado ao longo do zigue-zague
  const B = 1; // lado inclinado
  const ALPHA = (60 * Math.PI) / 180; // ângulo do paralelogramo
  const NX = 14; // colunas de vértices
  const NY = 9; // linhas de vértices
  const THETA_FOLDED = 86;
  const THETA_OPEN = 40;
  const THETA_SCROLL = 18; // abertura extra ao rolar
  const tokens = getComputedStyle(document.documentElement);
  const UNFOLD_MS = parseFloat(tokens.getPropertyValue("--duration-unfold")) || 1800;
  const MONO = tokens.getPropertyValue("--font-mono").trim() || "monospace";
  const FOIL_GLOW = parseFloat(tokens.getPropertyValue("--foil-glow-blur")) || 28;

  // Siglas reais do acervo nas células (coluna, linha)
  const LABELS = [
    { area: "frontend", sigla: "FE", i: 3, j: 2 },
    { area: "backend", sigla: "BE", i: 7, j: 1 },
    { area: "banco-dados", sigla: "BD", i: 10, j: 3 },
    { area: "seguranca", sigla: "SG", i: 4, j: 5 },
    { area: "redes", sigla: "RD", i: 8, j: 5 },
    { area: "mobile", sigla: "MB", i: 11, j: 6 },
  ];
  const FOIL_CELL = { i: 6, j: 3 }; // o pacote de origem

  let colors = {};
  let counts = {};
  let width = 0;
  let height = 0;
  let dpr = 1;
  let start = 0;
  let scrollProgress = 0;
  let paused = reduceMotion;
  let visible = true;
  let rafId = 0;
  let pausedAt = 0;
  let timeOffset = 0;
  let dust = [];

  // --- Cores a partir dos tokens ---
  function readColor(name) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    ctx.fillStyle = "#000";
    ctx.fillStyle = value;
    const hex = ctx.fillStyle;
    if (hex.startsWith("#")) {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    const m = hex.match(/\d+(\.\d+)?/g) || [0, 0, 0];
    return m.slice(0, 3).map(Number);
  }

  function loadColors() {
    colors = {
      sheet: readColor("--sheet-white"),
      mountain: readColor("--mountain"),
      mountainSoft: readColor("--mountain-soft"),
      valley: readColor("--valley"),
      valleyDeep: readColor("--valley-deep"),
      foil: readColor("--foil"),
      foilLight: readColor("--foil-light"),
      ink: readColor("--ink"),
    };
  }

  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const mix = (c1, c2, t) => c1.map((v, k) => v + (c2[k] - v) * t);

  // --- Geometria Miura-ori (Schenk e Guest) ---
  function vertices(thetaDeg) {
    const t = (thetaDeg * Math.PI) / 180;
    const tanA = Math.tan(ALPHA);
    const root = Math.sqrt(1 + Math.cos(t) ** 2 * tanA ** 2);
    const H = A * Math.sin(t) * Math.sin(ALPHA);
    const S = (B * Math.cos(t) * tanA) / root;
    const L = A * Math.sqrt(1 - Math.sin(t) ** 2 * Math.sin(ALPHA) ** 2);
    const V = B / root;

    const pts = [];
    for (let j = 0; j < NY; j++) {
      const row = [];
      for (let i = 0; i < NX; i++) {
        row.push([i * S, j * L + (i % 2 ? V : 0), j % 2 ? H : 0]);
      }
      pts.push(row);
    }
    return { pts, H };
  }

  // Projeção ortográfica com a folha inclinada em direção ao leitor
  const TILT = (52 * Math.PI) / 180;
  const ROT = (-24 * Math.PI) / 180;
  function project([x, y, z], cx, cy, scale) {
    const xr = x * Math.cos(ROT) - y * Math.sin(ROT);
    const yr = x * Math.sin(ROT) + y * Math.cos(ROT);
    const y2 = yr * Math.cos(TILT) - z * Math.sin(TILT);
    const z2 = yr * Math.sin(TILT) + z * Math.cos(TILT);
    return [cx + xr * scale, cy + y2 * scale, z2];
  }

  // Caixa da folha projetada em escala 1, origem em 0
  function bounds(pts) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const row of pts) {
      for (const p of row) {
        const [x, y] = project(p, 0, 0, 1);
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  function normal(p0, p1, p2) {
    const u = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
    const v = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const len = Math.hypot(...n) || 1;
    return n.map((k) => k / len);
  }

  const LIGHT = (() => {
    const l = [-0.4, -0.6, 0.7];
    const len = Math.hypot(...l);
    return l.map((k) => k / len);
  })();

  // --- Desenho ---
  function draw(theta, time) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const { pts } = vertices(theta);
    // Escala fixa pela folha mais aberta (não "respira" de tamanho); centro pela caixa atual
    const fit = bounds(vertices(THETA_OPEN - THETA_SCROLL).pts);
    const scale = Math.min((width * 0.9) / fit.w, (height * 0.86) / fit.h);
    const box = bounds(pts);
    const cx = width * 0.5 - (box.x + box.w / 2) * scale;
    const cy = height * 0.5 - (box.y + box.h / 2) * scale;

    const proj = pts.map((row) => row.map((p) => project(p, cx, cy, scale)));

    const faces = [];
    for (let j = 0; j < NY - 1; j++) {
      for (let i = 0; i < NX - 1; i++) {
        const a = proj[j][i];
        const b = proj[j][i + 1];
        const c = proj[j + 1][i + 1];
        const d = proj[j + 1][i];
        const n = normal(pts[j][i], pts[j][i + 1], pts[j + 1][i]);
        const light = Math.max(0, Math.abs(n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]));
        faces.push({ i, j, quad: [a, b, c, d], depth: (a[2] + b[2] + c[2] + d[2]) / 4, light });
      }
    }
    faces.sort((f1, f2) => f1.depth - f2.depth);

    for (const f of faces) {
      const isFoil = f.i === FOIL_CELL.i && f.j === FOIL_CELL.j;
      // Montanha em cinza quente, vale em azul claro; a luz clareia para o branco da folha
      const base = isFoil ? colors.foil : f.j % 2 ? colors.valley : colors.mountainSoft;
      const shade = isFoil
        ? mix(colors.foil, colors.foilLight, f.light)
        : mix(mix(base, colors.mountain, 0.35), colors.sheet, Math.pow(f.light, 0.8));

      ctx.beginPath();
      ctx.moveTo(f.quad[0][0], f.quad[0][1]);
      for (let k = 1; k < 4; k++) ctx.lineTo(f.quad[k][0], f.quad[k][1]);
      ctx.closePath();
      ctx.fillStyle = rgb(shade);
      if (isFoil) {
        ctx.save();
        ctx.shadowColor = rgb(colors.foil, 0.55);
        ctx.shadowBlur = FOIL_GLOW;
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fill();
      }
      ctx.strokeStyle = f.j % 2 ? rgb(colors.valleyDeep, 0.22) : rgb(colors.ink, 0.12);
      ctx.lineWidth = 0.75;
      ctx.stroke();
    }

    // Rótulos de área: aparecem conforme a folha abre
    const reveal = Math.min(1, Math.max(0, (THETA_FOLDED - 18 - theta) / 30));
    if (reveal > 0) {
      ctx.textBaseline = "middle";
      for (const label of LABELS) {
        const q = [proj[label.j][label.i], proj[label.j][label.i + 1], proj[label.j + 1][label.i + 1], proj[label.j + 1][label.i]];
        const x = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4;
        const y = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
        const text = `${label.sigla} ${String(counts[label.area] ?? "").padStart(2, "0")}`;
        ctx.font = `500 ${Math.max(10, Math.min(13, width / 60))}px ${MONO}`;
        const w = ctx.measureText(text).width + 12;
        ctx.globalAlpha = reveal;
        ctx.fillStyle = rgb(colors.sheet, 0.92);
        ctx.fillRect(x - w / 2, y - 10, w, 20);
        ctx.fillStyle = rgb(colors.ink);
        ctx.fillText(text, x - w / 2 + 6, y + 1);
        ctx.globalAlpha = 1;
      }
    }

    // Poeira dourada
    if (!reduceMotion) {
      for (const p of dust) {
        const y = ((p.y - time * p.speed) % 1 + 1) % 1;
        const x = p.x + Math.sin(time * 0.0004 + p.phase) * 0.01;
        ctx.fillStyle = rgb(colors.foil, p.alpha * Math.sin(y * Math.PI));
        ctx.beginPath();
        ctx.arc(x * width, y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // --- Estado do ângulo ---
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function thetaAt(time) {
    const elapsed = reduceMotion ? UNFOLD_MS : Math.min(UNFOLD_MS, time - start);
    const intro = easeOut(elapsed / UNFOLD_MS);
    let theta = THETA_FOLDED + (THETA_OPEN - THETA_FOLDED) * intro;
    theta -= THETA_SCROLL * scrollProgress;
    if (!reduceMotion && elapsed >= UNFOLD_MS) theta += Math.sin((time - start - UNFOLD_MS) / 1600) * 3;
    return theta;
  }

  let lastAngleText = "";
  function render(time) {
    const theta = thetaAt(time);
    draw(theta, time);
    const text = `θ ${Math.round(theta)}°`;
    if (angleOut && text !== lastAngleText) {
      angleOut.textContent = text;
      lastAngleText = text;
    }
  }

  function loop(now) {
    rafId = 0;
    render(now - timeOffset);
    if (!paused && visible) rafId = requestAnimationFrame(loop);
  }

  function kick() {
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function frameOnce() {
    render((pausedAt || performance.now()) - timeOffset);
  }

  // --- Tamanho ---
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const amount = width < 600 ? 18 : 36;
    dust = Array.from({ length: amount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      speed: 0.00002 + Math.random() * 0.00004,
      phase: Math.random() * 6.28,
      alpha: 0.35 + Math.random() * 0.45,
    }));
    frameOnce();
  }

  // --- Pausa ---
  function setPaused(value) {
    paused = value;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.querySelector(".sheet-pause__label").textContent = paused ? "Retomar animação" : "Pausar animação";
    if (paused) {
      pausedAt = performance.now();
    } else {
      timeOffset += performance.now() - pausedAt;
      pausedAt = 0;
      kick();
    }
  }

  // --- Início ---
  function init() {
    loadColors();
    start = performance.now();
    resize();

    new ResizeObserver(resize).observe(canvas);

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !paused) kick();
    }).observe(figure);

    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden;
      if (visible && !paused) kick();
    });

    // O scroll abre a folha: progresso do hero saindo da tela
    const hero = figure.closest(".hero");
    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        scrollProgress = Math.min(1, Math.max(0, -rect.top / rect.height));
        if (paused || reduceMotion) frameOnce();
      },
      { passive: true }
    );

    if (reduceMotion) {
      // Sem movimento contínuo: um único quadro aberto, sem botão de pausa
      pauseBtn.hidden = true;
      frameOnce();
    } else {
      pauseBtn.addEventListener("click", () => setPaused(!paused));
      kick();
    }
  }

  // Contagens reais por área para os rótulos
  const ready = window.estudioIdeias && window.estudioIdeias.ready;
  if (ready) {
    ready
      .then(() => {
        const all = window.estudioIdeias.projects.paginate({ page: 1, perPage: 10000 });
        (all.results || []).forEach((p) => (counts[p.area] = (counts[p.area] || 0) + 1));
        if (paused || reduceMotion) frameOnce();
      })
      .catch(() => {});
  }

  // Desenha depois das fontes, para os rótulos em mono saírem certos
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
})();
