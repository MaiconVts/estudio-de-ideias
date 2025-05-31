document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO BOTÃO 'VOLTAR AO TOPO' ---
    console.log("Configurando componentes globais do header...");
    
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // 1. Verifica se o botão 'Voltar ao Topo' existe na página atual
    if (scrollToTopBtn) {
        console.log("Botão 'Voltar ao Topo' (scrollToTopBtn) ENCONTRADO.");

        // Esconde o botão inicialmente
        scrollToTopBtn.style.display = 'none';

        // 2. Listener para o evento de rolagem da página
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;

            if (scrollPosition > 200) { // Mostra o botão se rolou mais de 200 pixels
                if (scrollToTopBtn.style.display !== 'flex') {
                    scrollToTopBtn.style.display = 'flex';
                }
            } else { // Esconde o botão se está perto do topo
                if (scrollToTopBtn.style.display !== 'none') {
                    scrollToTopBtn.style.display = 'none';
                }
            }
        });

        // 3. Listener para o evento de clique no botão
        scrollToTopBtn.addEventListener('click', () => {
            console.log("Botão 'Voltar ao Topo' foi clicado.");
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

    } else {
        // Se o botão não foi encontrado (isso é normal em algumas páginas)
        console.log("AVISO: Botão 'Voltar ao Topo' (scrollToTopBtn) não encontrado nesta página.");
    }


    // --- LÓGICA DO MENU DROPDOWN (HAMBÚRGUER) ---
    const menuIconImage = document.getElementById('menuIconImg');
    const mainDropdown = document.getElementById('mainDropdownMenu');

    // 1. Verifica se os elementos do menu existem na página
    if (menuIconImage && mainDropdown) {
        console.log("Componentes do menu dropdown ENCONTRADOS.");

        // 2. Listener para o clique no ícone do menu
        menuIconImage.addEventListener('click', (event) => {
            event.stopPropagation(); // Impede que o clique se propague e feche o menu
            mainDropdown.classList.toggle('is-active');
        });

        // 3. Listener para fechar o menu se o usuário clicar fora dele
        document.addEventListener('click', (event) => {
            const isMenuOpen = mainDropdown.classList.contains('is-active');
            const clickedOnIcon = menuIconImage.contains(event.target);
            const clickedInsideMenu = mainDropdown.contains(event.target);

            if (isMenuOpen && !clickedOnIcon && !clickedInsideMenu) {
                mainDropdown.classList.remove('is-active');
            }
        });
    } else {
        console.warn("AVISO: Ícone do menu (menuIconImg) ou menu dropdown (mainDropdownMenu) não encontrado.");
    }
});