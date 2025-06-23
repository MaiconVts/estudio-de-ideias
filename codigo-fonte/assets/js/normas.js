document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Menu do Header ---
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
            const menuIconContainer = menuIconImage.closest('.menu-icon');

            // Se o menu estiver aberto e o clique não foi no container do ícone
            if (isMenuOpen && menuIconContainer && !menuIconContainer.contains(event.target)) {
                mainDropdown.classList.remove('is-active');
            }
        });

    } else {
        // Se uma página não tiver os elementos do menu, um aviso pode ser útil para depuração.
        // console.warn("Aviso: Elementos do menu do header (menuIconImg ou mainDropdownMenu) não foram encontrados nesta página.");
    }

    // --- Lógica do Botão "Voltar ao Topo" ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        // Mostra ou esconde o botão baseado na posição da rolagem da página
        window.addEventListener('scroll', () => {
            // Mostra o botão se o usuário rolou mais de 200 pixels para baixo
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                // Usamos 'flex' porque o CSS o usa para centralizar a seta. Se não usasse, 'block' serviria.
                scrollToTopBtn.style.display = 'flex';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        // Adiciona a ação de clique para rolar suavemente para o topo da página
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Efeito de rolagem suave
            });
        });
    } else {
        // console.warn("Aviso: Botão 'Voltar ao Topo' (scrollToTopBtn) não encontrado nesta página.");
    }
});