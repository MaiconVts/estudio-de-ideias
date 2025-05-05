# Estúdio de Ideias

## Instruções de Utilização

### Estratégia de Organização de Codificação

Nesse primeiro eixo do curso, para simplificar a utilização do Git e a organização das pastas e artefatos de implementação no sistema de arquivos, sugerimos que o projeto seja estruturado de modo que cada aluno trabalhe com seus arquivos nas suas respectivas pastas, identificadas por nomes das suas respectivas telas. Por exemplo:

- Pasta `codigo-fonte/paginaHome`: `index.html`, `style.css`, `home.js`  
  **Desenvolvedor responsável:** Maicon Theodoro  
- Pasta `codigo-fonte/paginaProjetos`: `index.html`, `projetos.css`, `projetos.js`  
  **Desenvolvedor responsável:** Vinícius  
- Pasta `codigo-fonte/paginaFavoritos`: `index.html`, `favoritos.css`, `favoritos.js`  
  **Desenvolvedor responsável:** Vinícius  
- Pasta `codigo-fonte/paginaFerramentas`: `index.html`, `ferramentas.css`, `ferramentas.js`  
  **Desenvolvedor responsável:** Eduardo  
- Pasta `codigo-fonte/paginaSubmissao`: `index.html`, `submissao.css`, `submissao.js`  
  **Desenvolvedor responsável:** Allan  
- Pasta `codigo-fonte/paginaAdmin`: `index.html`, `admin.css`, `admin.js`  
  **Desenvolvedor responsável:** Allan  
- Pasta `codigo-fonte/paginaLogin`: `index.html`, `login.css`, `login.js`  
  **Desenvolvedor responsável:** Hugo  
- Pasta `codigo-fonte/paginaDetalhesProjetos`: `index.html`, `detalhes.css`, `detalhes.js`  
  **Desenvolvedor responsável:** Hugo  

Outras pastas auxiliares, como `assets/`, `data/`, `components/`, poderão ser adicionadas conforme a necessidade do grupo.

---

## Instalação do Site

O site em HTML/CSS/JS é um projeto estático, portanto pode ser utilizado diretamente em navegadores modernos ou publicado em serviços como GitHub Pages, Vercel, Netlify, entre outros.

**Acesse aqui a versão atual hospedada:** *https://icei-puc-minas-pmv-ads.github.io/pmv-ads-2025-1-e1-proj-web-t5-projestudiodeideias-1/codigo-fonte/paginaHome/index.html*

---

## Histórico de Versões

### [0.1.0] — 30/04/2025  
**Página Inicial (Home)**  
Desenvolvedor responsável: Maicon Theodoro  
- Estrutura HTML semântica e responsiva.  
- Barra de pesquisa funcional com filtros: campo, ordenação, ano e área.  
- Exibição simulada de projetos via arquivo JSON. *(Previsto para versões futuras.)*   
- Rodapé completo com seções: Institucional, Navegação, Recursos acadêmicos, Contato.  
- Favicon personalizado.  
- Estrutura modular de pastas implementada.  

---

### [0.1.1] — 02/05/2025  
**Página de Projetos**  
Desenvolvedor responsável: Vinícius  
- Cards responsivos com visualização resumida.  
- Filtros por tags (autor, área, ano).  
- Integração simulada com arquivo JSON (dados fictícios).  
- Estilo adaptado ao padrão visual da Home.  
- Compatibilidade com favoritos via `localStorage`.

**Página de Favoritos**  
Desenvolvedor responsável: Vinícius  
- Exibição de projetos marcados pelo usuário.  
- Função de desmarcar/remover favoritos.  
- Persistência em `localStorage`.  
- Navegação entre Home ↔ Favoritos otimizada.  

---

### [0.1.2] — 04/05/2025  
**Página de Recomendações de Ferramentas**  
Desenvolvedor responsável: Eduardo  
- Cards com links úteis, vídeos e tutoriais para criação de projetos.  
- Classificação por categoria (design, pesquisa, edição, publicação).  
- Estilo coerente com restante do sistema.  
- Navegação entre ferramentas e outros módulos integrada.  

---

### [0.1.3] — 04/05/2025  
**Página de Submissão de Projetos**  
Desenvolvedor responsável: Allan  
- Formulário completo com campos: título, resumo, autores, curso, ano, e upload de arquivo.  
- Validação de campos obrigatórios via JavaScript.  
- Estilo alinhado com componentes globais (header/footer).  
- Layout adaptável para mobile.  

**Painel do Administrador**  
Desenvolvedor responsável: Allan  
- Listagem de projetos pendentes.  
- Botões para Aprovar / Rejeitar com feedback visual.  
- Identificação de status de submissão.  
- Proteção de rota simulada (acesso condicionado).  

---

### [0.1.4] — 04/05/2025  
**Página de Login**  
Desenvolvedor responsável: Hugo  
- Estrutura HTML e CSS simplificada com foco na responsividade.  
- Validação de campos via JavaScript.  
- Estilização compatível com identidade visual do sistema.  
- Redirecionamento pós-login simulado para área do usuário.  

**Página de Detalhes do Projeto**  
Desenvolvedor responsável: Hugo  
- Exibição de informações completas sobre o projeto selecionado.  
- Simulação de anexo único para download do projeto (.pdf).  
- Dados renderizados com base em clique na listagem de projetos.  
- Estilo e organização visual conforme padrões de acessibilidade.
