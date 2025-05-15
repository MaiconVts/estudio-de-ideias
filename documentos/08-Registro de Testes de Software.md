# Plano de Testes de Software

**Pré-requisitos:** [Especificação do Projeto](02-Especificação%20do%20Projeto.md), [Projeto de Interface](04-Projeto%20de%20Interface.md)

---

## Requisitos para execução dos testes

- Site publicado na internet.
- Navegador da internet: Chrome, Firefox ou Edge.

---

## Casos de Teste (Requisitos Funcionais)

| Caso de teste | Requisitos associados | Objetivo do teste | Passos | Critérios de êxito | Responsável |
|---------------|------------------------|-------------------|--------|--------------------|-------------|
| CT-01: Verificar a submissão de projeto | RF-01: A aplicação deve possuir um formulário público para realizar o envio de um documento. | Verificar se o formulário de envio está funcionando corretamente. | 1. Acessar o site.<br>2. Clicar em “Envio de Projetos”.<br>3. Preencher os campos obrigatórios.<br>4. Clicar em “Enviar Projeto”. | Exibir alerta de confirmação "Projeto enviado para moderação!" | Maicon Theodoro |
| CT-02: Verificar a área de moderação | RF-02: A aplicação deverá possuir uma página restrita, destinada aos moderadores, para deferir ou indeferir um documento. | Verificar se a página carrega os projetos pendentes e responde à ação de aprovação/rejeição. | 1. Acessar a área de login.<br>2. Fazer login como moderador.<br>3. Acessar “Área Restrita”.<br>4. Clicar em “Aprovar” ou “Rejeitar”. | O status do projeto deve ser atualizado e exibido ao moderador. | Allan Rodrigues |
| CT-03: Verificar busca geral | RF-03: Campo de busca aberto para projetos. | Testar se o campo de busca retorna projetos pelo título ou palavra-chave. | 1. Acessar o site.<br>2. Inserir um termo na barra de busca da Home.<br>3. Clicar em “Buscar”. | O(s) projeto(s) relacionado(s) devem aparecer. | Vinícius Silva |
| CT-04: Verificar filtros avançados | RF-04: Filtro por autor, ano, tecnologia e disciplina. | Testar se os filtros combinados retornam resultados corretamente. | 1. Acessar a página de projetos.<br>2. Preencher os filtros.<br>3. Verificar os resultados. | A lista de projetos deve refletir os critérios definidos. | Vinícius Silva |
| CT-05: Visualizar detalhes de projeto | RF-05: Visualizar atributos e botão de download. | Verificar se ao clicar no título do projeto, os dados detalhados são exibidos. | 1. Acessar a página de projetos.<br>2. Clicar em um título de projeto. | O projeto deve ser exibido com título, autores, resumo, etc., e botão de download. | Hugo Vaz |
| CT-06: Verificar página de recomendações | RF-06: Exibir links úteis e tutoriais para alunos. | Testar a exibição de cards de recomendação por categoria. | 1. Acessar a aba “Ferramentas Recomendadas”. | Os cards com links e categorias devem ser exibidos corretamente. | Eduardo Moreira |
| CT-07: Verificar favoritos | RF-07: Marcar e exibir favoritos. | Verificar se é possível marcar um projeto como favorito e visualizá-lo na tela correspondente. | 1. Acessar a tela de projetos.<br>2. Marcar um projeto.<br>3. Acessar a tela “Favoritos”. | O projeto deve constar na lista de favoritos. | Vinícius Silva |
| CT-08: Verificar categorização | RF-08: Categorização por área, tipo e tecnologia. | Verificar se os projetos exibem categorias visuais e funcionais. | 1. Acessar a tela de projetos.<br>2. Observar os marcadores de categoria. | As tags de categorização devem estar visíveis e funcionais. | Vinícius Silva |
| CT-09: Verificar estatísticas | RF-09: Exibir estatísticas de projetos. | Verificar se os dados estatísticos aparecem conforme os projetos cadastrados. | 1. Acessar área de estatísticas.<br>2. Observar gráficos e contadores. | As estatísticas devem ser coerentes com os projetos inseridos. | Allan Rodrigues |
| CT-10: Solicitação de correções | RF-10: Moderador pode solicitar correção. | Verificar se o botão “Solicitar Correção” ativa o campo de mensagem e registro. | 1. Logar como moderador.<br>2. Abrir projeto pendente.<br>3. Clicar em “Solicitar Correção”. | O projeto deve mudar de status e armazenar a solicitação. | Allan Rodrigues |
| CT-11: Simular envio de email | RF-11: Notificação de status por email. | Verificar simulação de envio de email ao aluno. | 1. Enviar um projeto.<br>2. Moderador aprova ou rejeita. | Alerta de email simulado deve ser exibido em tela. | Maicon Theodoro |
| CT-12: Exportar estatísticas | RF-12: Exportar dados para pesquisa. | Verificar se existe uma opção de exportação em CSV ou visualização ampliada. | 1. Acessar página de estatísticas.<br>2. Clicar em “Exportar Dados”. | Download de arquivo simulado com dados do gráfico. | Allan Rodrigues |

---

> Cada membro deverá também criar o plano de testes específico para a funcionalidade que desenvolveu, documentando-o com os devidos critérios de sucesso e insucesso.
