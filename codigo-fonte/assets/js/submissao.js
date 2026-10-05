// assets/js/submissao.js
// Envio de projeto para a fila de moderação. Validação e mensagens vêm de formularios.js.
(async () => {
  const form = document.getElementById("submission-form");
  const statusEl = document.getElementById("submission-status");
  const forms = window.estudioIdeiasForms;
  if (!form || !forms) return;
  forms.acompanhar(form);

  const anoCampo = document.getElementById("year");
  const anoAtual = new Date().getFullYear();
  anoCampo.max = String(anoAtual);
  anoCampo.placeholder = `Ex: ${anoAtual}`;

  // Com sessão aberta, o autor começa com o nome da conta
  const sessao = window.estudioConta?.sessao();
  const autorCampo = document.getElementById("author");
  if (sessao && !autorCampo.value) autorCampo.value = sessao.nome;

  await window.estudioIdeias?.ready;
  const addProject = window.estudioIdeias?.projects?.add;
  if (!addProject) {
    forms.status(statusEl, "erro", "Não foi possível carregar o envio de projetos. Recarregue a página e tente de novo.");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    forms.status(statusEl);
    if (!forms.validar(form)) return;

    const formData = new FormData(form);
    const payload = {
      title: formData.get("title").trim(),
      author: formData.get("author").trim(),
      year: parseInt(formData.get("year"), 10),
      area: formData.get("area"),
      technologies: formData.get("technologies").split(",").map((tech) => tech.trim()).filter(Boolean),
      summary: formData.get("summary").trim(),
      file: formData.get("file").trim(),
    };

    if (!payload.technologies.length) {
      forms.marcar(document.getElementById("technologies"), "Informe ao menos uma tecnologia.");
      document.getElementById("technologies").focus();
      return;
    }

    try {
      addProject(payload);
      form.reset();
      forms.status(statusEl, "sucesso", "Seu projeto foi enviado para moderação. Ele aparecerá na plataforma depois de aprovado.");
    } catch (error) {
      console.error("Erro ao salvar o projeto:", error);
      forms.status(statusEl, "erro", "Ocorreu um erro ao enviar seu projeto. Tente novamente.");
    }
  });
})();
