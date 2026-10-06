# Estúdio de Ideias: código-fonte

Esta pasta é o site publicado. Ele é estático (HTML, CSS e JavaScript puro, sem build) e vai para o GitHub Pages a cada push na `main`, pelo workflow [`deploy.yml`](../.github/workflows/deploy.yml).

**Site no ar:** <https://maiconvts.github.io/estudio-de-ideias/>

## Como rodar

Os dados são carregados com `fetch`, então é preciso um servidor local:

```bash
python -m http.server 8000 --directory codigo-fonte
```

Depois abra <http://localhost:8000>.

**Conta demo (moderador):** `demo@estudiodeideias.app` / `demo1234`, ou o botão *Entrar com a conta demo* na página Entrar.

## Organização

| Caminho | Conteúdo |
| :--- | :--- |
| `*.html` | Uma página por arquivo, na raiz desta pasta. |
| `assets/css/base.css` | Tokens de cor, tipografia, espaçamento, forma e movimento. Nenhum componente usa valor fixo. |
| `assets/css/layout.css` | Header, footer e elementos comuns a todas as páginas. |
| `assets/css/<página>.css` | Estilos próprios de cada página. |
| `assets/js/projetos.js` | Núcleo de dados: carrega `projects.json` e expõe `window.estudioIdeias` (busca, filtros, paginação e favoritos). |
| `assets/js/layout.js` | Monta header, footer e o botão "voltar ao topo"; troca "Entrar" por "Minha conta" quando há sessão. |
| `assets/js/conta.js` | Contas no navegador (`window.estudioConta`): SHA-256 com sal, sessão de 7 dias, papéis autor e moderador, conta demo. |
| `assets/js/formularios.js` | Validação compartilhada dos formulários, com erro ligado ao campo e mensagem de status. |
| `assets/js/motion-base.js` | Reveals, título dividido e entrada do cabeçalho de página, comuns às páginas internas. |
| `assets/js/miura.js`, `home-motion.js` | Folha em dobra Miura e coreografia de entrada e scroll da página inicial. |
| `assets/js/pdf-viewer.js`, `openalex.js` | Leitor de PDF (pdf.js) e leituras relacionadas do OpenAlex na página de detalhes. |
| `assets/vendor/`, `assets/fonts/` | GSAP, SplitText, Lenis e as fontes servidos localmente, sem terceiros no primeiro paint. |
| `robots.txt`, `sitemap.xml` | Indexação: o sitemap lista as páginas públicas e os 125 projetos. |
| `assets/data/` | `projects.json` (125 projetos) e `referencias.json` (snapshot do OpenAlex). |
| `assets/docs/` | Um PDF por projeto, gerado por [`scripts/gerar_documentos.py`](../scripts/gerar_documentos.py). |

Na versão de 2025, cada integrante cuidava das próprias telas; a divisão está registrada no histórico abaixo.

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

---

### [0.2.0] — 05/10/2026  
**Redesign e reorganização**  
Desenvolvedor responsável: Maicon Theodoro  
- Nova identidade visual a partir da dobra Miura: folha dobrada em canvas na página inicial, paleta de papel e tipografia Chakra Petch, Geologica e Martian Mono.  
- Tokens de design centralizados em `base.css`; header e footer únicos em `layout.css` e `layout.js`.  
- Movimento com GSAP (ScrollTrigger, SplitText) e Lenis, com suporte a `prefers-reduced-motion` e botão de pausa.  
- Leitor de PDF com pdf.js e leituras relacionadas vindas do OpenAlex, com cache e snapshot de reserva.  
- Remoção de scripts e estilos duplicados; README, links de documentação e apresentação corrigidos.

---

### [0.3.0] — 05/10/2026  
**Front-end no limite do back-end**  
Desenvolvedor responsável: Maicon Theodoro  
- Contas com senha em SHA-256 com sal por usuário (no lugar do texto puro), sessão com validade e papéis de autor e moderador; contas antigas são convertidas na primeira visita.  
- Conta demo de moderador e botão "Entrar com a conta demo"; painel de moderação bloqueado para quem não é moderador, com botão Sair.  
- Confirmação de aprovar e rejeitar em `<dialog>` acessível, no lugar do `confirm()` do navegador.  
- Placeholders removidos: redes sociais e login social saíram; "Esqueceu sua senha?" explica que depende do servidor; vagas levam ao contato com o assunto preenchido.  
- Últimos valores fixos levados para tokens; logs de depuração removidos.  
- `REDESIGN.md` na raiz com o antes e depois das telas principais.
