# Estúdio de Ideias

## Instruções de utilização

### Estratégia de Organização de Codificação

Nesse primeiro eixo do curso, para simplificar a utilização do Git e a organização das pastas e artefatos de implementação no sistema de arquivos, sugerimos que o projeto seja estruturado de modo que cada aluno trabalhe com seus arquivos nas suas respectivas pastas, identificadas por nomes das suas respectivas telas. Por exemplo:

- **Pasta src/home**: `index.html`, `style.css`, `main.js` — Desenvolvedora responsável: **Maicon Theodoro**
- **Pasta src/projetos**: `projeto.html`, `projeto.css`, `projeto.js` — Desenvolvedor responsável: _(a definir)_
- **Pasta src/autenticacao**: `login.html`, `cadastro.html`, `auth.css`, `auth.js` — Desenvolvedor responsável: _(a definir)_
- **Pasta src/publicar**: `formulario.html`, `formulario.css`, `formulario.js` — Desenvolvedor responsável: _(a definir)_

Outras pastas auxiliares, como `assets/`, `data/`, `components/`, poderão ser adicionadas conforme a necessidade do grupo.

---

## Instalação do Site

O site em HTML/CSS/JS é um projeto estático, portanto pode ser utilizado diretamente em navegadores modernos, ou publicado em serviços como GitHub Pages, Vercel, Netlify, entre outros.

> **Acesse aqui** a versão atual hospedada: _(link será adicionado após publicação)_

---

## Histórico de versões

### [0.1.0] — 30/04/2025

**Página Inicial (Home)**

- Estrutura HTML semântica e responsiva.
- Barra de pesquisa funcional com filtros: campo, ordenação, ano e área.
- Exibição simulada de projetos via arquivo JSON. *(Previsto para versões futuras.)*
- Estilização com gradiente institucional: `#F0F4FF → #D6E4FF → #185ADB`.
- Rodapé completo com seções:
  - Institucional
  - Navegação
  - Recursos acadêmicos
  - Contato
- Favicon personalizado.
- Estrutura modular de pastas implementada.

---

### [0.1.1] — 02/05/2025

**Página de Projetos**

- Cards responsivos com visualização resumida.
- Filtros por tags (autor, área, ano).
- Integração simulada com arquivo JSON (dados fictícios).
- Estilo adaptado ao padrão visual da Home.
- Compatibilidade com favoritos via `localStorage`.

**Página de Favoritos**

- Exibição de projetos marcados pelo usuário.
- Função de desmarcar/remover favoritos.
- Persistência em `localStorage`.
- Navegação entre Home ↔ Favoritos otimizada.

---

### [0.1.2] — 04/05/2025

**Página de Submissão de Projetos**

- Formulário completo com campos: título, resumo, autores, curso, ano, e upload de arquivo.
- Validação de campos obrigatórios via JavaScript.
- Estilo alinhado com componentes globais (header/footer).
- Layout adaptável para mobile.

**Painel do Administrador**

- Listagem de projetos pendentes.
- Botões para Aprovar / Rejeitar com feedback visual.
- Identificação de status de submissão.
- Proteção de rota simulada (acesso condicionado).

---

### [0.1.3] — 04/05/2025

**Página de Recomendações de Ferramentas**

- Cards com links úteis, vídeos e tutoriais para criação de projetos.
- Classificação por categoria (design, pesquisa, edição, publicação).
- Estilo coerente com restante do sistema.
- Navegação entre ferramentas e outros módulos integrada.
