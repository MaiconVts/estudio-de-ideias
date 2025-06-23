// assets/js/faq.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de FAQ carregada.");

    // --- Lógica do Menu do Header (Reutilizada) ---
    const menuIconImage = document.getElementById('menuIconImg');
    const mainDropdown = document.getElementById('mainDropdownMenu');

    if (menuIconImage && mainDropdown) {
        menuIconImage.addEventListener('click', (event) => {
            event.stopPropagation();
            mainDropdown.classList.toggle('is-active');
        });

        document.addEventListener('click', (event) => {
            if (mainDropdown.classList.contains('is-active') && 
                menuIconImage.closest('.menu-icon') &&
                !menuIconImage.closest('.menu-icon').contains(event.target) && 
                !mainDropdown.contains(event.target)) {
                mainDropdown.classList.remove('is-active');
            }
        });
    } else {
        console.warn("Elementos do menu do header não encontrados na página de FAQ.");
    }

    // --- Lógica do Accordion de FAQ ---
    // Faz com que apenas uma pergunta possa ser aberta por vez
    const allDetails = document.querySelectorAll('.faq-item');

    allDetails.forEach(details => {
        details.addEventListener('toggle', (event) => {
            // Se um item está sendo aberto...
            if (event.target.open) {
                // ...fecha todos os outros
                allDetails.forEach(otherDetails => {
                    if (otherDetails !== event.target) {
                        otherDetails.open = false;
                    }
                });
            }
        });
    });
});
