# Plano de Testes de Software

Este documento apresenta os cenários de testes utilizados na realização dos testes da aplicação "Estúdio de Ideias".

**Pré-requisitos:**
* [Especificação do Projeto](docs/ESPECIFICACAO_PROJETO.md) * [Projeto de Interface](docs/PROJETO_INTERFACE.md) * [Funcionalidades Implementadas](docs/FUNCIONALIDADES_IMPLEMENTADAS.md) **Requisitos para Execução dos Testes:**
* Aplicação "Estúdio de Ideias" acessível.
* Navegador da Internet: Chrome, Firefox ou Edge (versões mais recentes).
* Dados de projetos (para busca, listagem, moderação) populados no `localStorage`.

---

## Casos de Teste por Responsável e Requisito Funcional

A seguir são detalhados os casos de teste para os Requisitos Funcionais (RFs) do projeto, organizados por responsável pela elaboração do caso de teste.

---

## Maicon Theodoro

### RF-03: Campo de busca aberto para projetos (Home)

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-01: Verificar a busca por palavra-chave na Home (sucesso)</td>
  <td><ul><li>RF-03</li></ul></td>
  <td>Verificar se a busca por palavras-chave na home retorna os projetos adequados.</td>
  <td>
   <ol>
    <li>Acessar a Home Page.</li>
    <li>Digitar "NomeDeUmProjetoExistente" na barra de busca.</li>
    <li>Clicar em "Buscar".</li>
   </ol>
  </td>
  <td>Apenas projetos que correspondem ao termo são listados.</td>
  <td>Maicon Theodoro</td>
 </tr>
 <tr>
  <td>CT-01-I1: Verificar busca com termo inexistente na Home (insucesso)</td>
  <td><ul><li>RF-03</li></ul></td>
  <td>Verificar o comportamento da busca ao usar um termo que não corresponde a nenhum projeto.</td>
  <td>
   <ol>
    <li>Acessar a Home Page.</li>
    <li>Digitar "TermoInexistente123" na barra de busca.</li>
    <li>Clicar em "Buscar".</li>
   </ol>
  </td>
  <td>Mensagem "Nenhum projeto encontrado" (ou similar) é exibida.</td>
  <td>Maicon Theodoro</td>
 </tr>
</table>

---

## Vinícius Silva

### RF-04: Filtro por autor, ano, tecnologia e disciplina

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-02: Verificar a filtragem avançada (sucesso)</td>
  <td><ul><li>RF-04</li></ul></td>
  <td>Testar se os filtros de busca avançada retornam resultados corretamente.</td>
  <td>
   <ol>
    <li>Acessar a página de listagem de projetos.</li>
    <li>Selecionar um filtro de "Ano" (ex: 2024).</li>
    <li>Selecionar um filtro de "Área de Atuação" (ex: Desenvolvimento Web).</li>
    <li>Observar a lista de projetos.</li>
   </ol>
  </td>
  <td>A lista é atualizada para mostrar apenas projetos que correspondem aos filtros.</td>
  <td>Vinícius Silva</td>
 </tr>
</table>

### RF-07: Marcar e exibir favoritos

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-04: Favoritar e desfavoritar um projeto</td>
  <td><ul><li>RF-07</li></ul></td>
  <td>Testar a funcionalidade de marcar/desmarcar um projeto como favorito e visualizá-lo na tela de Favoritos.</td>
  <td>
   <ol>
    <li>Na lista de projetos, clicar no ícone "Favoritar" de um projeto.</li>
    <li>Acessar a página "Favoritos".</li>
    <li>Verificar se o projeto está listado.</li>
    <li>Voltar à lista ou à página de favoritos e desfavoritar o projeto.</li>
    <li>Verificar se o projeto sumiu da lista de favoritos.</li>
   </ol>
  </td>
  <td>Projeto é adicionado/removido da lista de favoritos e do `localStorage` corretamente.</td>
  <td>Vinícius Silva</td>
 </tr>
</table>

### RF-08: Categorização por área, tipo e tecnologia

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-05: Verificar exibição das categorias/tags nos cards</td>
  <td><ul><li>RF-08</li></ul></td>
  <td>Validar se os projetos exibem suas categorias (tags de área, tecnologias) de forma clara.</td>
  <td>
   <ol>
    <li>Acessar a página de listagem de projetos.</li>
    <li>Observar os cards dos projetos.</li>
   </ol>
  </td>
  <td>Cada projeto exibe suas tags de categoria (área, tecnologias) corretamente.</td>
  <td>Vinícius Silva</td>
 </tr>
</table>

---

## Hugo Vaz

### RF-05: Visualizar atributos e botão de download

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-03: Verificar visualização dos detalhes do projeto</td>
  <td><ul><li>RF-05</li></ul></td>
  <td>Validar se, ao clicar em um projeto, seus detalhes completos e o link para download (simulado) são exibidos.</td>
  <td>
   <ol>
    <li>Acessar uma página que liste projetos.</li>
    <li>Clicar no título de um projeto existente.</li>
    <li>Observar a página de detalhes.</li>
   </ol>
  </td>
  <td>A página de detalhes exibe informações (título, autor, resumo, etc.) e o botão de download está presente e funcional (simulado).</td>
  <td>Hugo Vaz</td>
 </tr>
</table>

---

## Eduardo Moreira

### RF-06: Página de Recomendações de Ferramentas

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-06: Verificar exibição da página de Ferramentas</td>
  <td><ul><li>RF-06</li></ul></td>
  <td>Testar se a página de "Ferramentas Recomendadas" exibe os cards com links e informações.</td>
  <td>
   <ol>
    <li>Clicar no link "Ferramentas Recomendadas" no menu.</li>
    <li>Observar o conteúdo.</li>
   </ol>
  </td>
  <td>A página é carregada e os cards de ferramentas/tutoriais são visíveis.</td>
  <td>Eduardo Moreira</td>
 </tr>
</table>

---

## Allan Rodrigues

### RF-01: Formulário público para envio de documento

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-07: Enviar projeto com todos os campos válidos (sucesso)</td>
  <td><ul><li>RF-01</li></ul></td>
  <td>Verificar se o formulário de envio de projetos salva os dados corretamente e exibe feedback.</td>
  <td>
   <ol>
    <li>Acessar a página "Envio de Projetos".</li>
    <li>Preencher todos os campos do formulário com dados válidos.</li>
    <li>Clicar em "Enviar para Moderação".</li>
   </ol>
  </td>
  <td>Alerta de sucesso é exibido. Formulário é limpo. Projeto aparece na `paginaAdmin` com status "Pendente".</td>
  <td>Allan Rodrigues</td>
 </tr>
 <tr>
  <td>CT-07-I1: Enviar projeto com campo obrigatório vazio (insucesso)</td>
  <td><ul><li>RF-01</li></ul></td>
  <td>Verificar se o sistema impede submissão com campos obrigatórios vazios.</td>
  <td>
   <ol>
    <li>Acessar "Envio de Projetos".</li>
    <li>Deixar "Título do Projeto" vazio. Preencher os demais.</li>
    <li>Clicar em "Enviar para Moderação".</li>
   </ol>
  </td>
  <td>Alerta indicando campos obrigatórios é exibido. Projeto não é salvo.</td>
  <td>Allan Rodrigues</td>
 </tr>
</table>

### RF-02: Página restrita para aprovar ou rejeitar documentos (Moderação)

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-08: Aprovar um projeto pendente</td>
  <td><ul><li>RF-02</li><li>RF-10</li></ul></td>
  <td>Testar se o moderador pode aprovar um projeto pendente.</td>
  <td>
   <ol>
    <li>(Pré-condição: Projeto "P1" com status "Pendente").</li>
    <li>Acessar `paginaAdmin`.</li>
    <li>Localizar "P1". Clicar "Aprovar". Confirmar.</li>
   </ol>
  </td>
  <td>Status de "P1" muda para "Aprovado". Alerta de sucesso exibido.</td>
  <td>Allan Rodrigues</td>
 </tr>
</table>

### RF-10: Moderador pode solicitar correção

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-09: Solicitar correção de um projeto pendente</td>
  <td><ul><li>RF-10</li><li>RF-02</li></ul></td>
  <td>Testar se o moderador pode solicitar correção para um projeto pendente.</td>
  <td>
   <ol>
    <li>(Pré-condição: Projeto "P2" com status "Pendente").</li>
    <li>Acessar `paginaAdmin`.</li>
    <li>Localizar "P2". Clicar "Correção". Confirmar.</li>
   </ol>
  </td>
  <td>Status de "P2" muda para "Correção Solicitada". Alerta de feedback exibido.</td>
  <td>Allan Rodrigues</td>
 </tr>
</table>

### RF-09: Apresentar dados estatísticos

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-10: Verificar exibição de estatísticas (simulado)</td>
  <td><ul><li>RF-09</li></ul></td>
  <td>Validar se a página de estatísticas (simulada) exibe dados simples dos projetos.</td>
  <td>
   <ol>
    <li>Acessar a página/seção de estatísticas (se houver).</li>
    <li>Observar os dados.</li>
   </ol>
  </td>
  <td>Contadores (ex: total de projetos) são exibidos e refletem dados simulados.</td>
  <td>Allan Rodrigues</td>
 </tr>
</table>

### RF-11: Enviar notificação por email (simulado)

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-11: Simular alerta visual de notificação ao aluno</td>
  <td><ul><li>RF-11</li></ul></td>
  <td>Verificar se um alerta visual (simulando notificação) é gerado após a moderação.</td>
  <td>
   <ol>
    <li>Na `paginaAdmin`, aprovar ou rejeitar um projeto.</li>
   </ol>
  </td>
  <td>O alerta de feedback da ação de moderação serve como simulação da notificação.</td>
  <td>Allan Rodrigues</td>
 </tr>
</table>

### RF-12: Exportar dados estatísticos

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>
 <tr>
  <td>CT-12: Verificar exportação de dados (simulado)</td>
  <td><ul><li>RF-12</li></ul></td>
  <td>Verificar a funcionalidade simulada de exportar dados estatísticos.</td>
  <td>
   <ol>
    <li>Acessar a página de estatísticas (se houver).</li>
    <li>Clicar no botão "Exportar Dados" (se houver).</li>
   </ol>
  </td>
  <td>`console.log` indica "Exportação simulada" ou alerta visual é exibido.</td>
  <td>Allan Rodrigues</td>
 </tr>
</table>

---

> **Links Úteis**: 
> - [IBM - Criação e Geração de Planos de Teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Teste de Software: Conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)

---
