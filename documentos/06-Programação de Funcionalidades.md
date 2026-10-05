# Programação de Funcionalidades

As telas abaixo são as da versão atual, depois do redesign de 2026. O antes e depois de cada uma está em [REDESIGN.md](../REDESIGN.md). Todas as páginas compartilham a mesma base: `base.css` (tokens e tipografia), `layout.css` (cabeçalho e rodapé), `mundo.css` (assinatura visual), `layout.js` (menu e “Minha conta”) e `motion-base.js` (linguagem de motion). Os dados ficam no `localStorage`, porque o projeto é só front-end.

---

## Tela de Cadastro (RF-001)

**Responsável:** Hugo Vaz

O cadastro fica na mesma página do login, no painel “Criar Conta”, e também abre direto pelo endereço `login.html#cadastro`. Sem servidor, a conta é guardada no navegador (`conta.js`): a senha nunca fica em texto puro, só o resumo SHA-256 com sal próprio de cada usuário (Web Crypto). Toda conta nova recebe o papel de autor. Nome, e-mail e senha são validados por `formularios.js`, com a mensagem de erro ligada ao campo, e um e-mail repetido é recusado.

**Exemplo da tela de cadastro:**  
<figure> 
  <img src="./img/redesign/depois/login-desktop.jpg" alt="Tela de login no redesign de 2026"> 
</figure>

**Requisito atendido:**  
RF-001: O site deve permitir ao usuário cadastrar uma conta.

**Artefatos da funcionalidade:**

- `login.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/login.css`
- `assets/js/formularios.js`
- `assets/js/conta.js`
- `assets/js/login.js`

**Instruções de acesso:**  
Abra um navegador e informe a seguinte URL:  
*https://maiconvts.github.io/estudio-de-ideias/login.html*  
Clique em “Criar Conta” ao lado do formulário de entrada.

---

## Tela de Login (RF-002)

**Responsável:** Hugo Vaz

A tela de login abre pelo botão “Entrar” do menu. A sessão dura 7 dias, não guarda a senha e leva ao destino do papel: o moderador vai para a moderação, e o autor, para o envio de projetos. O parâmetro `?volta=` devolve a pessoa à página de onde veio. Com a sessão aberta, a página mostra quem está conectado e oferece “Sair”.

Para avaliar o site sem criar conta, há uma conta demo com papel de moderador, criada no primeiro acesso, e o botão “Entrar com a conta demo” preenche tudo sozinho:

| E-mail | Senha |
| :--- | :--- |
| `demo@estudiodeideias.app` | `demo1234` |

Recuperação de senha, login social e verificação de e-mail dependem de back-end; “Esqueceu sua senha?” explica isso em vez de fingir um envio.

**Exemplo da tela de login:**  
<figure> 
  <img src="./img/redesign/depois/login-desktop.jpg" alt="Tela de login no redesign de 2026"> 
</figure>

**Requisito atendido:**  
RF-002: O site deve permitir ao usuário fazer o login da sua conta.

**Artefatos da funcionalidade:**

- `login.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/login.css`
- `assets/js/formularios.js`
- `assets/js/conta.js`
- `assets/js/login.js`

**Instruções de acesso:**  
Acesse:  
*https://maiconvts.github.io/estudio-de-ideias/login.html*  
Clique em “Entrar” no menu superior ou use o botão da conta demo.

---

## Tela Home com Barra de Pesquisa (RF-003)

**Responsável:** Maicon Theodoro

Na página inicial, os usuários encontram uma barra de pesquisa centralizada que permite realizar buscas por palavras-chave.

**Exemplo da tela Home com barra de pesquisa:**  
 <figure> 
  <img src="./img/redesign/depois/home-desktop.jpg" alt="Tela de home no redesign de 2026"> 
</figure>


**Requisito atendido:**  
RF-003: Campo de busca aberto para pesquisa de projetos.

**Artefatos da funcionalidade:**

- `index.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/home.css`
- `assets/js/projetos.js`
- `assets/js/projetos-utils.js`
- `assets/js/home.js`
- `assets/js/miura.js`
- `assets/js/home-motion.js`

**Instruções de acesso:**  
Acesse a Home Page em:  
*https://maiconvts.github.io/estudio-de-ideias/index.html*  
Utilize a barra de busca no centro da página para pesquisar.

---

## Tela de Administração (RF-004)

**Responsável:** Allan

Esta tela permite que os moderadores validem os projetos enviados: aprovar, rejeitar ou pedir correção. As placas do cabeçalho contam quantos estão em cada estado. Cada ação pede confirmação num `<dialog>` nativo, e o aviso do resultado é lido pelos leitores de tela. Só uma sessão de moderador abre a fila; sem ela, a tabela dá lugar a um aviso de acesso com o link para o login. O projeto aprovado entra no acervo público.

**Exemplo da tela de Administração:**  
<figure> 
  <img src="./img/redesign/depois/admin-desktop.jpg" alt="Tela de admin no redesign de 2026"> 
</figure>

**Artefatos da funcionalidade:**

- `admin.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/projetos.css`
- `assets/css/admin_panel.css`
- `assets/js/conta.js`
- `assets/js/projetos.js`
- `assets/js/admin_panel.js`

**Instruções de acesso:**  
Entre com a conta demo (papel moderador): o login leva direto a
*https://maiconvts.github.io/estudio-de-ideias/admin.html*

---

## Tela de Detalhes do Projeto (RF-005)

**Responsável:** Hugo Vaz

Esta tela exibe os detalhes completos do projeto: título, autor, ano, área, tecnologias, citações e resumo. O documento abre num visualizador de PDF feito com pdf.js, que também funciona no Chrome do Android, e pode ser baixado. A seção de leituras relacionadas vem da API pública do OpenAlex.

**Exemplo da tela de Detalhes do Projeto:**  
 <figure> 
  <img src="./img/redesign/depois/detalhes-desktop.jpg" alt="Tela de detalhes no redesign de 2026"> 
</figure>

**Artefatos da funcionalidade:**

- `detalhes.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/detalhes.css`
- `assets/js/projetos.js`
- `assets/js/projetos-utils.js`
- `assets/js/pdf-viewer.js`
- `assets/js/openalex.js`
- `assets/js/detalhes.js`

**Instruções de acesso:**  
Clique em um projeto da lista para ver seus detalhes. A página recebe o projeto pelo parâmetro `id`:
*https://maiconvts.github.io/estudio-de-ideias/detalhes.html?id=266e4868-43d3-4f29-b424-e1500cd4855b*

---

## Tela de Ferramentas (RF-006)

**Responsável:** Eduardo

Esta tela apresenta recomendações, tutoriais e ferramentas que auxiliam os alunos na confecção e pesquisa de projetos.

**Exemplo da tela de Ferramentas:**
<figure> 
  <img src="./img/redesign/depois/ferramentas-desktop.jpg" alt="Tela de ferramentas no redesign de 2026"> 
</figure>

**Artefatos da funcionalidade:**

- `ferramentas.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/ferramentas.css`
- `assets/js/ferramentas.js`

**Instruções de acesso:**  
Acesse a seção de ferramentas a partir do menu de navegação ou através do link: 
*https://maiconvts.github.io/estudio-de-ideias/ferramentas.html*

---

## Tela de Favoritos (RF-007)

**Responsável**: Vinícius Silva

Esta tela mostra os projetos que o usuário marcou como favoritos, facilitando o acesso rápido aos documentos de interesse. Para marcar um projeto como favorito, basta clicar em "Adicionar aos favoritos" no cartão de exibição na lista de projetos. A lista dos projetos marcados como favoritos pode ser encontrada na página "Favoritos", através do menu de navegação.

**Exemplo da tela de Favoritos:**
 <figure> 
  <img src="./img/redesign/depois/favoritos-desktop.jpg" alt="Tela de favoritos no redesign de 2026"> 
</figure>

**Requisito atendido:**  
RF-007: Permitir que o visitante possa marcar como favorito um documento e visualize todos os projetos marcados com esta condição posteriormente

**Artefatos da funcionalidade:**

- `favoritos.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/projetos.css`
- `assets/js/projetos.js`
- `assets/js/projetos-utils.js`
- `assets/js/favoritos.js`

**Instruções de acesso:**  
- Acesse a página em https://maiconvts.github.io/estudio-de-ideias/favoritos.html

---

## Tela de Projetos (RF-008)

**Responsável:** Vinicius

Esta tela lista os projetos disponíveis, permitindo ao usuário filtrar e ordenar os resultados de acordo com critérios específicos.

**Exemplo da tela de Projetos:**
<figure> 
  <img src="./img/redesign/depois/projetos-desktop.jpg" alt="Tela de projetos no redesign de 2026"> 
</figure>

**Artefatos da funcionalidade:**

- `projetos.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/projetos.css`
- `assets/js/projetos.js`
- `assets/js/projetos-utils.js`
- `assets/js/projetos-page.js`

**Instruções de acesso:**  
Utilize os filtros e a barra de pesquisa para encontrar projetos de seu interesse, e acesse pelo link para visualizar: 
*https://maiconvts.github.io/estudio-de-ideias/projetos.html*

---

## Tela de Submissão (Envio de Projetos) (RF-009)

**Responsável:** Allan

Esta tela permite aos alunos enviar projetos por um formulário com todas as informações do registro. Com sessão aberta, o nome do autor já vem preenchido. O envio entra na fila de moderação com o status “Pendente” e só aparece no acervo depois de aprovado.

**Exemplo da tela de Submissão (Envio de Projetos):**
<figure> 
  <img src="./img/redesign/depois/submissao-desktop.jpg" alt="Tela de submissao no redesign de 2026"> 
</figure>

**Artefatos da funcionalidade:**

- `submissao.html`
- `assets/css/base.css`
- `assets/css/layout.css`
- `assets/css/mundo.css`
- `assets/js/layout.js`
- `assets/js/motion-base.js`
- `assets/css/submission.css`
- `assets/js/conta.js`
- `assets/js/projetos.js`
- `assets/js/formularios.js`
- `assets/js/submissao.js`

**Instruções de acesso:**  
Clique na opção de envio de projeto no menu para acessar a tela de submissão, ou acesse pelo link: 
*https://maiconvts.github.io/estudio-de-ideias/submissao.html*
