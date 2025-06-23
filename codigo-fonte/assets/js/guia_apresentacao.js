// assets/js/guia_apresentacao.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de Guia de Apresentação carregada.");

    // Lógica para o menu hamburger do header (reutilizada)
    const menuIconImage = document.getElementById('menuIconImg');
    const mainDropdown = document.getElementById('mainDropdownMenu');

    if (menuIconImage && mainDropdown) {
        menuIconImage.addEventListener('click', (event) => {
            event.stopPropagation();
            mainDropdown.classList.toggle('is-active');
        });

        // Fechar o menu se clicar fora dele
        document.addEventListener('click', (event) => {
            if (mainDropdown.classList.contains('is-active') && 
                menuIconImage.closest('.menu-icon') &&
                !menuIconImage.closest('.menu-icon').contains(event.target) && 
                !mainDropdown.contains(event.target)) {
                mainDropdown.classList.remove('is-active');
            }
        });
    } else {
        console.warn("Elementos do menu do header não encontrados na página de guia.");
    }
});
