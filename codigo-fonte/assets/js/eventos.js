// assets/js/eventos.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de Eventos carregada.");

    // Lógica para o menu hamburger do header (reutilizada)
    const menuIconImage = document.getElementById('menuIconImg');
    const mainDropdown = document.getElementById('mainDropdownMenu');

    if (menuIconImage && mainDropdown) {
        menuIconImage.addEventListener('click', (event) => {
            // Impede que o clique no ícone também seja detectado pelo listener no 'document',
            // o que fecharia o menu imediatamente.
            event.stopPropagation();
            mainDropdown.classList.toggle('is-active');
        });

        // Adiciona um listener global para fechar o menu se o usuário clicar fora dele
        document.addEventListener('click', (event) => {
            const isMenuOpen = mainDropdown.classList.contains('is-active');
            // Checa se o menu está aberto e se o clique foi fora do container do ícone
            const menuIconContainer = menuIconImage.closest('.menu-icon');

            if (isMenuOpen && menuIconContainer && !menuIconContainer.contains(event.target)) {
                mainDropdown.classList.remove('is-active');
            }
        });

    } else {
        // Se uma página não tiver os elementos do menu, um aviso pode ser útil para depuração.
        console.warn("Aviso: Elementos do menu do header (menuIconImg ou mainDropdownMenu) não foram encontrados nesta página.");
    }

    // Lógica para o botão "Voltar ao Topo" (reutilizada)
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
