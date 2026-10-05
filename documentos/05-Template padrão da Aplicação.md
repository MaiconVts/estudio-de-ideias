# Template Padrão da Aplicação

O site **Estúdio de Ideias** é feito em **HTML**, **CSS** e **JavaScript**, sem framework e sem etapa de build. Em 2026 a interface passou por um redesign completo (antes e depois em [REDESIGN.md](../REDESIGN.md)). Este documento descreve o template atual; os valores exatos estão nos tokens de `codigo-fonte/assets/css/base.css`.

Todas as páginas compartilham:

- **Cabeçalho**, com marca, navegação principal, o botão “Entrar” (que vira “Minha conta” com sessão aberta) e menu móvel acessível (`layout.css`, `layout.js`)
- **Conteúdo**, aberto por um hero com a assinatura visual (`mundo.css`)
- **Rodapé**, o “verso escuro da folha”, com os links institucionais (`layout.css`)
- **Tokens** de cor, tipografia, espaçamento, raio, sombra, duração e curva (`base.css`)
- **Motion** numa só linguagem: Lenis no scroll suave e GSAP nos reveals (`motion-base.js`)

### Identidade Visual

O conceito é **“a folha Miura que se desdobra”**: o acervo é uma folha de papel fosco vincada no padrão Miura-ori, e tudo segue a mesma geometria de 60°. Isso inclui controles em paralelogramo, cantos de cartão cortados, divisores diagonais e a malha de vincos ao fundo.

- **Cores principais (tokens de `base.css`):**

| Token | Cor | Papel |
| :--- | :--- | :--- |
| `--sheet` | `#f7f7f5` | Fundo da página (folha fosca) |
| `--sheet-white` | `#ffffff` | Superfícies: cartões, campos, teclas |
| `--ink` | `#0b0b0c` | Títulos, botão secundário, rodapé |
| `--ink-soft` | `#2a2b30` | Texto corrido |
| `--valley-deep` | `#2e4f86` | Cor de interação: foco, hover, links |
| `--valley` | `#cfe0f2` | Seleção, item de menu atual |
| `--mountain-line` | `#d3d0c8` | Fios de 1 px, bordas e divisores |
| `--foil` | `#d4af37` | Foil dourado, só na ação que conta (buscar, publicar) |

- **Fontes utilizadas** (hospedadas no próprio site, em `assets/fonts/`):
  - `Chakra Petch`: títulos e display, com cantos chanfrados como os da folha
  - `Geologica`: texto corrido
  - `Martian Mono`: rótulos, códigos e leituras técnicas, com números tabulares

- **Escala tipográfica** (tokens `--text-*`): de `0.6875rem` a `1.75rem`, mais `--text-3xl` e `--text-display` fluidos (`clamp`), que no hero chegam a `4.6rem`.

- **Assinatura visual:** hero com malha de vincos em SVG, a folha Miura desenhada em canvas, poeira dourada, brilho do foil, vidro fosco e parallax. Há motion na entrada, no scroll e no hover, e o movimento contínuo tem botão de pausa. Com `prefers-reduced-motion`, ficam só fades curtos.

- **Acessibilidade:** contraste AA (inclusive sobre os efeitos), foco visível em `valley-deep`, um `h1` por página e navegação completa por teclado.

---

## Telas do Sistema

### Tela Inicial (Home)

Hero com a folha Miura e o “pacote de busca” em vidro fosco, que se desdobra nos filtros, seguido dos destaques do acervo.

<figure>
  <img src="./img/redesign/depois/home-desktop.jpg" alt="Tela Home">
</figure>

---

### Tela de Exibição de Projetos

Acervo com busca, filtros por ano e área, ordenação e paginação. Cada cartão mostra o código de chamada, a sigla da área, o autor e o ano.

<figure>
  <img src="./img/redesign/depois/projetos-desktop.jpg" alt="Tela de Projetos">
</figure>

---

### Tela de Detalhes de Projetos

Ficha completa do projeto, com visualizador de PDF, download do documento e leituras relacionadas vindas do OpenAlex.

<figure>
  <img src="./img/redesign/depois/detalhes-desktop.jpg" alt="Tela de Detalhes">
</figure>

---

### Tela de Favoritos

Exibe os projetos salvos pelo usuário como favoritos, guardados no próprio navegador.

<figure>
  <img src="./img/redesign/depois/favoritos-desktop.jpg" alt="Tela de Favoritos">
</figure>

---

### Tela de Recomendações de Ferramentas

Ferramentas e tutoriais com filtro por categoria (ABNT, responsividade e outras), para apoiar o desenvolvimento dos projetos acadêmicos.

<figure>
  <img src="./img/redesign/depois/ferramentas-desktop.jpg" alt="Tela de Ferramentas">
</figure>

---

### Tela de Login e Cadastro

Entrada, criação de conta e o atalho para a conta demo na mesma página. Com sessão aberta, mostra quem está conectado.

<figure>
  <img src="./img/redesign/depois/login-desktop.jpg" alt="Tela de Login e Cadastro">
</figure>

---

### Área do Moderador

Fila de moderação restrita ao papel de moderador, com placas de contagem e confirmação antes de aprovar, rejeitar ou pedir correção.

<figure>
  <img src="./img/redesign/depois/admin-desktop.jpg" alt="Área do Moderador">
</figure>

---

### Tela de Submissão (Envio de Projetos)

Formulário de envio com validação ligada a cada campo. O projeto vai para a fila de moderação.

<figure>
  <img src="./img/redesign/depois/submissao-desktop.jpg" alt="Tela de Submissão">
</figure>

---

## Logotipo

A marca atual (`assets/img/marca.svg`) é a própria folha dobrada: três painéis em paralelogramo, nas cores da tinta, do foil e do vale. Ela serve de ícone do site e acompanha o nome no cabeçalho.

<figure>
  <img src="../codigo-fonte/assets/img/marca.svg" alt="Marca do Estúdio de Ideias" width="96">
</figure>

O logotipo da primeira versão (2025), que combinava uma lâmpada com um capelo acadêmico em tons de azul, continua registrado abaixo.

<figure>
  <img src="./img/logo.png" alt="Logotipo original (2025)">
</figure>
