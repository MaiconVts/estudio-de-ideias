// assets/js/formularios.js
// Validação acessível compartilhada: o erro aparece abaixo do campo, ligado a ele
// por aria-describedby, e a mensagem de envio fica num bloco aria-live.
(() => {
  const ICONES = {
    sucesso: '<path d="M20 6 9 17l-5-5"/>',
    erro: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  };

  function mensagem(campo) {
    const v = campo.validity;
    if (v.valueMissing) return campo.tagName === "SELECT" ? "Escolha uma opção." : "Preencha este campo.";
    if (v.typeMismatch && campo.type === "email") return "Use um e-mail válido, como nome@dominio.com.";
    if (v.typeMismatch && campo.type === "url") return "Use um endereço completo, começando com https://.";
    if (v.rangeUnderflow || v.rangeOverflow) return `Use um valor entre ${campo.min} e ${campo.max}.`;
    if (v.tooShort) return `Use pelo menos ${campo.minLength} caracteres.`;
    return campo.validationMessage;
  }

  function limpar(campo) {
    campo.removeAttribute("aria-invalid");
    const erro = document.getElementById(`${campo.id}-erro`);
    if (erro) erro.remove();
    const descricao = (campo.getAttribute("aria-describedby") || "")
      .split(" ")
      .filter((id) => id && id !== `${campo.id}-erro`)
      .join(" ");
    if (descricao) campo.setAttribute("aria-describedby", descricao);
    else campo.removeAttribute("aria-describedby");
  }

  function marcar(campo, texto) {
    limpar(campo);
    const erro = document.createElement("p");
    erro.className = "field__error";
    erro.id = `${campo.id}-erro`;
    erro.textContent = texto;
    campo.insertAdjacentElement("afterend", erro);
    campo.setAttribute("aria-invalid", "true");
    const descricao = [campo.getAttribute("aria-describedby"), erro.id].filter(Boolean).join(" ");
    campo.setAttribute("aria-describedby", descricao);
  }

  // Valida o formulário; devolve true se tudo passou e foca o primeiro erro
  function validar(form) {
    let primeiro = null;
    form.querySelectorAll("input, select, textarea").forEach((campo) => {
      if (!campo.id || campo.type === "hidden") return;
      if (campo.value && typeof campo.value === "string" && campo.tagName !== "SELECT") {
        campo.value = campo.type === "password" ? campo.value : campo.value.trim();
      }
      if (campo.checkValidity()) return limpar(campo);
      marcar(campo, mensagem(campo));
      primeiro = primeiro || campo;
    });
    if (primeiro) primeiro.focus();
    return !primeiro;
  }

  // Liga a correção ao vivo: ao editar um campo marcado, o erro some quando ele fica válido
  function acompanhar(form) {
    form.noValidate = true;
    form.addEventListener("input", (event) => {
      const campo = event.target;
      if (campo.getAttribute("aria-invalid") === "true" && campo.checkValidity()) limpar(campo);
    });
    form.addEventListener("reset", () => {
      form.querySelectorAll("[aria-invalid]").forEach(limpar);
    });
  }

  function status(alvo, tipo, texto) {
    if (!alvo) return;
    if (!texto) {
      alvo.replaceChildren();
      alvo.removeAttribute("data-tipo");
      return;
    }
    alvo.dataset.tipo = tipo;
    alvo.innerHTML = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONES[tipo] || ""}</svg><span></span>`;
    alvo.querySelector("span").textContent = texto;
  }

  window.estudioIdeiasForms = { validar, acompanhar, status, limpar, marcar };
})();
