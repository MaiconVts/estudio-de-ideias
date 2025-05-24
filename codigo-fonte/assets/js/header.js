document.addEventListener('DOMContentLoaded', () => {
  // ... (seus seletores e código existentes da home page) ...

  console.log("Tentando configurar o botão 'Voltar ao Topo'...");
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // 1. Verifica se o botão foi encontrado no HTML
  if (scrollToTopBtn) {
      console.log("Botão 'Voltar ao Topo' (scrollToTopBtn) ENCONTRADO no DOM.");

      // Inicialmente, o botão deve estar escondido pelo CSS (display: none)
      // O JavaScript o tornará visível conforme a rolagem.

      // 2. Listener para o evento de rolagem da página
      window.addEventListener('scroll', () => {
          const scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
          // console.log("Scroll position:", scrollPosition); // Descomente para ver a posição do scroll

          if (scrollPosition > 200) { // Se rolou mais de 200 pixels
              if (scrollToTopBtn.style.display !== 'flex') { // Mostra apenas se já não estiver visível
                  scrollToTopBtn.style.display = 'flex';
                  console.log("Botão 'Voltar ao Topo' DEVE APARECER.");
              }
          } else { // Se está perto do topo
              if (scrollToTopBtn.style.display !== 'none') { // Esconde apenas se já não estiver escondido
                  scrollToTopBtn.style.display = 'none';
                  console.log("Botão 'Voltar ao Topo' DEVE SUMIR.");
              }
          }
      });

      // 3. Listener para o evento de clique no botão
      scrollToTopBtn.addEventListener('click', () => {
          console.log("Botão 'Voltar ao Topo' CLICADO.");
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });

  } else {
      // Se o botão não foi encontrado
      console.error("ERRO: Elemento do botão 'Voltar ao Topo' com id='scrollToTopBtn' NÃO FOI ENCONTRADO no HTML.");
  }

  // ... (resto do seu código dentro do DOMContentLoaded para a home page) ...
});

// Dentro do seu DOMContentLoaded na paginaHome/assets/js/script.js
  const menuIconImage = document.getElementById('menuIconImg');
  const mainDropdown = document.getElementById('mainDropdownMenu');

  if (menuIconImage && mainDropdown) {
      menuIconImage.addEventListener('click', (event) => {
          event.stopPropagation(); // Impede que o clique no ícone feche o menu imediatamente (se houver listener no document)
          mainDropdown.classList.toggle('is-active');
          // Atualiza o aria-expanded do botão/imagem se você tiver um elemento <button> envolvendo a imagem
          // const isExpanded = mainDropdown.classList.contains('is-active');
          // menuIconImage.parentElement.setAttribute('aria-expanded', isExpanded); // Assumindo que a imagem está dentro de um botão
      });

      // Opcional: Fechar o menu se clicar fora dele
      document.addEventListener('click', (event) => {
          if (mainDropdown.classList.contains('is-active') && 
              !menuIconImage.contains(event.target) && // Se o clique não foi no ícone
              !mainDropdown.contains(event.target)) { // E nem dentro do menu
              mainDropdown.classList.remove('is-active');
              // menuIconImage.parentElement.setAttribute('aria-expanded', 'false'); // Atualiza aria
          }
      });
  } else {
      console.warn("Ícone do menu (menuIconImg) ou menu dropdown (mainDropdownMenu) não encontrado. Navegação mobile pode não funcionar.");
  }
  