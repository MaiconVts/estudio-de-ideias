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
| CT-01: Verificar a página inicial e barra de busca | RF-03: Campo de busca aberto para projetos | Verificar se a busca por palavras-chave na home retorna os projetos adequados | 1. Acessar a Home<br>2. Digitar termo na barra de busca<br>3. Clicar em "Buscar" | Os projetos relevantes devem aparecer em lista | Maicon Theodoro |
| CT-02: Verificar a filtragem avançada | RF-04: Filtro por autor, ano, tecnologia e disciplina | Testar se os filtros retornam resultados corretamente | 1. Acessar a página de projetos<br>2. Selecionar filtros<br>3. Verificar lista | Lista de projetos deve corresponder aos filtros aplicados | Vinícius Silva |
| CT-03: Verificar visualização dos projetos | RF-05: Visualizar atributos e botão de download | Validar se os projetos apresentam detalhes e link funcional | 1. Clicar em um projeto<br>2. Visualizar atributos<br>3. Verificar botão de download | Detalhes exibidos corretamente e botão funcional | Hugo Vaz |
| CT-04: Verificar favoritos | RF-07: Marcar e exibir favoritos | Testar funcionalidade de favoritar projeto e acessar depois | 1. Marcar projeto como favorito<br>2. Acessar tela de Favoritos | Projeto salvo corretamente no localStorage | Vinícius Silva |
| CT-05: Verificar categorização dos projetos | RF-08: Categorização por área, tipo e tecnologia | Validar se os projetos têm tags visíveis e interativas | 1. Acessar página de projetos<br>2. Observar as categorias nos cards | Tags devem estar visíveis e coerentes com o conteúdo | Vinícius Silva |
| CT-06: Verificar página de recomendações | RF-06: Exibir links úteis e tutoriais | Testar exibição dos cards de recomendação | 1. Acessar aba "Ferramentas Recomendadas" | Cards com links devem estar visíveis e separados por categoria | Eduardo Moreira |
| CT-07: Verificar envio de projeto | RF-01: Formulário público para envio de documento | Verificar se o formulário de envio funciona | 1. Acessar página de envio<br>2. Preencher todos os campos<br>3. Clicar em “Enviar” | Alerta de sucesso "Projeto enviado para moderação!" é exibido | Allan Rodrigues |
| CT-08: Verificar área de moderação | RF-02: Página restrita para aprovar ou rejeitar documentos | Testar se moderadores podem validar projetos | 1. Fazer login<br>2. Acessar área de moderação<br>3. Aprovar ou rejeitar | O status deve ser alterado corretamente | Allan Rodrigues |
| CT-09: Solicitar correções em submissão | RF-10: Moderador pode solicitar correção | Testar botão "Solicitar correção" e exibição da mensagem | 1. Acessar projeto pendente<br>2. Clicar em "Solicitar correção" | Projeto muda de status e campo de mensagem aparece | Allan Rodrigues |
| CT-10: Exibir estatísticas | RF-09: Apresentar dados estatísticos | Validar se as estatísticas são exibidas com base nos dados | 1. Acessar página de estatísticas<br>2. Observar gráficos | Gráficos refletem corretamente os dados dos projetos | Allan Rodrigues |
| CT-11: Simular envio de email ao aluno | RF-11: Enviar notificação por email (simulado) | Simular alerta visual após moderação de projeto | 1. Enviar projeto<br>2. Moderador aprova ou rejeita | Alerta de email simulado é exibido ao aluno | Allan Rodrigues |
| CT-12: Exportar estatísticas | RF-12: Exportar dados estatísticos | Verificar funcionalidade de exportar dados para CSV | 1. Acessar estatísticas<br>2. Clicar em “Exportar Dados” | Download simulado de arquivo CSV com dados exibidos | Allan Rodrigues |

---

> Cada membro deverá documentar e validar os testes da funcionalidade que desenvolveu. Os critérios de insucesso também devem ser registrados individualmente para avaliação.
