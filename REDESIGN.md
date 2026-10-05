# Estúdio de Ideias: redesign

O Estúdio de Ideias é um acervo de projetos de estudantes de Análise e Desenvolvimento de Sistemas da PUC Minas, construído em 2025 por cinco alunos e redesenhado em 2026 por Maicon Theodoro. O redesign trocou um site genérico, inconsistente e com partes quebradas por um sistema visual próprio, acessível e verificado por testes automáticos, mantendo lógica, rotas e textos.

Site publicado: https://maiconvts.github.io/estudio-de-ideias

## Em números

| Item | Valor |
| :--- | :--- |
| Páginas redesenhadas | 16 |
| Dependências de interface removidas | Bootstrap e Font Awesome |
| Tokens de design | centralizados em `base.css` |
| Verificações automáticas | 290, em 375, 768 e 1440 px |
| Lighthouse (Home) | desempenho 97; acessibilidade, boas práticas e SEO 100 |
| LCP (Home) | cerca de 2,35 s |
| CLS (Home) | 0 |
| URLs no sitemap | 137 |

## Direção

**Antes.** Bootstrap e Font Awesome com Montserrat e Roboto, cabeçalho e rodapé duplicados em cada página, cores fixas espalhadas, `alert()` e `confirm()`, paginação falsa, `href="#"` em redes sociais e em "esqueceu a senha", login social falso, senha em texto puro no localStorage e `console.log` de depuração.

**Conceito.** O Miura-ori, a dobra de papel em que uma folha plana se recolhe em um pacote e se abre de novo. Na Home, a folha é dobrada em canvas 2D pelas equações da dobra, abre no carregamento e acompanha o scroll. Cada área do acervo é uma região da folha; o destaque é uma célula dourada. Nas páginas internas, o cabeçalho traz grade de vincos, brilho e vidro fosco, mais uma placa de leitura em mono (por exemplo, PENDENTES 01).

**Paleta.** Folha clara, linhas de montanha e vale, tinta quase preta e um acento dourado "foil".

**Tipografia.** Chakra Petch nos títulos, Geologica no texto, Martian Mono em códigos e leituras.

**Motion.** GSAP (ScrollTrigger, SplitText) com Lenis: reveals coreografados, parallax, botão de pausa e respeito a `prefers-reduced-motion`.

## Sistema

- **Tokens:** cor, tipografia, espaço, forma e motion em `base.css`; nenhum componente usa valor fixo.
- **Componentes compartilhados:** cabeçalho e rodapé únicos (`layout.css`, `layout.js`), com o crédito "Desenvolvido por maicontheodoro-dev" no rodapé; botões em paralelogramo (`btn-ink` preto, `btn-foil` dourado); ícones SVG no estilo Lucide.
- **Motion:** uma linguagem só, com as mesmas curvas e durações em todas as páginas; fontes e bibliotecas locais.
- **Acessibilidade e SEO:** um h1 por página, landmarks semânticos, foco visível, link de salto, contraste AA sobre os efeitos, `inert` em menus fechados, validação com erro ligado ao campo, meta description, Open Graph, canonical, JSON-LD, `robots.txt` e sitemap; `noindex` em favoritos, login e admin.

## Páginas

### Home

Arquivo: `codigo-fonte/index.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/home-desktop.jpg" width="100%" alt="Desktop: a Home antiga com foto de lago alpino, busca e quatro selects"> | <img src="documentos/img/redesign/depois/home-desktop.jpg" width="100%" alt="Desktop: a Home nova com a folha Miura dobrada, etiquetas de área e placa de leitura"> |
| <img src="documentos/img/redesign/antes/home-mobile.jpg" width="60%" alt="Mobile: a Home antiga com foto de lago alpino, busca e quatro selects"> | <img src="documentos/img/redesign/depois/home-mobile.jpg" width="60%" alt="Mobile: a Home nova com a folha Miura dobrada, etiquetas de área e placa de leitura"> |

- `<title>`: "Estúdio de Ideias" → "Estúdio de Ideias · Projetos de ADS da PUC Minas"
- h1: ESTÚDIO DE IDEIAS (texto do logo) → Seu projeto não fica dobrado na gaveta.
- Hierarquia: a foto de banco de imagens e os quatro selects deram lugar a um h1 com promessa clara, busca com botão dourado "Buscar" e filtros extras sob "Mais filtros".
- Identidade: a folha Miura é dobrada em canvas 2D pelas equações da dobra, abre no carregamento e acompanha o scroll. Cada área do acervo é uma região da folha, com a célula dourada como destaque.
- Dados à mostra: a placa de leitura mostra Acervo 125, Áreas 06, Anos 2000-2025 e Dobra θ 42°; as abas filtram por área com contagem (FE 24, BE 23 e assim por diante).
- Cards: os oito cartões idênticos viraram cartões com código (EI-xxxx), etiqueta de área, autor, ano, citações e tecnologias; "Ver mais" virou "Desdobrar mais projetos".
- Motion: reveals coreografados, parallax em camadas e botão de pausa sobre a animação contínua; com `prefers-reduced-motion` ficam só fades curtos.
- Mobile: a primeira tela deixa de ser ocupada por quatro selects empilhados.

### Projetos

Arquivo: `codigo-fonte/projetos.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/projetos-desktop.jpg" width="100%" alt="Desktop: a lista antiga de projetos em uma coluna com barra lateral de filtros"> | <img src="documentos/img/redesign/depois/projetos-desktop.jpg" width="100%" alt="Desktop: a lista nova de projetos com cabeçalho, painel de filtros e cartões em duas colunas"> |
| <img src="documentos/img/redesign/antes/projetos-mobile.jpg" width="60%" alt="Mobile: a lista antiga de projetos em uma coluna com barra lateral de filtros"> | <img src="documentos/img/redesign/depois/projetos-mobile.jpg" width="60%" alt="Mobile: a lista nova de projetos com cabeçalho, painel de filtros e cartões em duas colunas"> |

- `<title>`: "Estúdio de Ideias" → "Projetos · Estúdio de Ideias"
- h1: Estúdio de Ideias (logo) → Projetos
- Cabeçalho de página com placa de leitura: Resultados 125, Página 1/7, Por página 20.
- Os 20 cartões em coluna única viraram grade de duas colunas com código, área e metadados.
- O contador de resultados reflete os filtros ativos; a paginação indica a página atual.
- Mobile: o cabeçalho vem primeiro e o filtro fica abaixo, em vez de ocupar toda a primeira tela.
- Os estilos de favoritos foram unificados com os de projetos.

### Detalhes

Arquivo: `codigo-fonte/detalhes.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/detalhes-desktop.jpg" width="100%" alt="Desktop: a página antiga de detalhes com cartão branco e campos "Não especificado""> | <img src="documentos/img/redesign/depois/detalhes-desktop.jpg" width="100%" alt="Desktop: a página nova de detalhes com leitor de PDF embutido e leituras relacionadas"> |
| <img src="documentos/img/redesign/antes/detalhes-mobile.jpg" width="60%" alt="Mobile: a página antiga de detalhes com cartão branco e campos "Não especificado""> | <img src="documentos/img/redesign/depois/detalhes-mobile.jpg" width="60%" alt="Mobile: a página nova de detalhes com leitor de PDF embutido e leituras relacionadas"> |

- `<title>`: "Detalhes do Projeto - Estúdio de Ideias" → "Detalhes do projeto · Estúdio de Ideias"
- h1: (sem h1) → título do projeto (dinâmico)
- Hierarquia: breadcrumb, área, h1 com o título do projeto, autor e ações "Baixar PDF" e "Favoritado"; placa com Código EI-266E, Ano 2023 e Citações 45.
- Leitor de PDF embutido com pdf.js, carregado sob demanda e funcional no Chrome Android, com "Abrir em nova aba".
- "Ficha técnica" em painel lateral; os campos "Não especificado" deixaram de aparecer.
- "Leituras relacionadas" traz referências reais da OpenAlex, com cache de 24 h e snapshot local, e etiqueta "Acesso aberto".
- Os PDFs são gerados por script, no lugar do download de um zip.
- Mobile: o overflow que cortava o título no layout antigo foi eliminado.

### Submissão

Arquivo: `codigo-fonte/submissao.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/submissao-desktop.jpg" width="100%" alt="Desktop: o formulário antigo de submissão em cartão branco centralizado"> | <img src="documentos/img/redesign/depois/submissao-desktop.jpg" width="100%" alt="Desktop: o formulário novo de submissão com painel "Como funciona""> |
| <img src="documentos/img/redesign/antes/submissao-mobile.jpg" width="60%" alt="Mobile: o formulário antigo de submissão em cartão branco centralizado"> | <img src="documentos/img/redesign/depois/submissao-mobile.jpg" width="60%" alt="Mobile: o formulário novo de submissão com painel "Como funciona""> |

- `<title>`: "Submissão de Projeto - Estúdio de Ideias" → "Publicar projeto · Estúdio de Ideias"
- h1: (logo) → Submeter novo projeto
- Placa de leitura: Campos 07, Etapa Moderação, Formato Link.
- Rótulos em mono com asterisco nos obrigatórios; ano e área lado a lado; ajuda "Separadas por vírgula" nas tags.
- Com sessão ativa, o autor vem preenchido ("Conta Demo").
- Painel "Como funciona" em três etapas: Envio, Moderação, Acervo.
- Botão paralelogramo preto "Enviar para moderação"; validação com erro ligado ao campo, sem `alert()`.

### Favoritos

Arquivo: `codigo-fonte/favoritos.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/favoritos-desktop.jpg" width="100%" alt="Desktop: a lista antiga de favoritos em cartões azuis"> | <img src="documentos/img/redesign/depois/favoritos-desktop.jpg" width="100%" alt="Desktop: a estante nova de favoritos em grade"> |
| <img src="documentos/img/redesign/antes/favoritos-mobile.jpg" width="60%" alt="Mobile: a lista antiga de favoritos em cartões azuis"> | <img src="documentos/img/redesign/depois/favoritos-mobile.jpg" width="60%" alt="Mobile: a estante nova de favoritos em grade"> |

- `<title>`: "Estúdio de Ideias" → "Favoritos · Estúdio de Ideias"
- h1: (logo) → Favoritos
- Placa de leitura: Guardados 3, Onde Navegador, deixando claro que os favoritos vivem no navegador.
- "Sua estante" em grade com os mesmos cartões do acervo, estrela dourada para o estado ativo.
- Mesmo cartão e mesma linguagem de motion da página de projetos.
- Página com `noindex`, por ser conteúdo pessoal.

### Ferramentas

Arquivo: `codigo-fonte/ferramentas.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/ferramentas-desktop.jpg" width="100%" alt="Desktop: a página antiga de ferramentas com cinco cartões em 3+2"> | <img src="documentos/img/redesign/depois/ferramentas-desktop.jpg" width="100%" alt="Desktop: a página nova de ferramentas com filtro por categoria"> |
| <img src="documentos/img/redesign/antes/ferramentas-mobile.jpg" width="60%" alt="Mobile: a página antiga de ferramentas com cinco cartões em 3+2"> | <img src="documentos/img/redesign/depois/ferramentas-mobile.jpg" width="60%" alt="Mobile: a página nova de ferramentas com filtro por categoria"> |

- `<title>`: "Estúdio de Ideias" → "Ferramentas · Estúdio de Ideias"
- h1: (logo) → Ferramentas acadêmicas
- Placa de leitura: Ferramentas 05, Categorias 05, Acesso Gratuito.
- "Filtrar por categoria" com contagem viva ("5 ferramentas").
- Cartões com categoria em mono e "Acessar" com ícone de link externo, que sinaliza a saída do site.
- Mobile: sem os grandes vazios do layout antigo.

### Login

Arquivo: `codigo-fonte/login.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/login-desktop.jpg" width="100%" alt="Desktop: a tela antiga de login com cartão dividido e ícones sociais"> | <img src="documentos/img/redesign/depois/login-desktop.jpg" width="100%" alt="Desktop: a tela nova de login com conta de demonstração"> |
| <img src="documentos/img/redesign/antes/login-mobile.jpg" width="60%" alt="Mobile: a tela antiga de login com cartão dividido e ícones sociais"> | <img src="documentos/img/redesign/depois/login-mobile.jpg" width="60%" alt="Mobile: a tela nova de login com conta de demonstração"> |

- `<title>`: "Estúdio de Ideias" → "Entrar · Estúdio de Ideias"
- h1: (logo) → Sua conta
- Removidos: login social falso (f, G+, in) e a senha em texto puro no localStorage.
- Contas com SHA-256 e salt por usuário (Web Crypto), sessão de 7 dias, perfis autor e moderador.
- Caixa tracejada com a conta demo (`demo@estudiodeideias.app` / `demo1234`) e botão "Entrar com a conta demo".
- "Esqueceu sua senha?" deixou de ser `href="#"` e explica que a recuperação depende do servidor.
- Mobile empilhado, sem overflow; o bloco azul não ocupa mais a primeira tela.
- Página com `noindex`.

### Admin

Arquivo: `codigo-fonte/admin.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/admin-desktop.jpg" width="100%" alt="Desktop: o painel antigo de moderação com tabela vazia"> | <img src="documentos/img/redesign/depois/admin-desktop.jpg" width="100%" alt="Desktop: o painel novo de moderação com submissão pendente"> |
| <img src="documentos/img/redesign/antes/admin-mobile.jpg" width="60%" alt="Mobile: o painel antigo de moderação com tabela vazia"> | <img src="documentos/img/redesign/depois/admin-mobile.jpg" width="60%" alt="Mobile: o painel novo de moderação com submissão pendente"> |

- `<title>`: "Painel de Controle - Moderação" → "Moderação · Estúdio de Ideias"
- h1: Painel de Controle - Moderação de Projetos → Moderação de projetos
- Acesso restrito a moderadores: quem não tem o perfil vê "Área restrita a moderadores". Há botão "Sair" e indicação de quem está conectado.
- Placa de leitura: Pendentes 01, Em correção 00, Acesso Restrito.
- Aprovar, rejeitar e pedir correção usam confirmação em `<dialog>` acessível, no lugar de `confirm()`.
- Mobile: a linha da tabela vira cartão rotulado (Projeto, Membros, Submissão, Status), sem corte horizontal.
- Paginação falsa (1, 2, 3) removida. Página com `noindex`.

### Normas

Arquivo: `codigo-fonte/normas.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/normas-desktop.jpg" width="100%" alt="Desktop: a página antiga de normas em cartão branco"> | <img src="documentos/img/redesign/depois/normas-desktop.jpg" width="100%" alt="Desktop: a página nova de normas com seções separadas por linhas finas"> |
| <img src="documentos/img/redesign/antes/normas-mobile.jpg" width="60%" alt="Mobile: a página antiga de normas em cartão branco"> | <img src="documentos/img/redesign/depois/normas-mobile.jpg" width="60%" alt="Mobile: a página nova de normas com seções separadas por linhas finas"> |

- `<title>`: "Normas de Publicação - Estúdio de Ideias" → "Normas de publicação · Estúdio de Ideias"
- h1: Normas de Publicação → Normas de publicação
- Placa de leitura: Normas 05, Leitura 1 min, Revisão 2025.
- Seções separadas por filetes, títulos em Chakra Petch caixa alta, coluna de leitura limitada a cerca de 640 px.
- Texto preservado integralmente; mudou só a apresentação.
- Marcadores e foco seguem os tokens, com contraste AA.

### Guia de apresentação

Arquivo: `codigo-fonte/guia_apresentacao.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/guia_apresentacao-desktop.jpg" width="100%" alt="Desktop: a página antiga do guia de apresentação"> | <img src="documentos/img/redesign/depois/guia_apresentacao-desktop.jpg" width="100%" alt="Desktop: a página nova do guia de apresentação"> |
| <img src="documentos/img/redesign/antes/guia_apresentacao-mobile.jpg" width="60%" alt="Mobile: a página antiga do guia de apresentação"> | <img src="documentos/img/redesign/depois/guia_apresentacao-mobile.jpg" width="60%" alt="Mobile: a página nova do guia de apresentação"> |

- `<title>`: "Guia de Apresentação - Estúdio de Ideias" → "Guia de apresentação · Estúdio de Ideias"
- h1: Guia de Apresentação → Guia de apresentação
- Placa de leitura: Etapas 04, Leitura 1 min, Revisão 2025.
- Quatro seções com a mesma estrutura de leitura das demais páginas de conteúdo.
- Texto preservado; os acentos graves literais em torno de README.md continuam, como no original.
- Um h1 por página e landmarks semânticos.

### Eventos

Arquivo: `codigo-fonte/eventos.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/eventos-desktop.jpg" width="100%" alt="Desktop: a página antiga de eventos com links vazios"> | <img src="documentos/img/redesign/depois/eventos-desktop.jpg" width="100%" alt="Desktop: a página nova de eventos sem links vazios"> |
| <img src="documentos/img/redesign/antes/eventos-mobile.jpg" width="60%" alt="Mobile: a página antiga de eventos com links vazios"> | <img src="documentos/img/redesign/depois/eventos-mobile.jpg" width="60%" alt="Mobile: a página nova de eventos sem links vazios"> |

- `<title>`: "Eventos - Estúdio de Ideias" → "Eventos · Estúdio de Ideias"
- h1: Eventos e Workshops → Eventos
- Links `#` de eventos passados ("Assista a gravação aqui" e similares) removidos: viraram texto simples.
- A frase introdutória dos eventos passados aponta para a página de contato.
- Placa de leitura: Seções 03, Leitura 1 min, Revisão 2025.
- As datas de 2025 foram mantidas como no original.

### Tutoriais

Arquivo: `codigo-fonte/tutoriais.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/tutoriais-desktop.jpg" width="100%" alt="Desktop: a página antiga de tutoriais técnicos"> | <img src="documentos/img/redesign/depois/tutoriais-desktop.jpg" width="100%" alt="Desktop: a página nova de tutoriais técnicos"> |
| <img src="documentos/img/redesign/antes/tutoriais-mobile.jpg" width="60%" alt="Mobile: a página antiga de tutoriais técnicos"> | <img src="documentos/img/redesign/depois/tutoriais-mobile.jpg" width="60%" alt="Mobile: a página nova de tutoriais técnicos"> |

- `<title>`: "Tutoriais Técnicos - Estúdio de Ideias" → "Tutoriais técnicos · Estúdio de Ideias"
- h1: Tutoriais Técnicos → Tutoriais técnicos
- Placa de leitura: Tutoriais 04, com seções Frontend, Backend, Bases de Dados e Ferramentas e DevOps.
- Mesma coluna de leitura e mesmos filetes das outras páginas de texto.
- Texto preservado; os acentos graves literais em `git init` continuam como no original.

### FAQ

Arquivo: `codigo-fonte/faq.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/faq-desktop.jpg" width="100%" alt="Desktop: o FAQ antigo com cinco itens em sanfona"> | <img src="documentos/img/redesign/depois/faq-desktop.jpg" width="100%" alt="Desktop: o FAQ novo com cartões de canto cortado"> |
| <img src="documentos/img/redesign/antes/faq-mobile.jpg" width="60%" alt="Mobile: o FAQ antigo com cinco itens em sanfona"> | <img src="documentos/img/redesign/depois/faq-mobile.jpg" width="60%" alt="Mobile: o FAQ novo com cartões de canto cortado"> |

- `<title>`: "Perguntas Frequentes (FAQ) - Estúdio de Ideias" → "Perguntas frequentes · Estúdio de Ideias"
- h1: Perguntas Frequentes (FAQ) → Perguntas frequentes
- Placa de leitura: Perguntas 05.
- Sanfona em cartões de canto cortado, com "+" preto no lugar do azul.
- Mobile: o "+" sobrepunha o texto do terceiro item no layout antigo; no novo não há sobreposição.
- Botões da sanfona com estado expandido anunciado e foco visível.

### Contato

Arquivo: `codigo-fonte/contato.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/contato-desktop.jpg" width="100%" alt="Desktop: o formulário antigo de contato com ícones sociais"> | <img src="documentos/img/redesign/depois/contato-desktop.jpg" width="100%" alt="Desktop: o formulário novo de contato com link para o GitHub do projeto"> |
| <img src="documentos/img/redesign/antes/contato-mobile.jpg" width="60%" alt="Mobile: o formulário antigo de contato com ícones sociais"> | <img src="documentos/img/redesign/depois/contato-mobile.jpg" width="60%" alt="Mobile: o formulário novo de contato com link para o GitHub do projeto"> |

- `<title>`: "Contato - Estúdio de Ideias" → "Contato · Estúdio de Ideias"
- h1: Fale Conosco → Fale conosco
- Redes sociais falsas viraram um único link para o GitHub do projeto.
- Placa de leitura: Canais 03, Cidade Belo Horizonte.
- `?assunto=` preenche o campo de assunto, usado pela página de carreiras.
- A mensagem de sucesso avisa que o envio é simulado.
- Rótulos em mono com asterisco; nome e e-mail lado a lado no desktop.
- Mobile: o formulário antigo transbordava à direita; o novo cabe na tela.

### Carreiras

Arquivo: `codigo-fonte/carreiras.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/carreiras-desktop.jpg" width="100%" alt="Desktop: a página antiga de carreiras com faixa azul e cartões brancos"> | <img src="documentos/img/redesign/depois/carreiras-desktop.jpg" width="100%" alt="Desktop: a página nova de carreiras com vagas em lista"> |
| <img src="documentos/img/redesign/antes/carreiras-mobile.jpg" width="60%" alt="Mobile: a página antiga de carreiras com faixa azul e cartões brancos"> | <img src="documentos/img/redesign/depois/carreiras-mobile.jpg" width="60%" alt="Mobile: a página nova de carreiras com vagas em lista"> |

- `<title>`: "Carreiras - Estúdio de Ideias" → "Carreiras · Estúdio de Ideias"
- h1: Junte-se à Nossa Equipe → Junte-se à nossa equipe
- "Ver Detalhes" (`#`) virou "Candidatar-se", que abre o contato com o assunto da vaga preenchido.
- Placa de leitura: Vagas 02, Modelo Remoto, Base BH.
- Três valores (Inovação, Colaboração, Aprendizado) em cartões de canto cortado com ícones SVG, no lugar de ícones Font Awesome.
- Vagas em lista com filetes e localização em mono.
- Mobile sem a faixa azul ocupando a primeira tela.

### Privacidade

Arquivo: `codigo-fonte/privacidade.html`

| Antes | Depois |
| :--- | :--- |
| <img src="documentos/img/redesign/antes/privacidade-desktop.jpg" width="100%" alt="Desktop: a política de privacidade antiga em cartão branco"> | <img src="documentos/img/redesign/depois/privacidade-desktop.jpg" width="100%" alt="Desktop: a política de privacidade nova com seções numeradas"> |
| <img src="documentos/img/redesign/antes/privacidade-mobile.jpg" width="60%" alt="Mobile: a política de privacidade antiga em cartão branco"> | <img src="documentos/img/redesign/depois/privacidade-mobile.jpg" width="60%" alt="Mobile: a política de privacidade nova com seções numeradas"> |

- `<title>`: "Política de Privacidade - Estúdio de Ideias" → "Política de privacidade · Estúdio de Ideias"
- h1: Política de Privacidade → Política de privacidade
- Placa de leitura: Seções 07, Leitura 2 min, Revisão 2025.
- Sete seções numeradas com títulos em caixa alta e marcadores azuis.
- Texto e data de atualização preservados.
- Coluna de leitura limitada, com bom contraste e espaçamento entre blocos.

## Limite do front-end

O site é estático e vai até onde o front-end permite. Funciona sem servidor: navegação, busca e filtros no acervo, favoritos (no navegador), contas com hash SHA-256 e salt por usuário, sessão de 7 dias, perfis de autor e moderador, fluxo de submissão e moderação (o acervo público mostra só o que foi aprovado), leitor de PDF e leituras relacionadas (com cache de 24 h e snapshot local).

Depende de back-end, e a interface avisa: recuperação de senha, envio real do formulário de contato (a mensagem de sucesso diz que é simulado), persistência de submissões e contas entre dispositivos e dados do acervo que não sejam fictícios.

## Como verificar

Servir o site localmente:

```
python -m http.server 8000 --directory codigo-fonte
```

Abrir `http://localhost:8000`. Conta de demonstração: `demo@estudiodeideias.app` / `demo1234` (botão "Entrar com a conta demo").

Aberto direto do disco (`file://`), o navegador bloqueia a leitura do acervo; a página avisa e indica como abrir o site.
