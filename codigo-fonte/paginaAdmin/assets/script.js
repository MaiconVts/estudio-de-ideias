// Exemplo de como o JS do menu deve funcionar
document.addEventListener('DOMContentLoaded', () => {
    const menuIconImage = document.getElementById('menuIconImg');
    const mainDropdown = document.getElementById('mainDropdownMenu');

    if (menuIconImage && mainDropdown) {
        menuIconImage.addEventListener('click', (event) => {
            event.stopPropagation();
            mainDropdown.classList.toggle('is-active');
        });

        document.addEventListener('click', (event) => {
            if (mainDropdown.classList.contains('is-active') && 
                !menuIconImage.closest('.menu-icon').contains(event.target) && // Checa se o clique foi fora do container do ícone
                !mainDropdown.contains(event.target)) {
                mainDropdown.classList.remove('is-active');
            }
        });
    } else {
        // Isso apareceria no console se os elementos não fossem encontrados
        // console.warn("Ícone do menu ou menu dropdown não encontrado na página do admin panel.");
    }
});