// assets/js/pdf-viewer.js
// Visualizador de PDF com pdf.js (canvas), para funcionar também no Chrome do Android,
// que não exibe PDF em <iframe>. A biblioteca só é baixada quando o visualizador
// chega perto da tela.
// Uso: window.pdfViewer.mount(elementoRaiz, "assets/docs/<id>.pdf")

(function () {
  const PDFJS_VERSION = "3.11.174";
  const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

  let libPromise = null;

  function loadLib() {
    if (libPromise) return libPromise;
    libPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${PDFJS_BASE}/pdf.min.js`;
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
        resolve(window.pdfjsLib);
      };
      script.onerror = () => {
        libPromise = null;
        reject(new Error("Não foi possível carregar o pdf.js"));
      };
      document.head.appendChild(script);
    });
    return libPromise;
  }

  function mount(root, url) {
    const canvas = root.querySelector(".pdf-viewer__canvas");
    const status = root.querySelector(".pdf-viewer__status");
    const prev = root.querySelector('[data-pdf="prev"]');
    const next = root.querySelector('[data-pdf="next"]');
    const current = root.querySelector('[data-pdf="current"]');
    const total = root.querySelector('[data-pdf="total"]');
    root.querySelector('[data-pdf="open"]').href = url;

    let doc = null;
    let pageNumber = 1;
    let renderTask = null;

    async function render() {
      const page = await doc.getPage(pageNumber);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement.clientWidth;
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: (width / base.width) * dpr });

      if (renderTask) renderTask.cancel();
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      renderTask = page.render({ canvasContext: canvas.getContext("2d"), viewport });
      try {
        await renderTask.promise;
      } catch (error) {
        if (error && error.name === "RenderingCancelledException") return;
        throw error;
      }
      canvas.setAttribute("aria-label", `Página ${pageNumber} de ${doc.numPages} do documento do projeto`);
      current.textContent = pageNumber;
      prev.disabled = pageNumber <= 1;
      next.disabled = pageNumber >= doc.numPages;
    }

    function go(delta) {
      const target = pageNumber + delta;
      if (!doc || target < 1 || target > doc.numPages) return;
      pageNumber = target;
      render();
    }

    async function start() {
      try {
        const pdfjsLib = await loadLib();
        doc = await pdfjsLib.getDocument(url).promise;
        total.textContent = doc.numPages;
        await render();
        root.classList.add("is-ready");
        status.textContent = "";
      } catch (error) {
        console.error("pdf-viewer:", error);
        root.classList.add("is-error");
        status.innerHTML = `Não foi possível exibir o documento aqui. <a href="${url}" target="_blank" rel="noopener">Abra o PDF em nova aba</a>.`;
      }
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      if (!doc) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 200);
    });

    // Só baixa o pdf.js quando o visualizador estiver a caminho da tela
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            start();
          }
        },
        { rootMargin: "300px" }
      );
      observer.observe(root);
    } else {
      start();
    }
  }

  window.pdfViewer = { mount };
})();
