// assets/js/contato.js
// Envio simulado da mensagem de contato: sem servidor, nada sai do navegador.
// ?assunto= preenche o assunto (vagas de carreiras.html). Validação e mensagens vêm de formularios.js.
(() => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("form-feedback");
  const forms = window.estudioIdeiasForms;
  if (!form || !forms) return;
  forms.acompanhar(form);

  const assunto = new URLSearchParams(location.search).get("assunto");
  if (assunto) document.getElementById("subject").value = assunto.slice(0, 120);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    forms.status(feedback);
    if (!forms.validar(form)) return;

    form.reset();
    forms.status(feedback, "sucesso", "Mensagem registrada. Agradecemos o seu contato! Nesta versão, sem servidor, o envio é simulado.");
  });
})();
