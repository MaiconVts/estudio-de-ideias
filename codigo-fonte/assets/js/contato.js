// assets/js/contato.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Formulário de Contato ---
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio real do formulário

            // Simulação de envio
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            console.log("Dados do formulário:", data);

            // Exibe mensagem de sucesso
            formFeedback.textContent = 'Mensagem enviada com sucesso! Agradecemos o seu contato.';
            formFeedback.className = 'form-feedback success'; // Adiciona a classe de sucesso
            formFeedback.style.display = 'block';

            // Limpa o formulário após o "envio"
            this.reset();

            // Esconde a mensagem de sucesso após alguns segundos
            setTimeout(() => {
                formFeedback.style.display = 'none';
                formFeedback.className = 'form-feedback'; // Reseta as classes
            }, 5000); // 5 segundos
        });
    }

    // A lógica para o menu do header e o botão "Voltar ao Topo"
    // deve vir do seu script compartilhado `header.js`, que já está
    // linkado no HTML desta página.
});
