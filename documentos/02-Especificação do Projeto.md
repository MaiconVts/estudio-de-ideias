# Especificação do Projeto

## Perfis de Usuários

<table>
<tbody>
<tr align=center>
<th colspan="2">Moderadores</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Moderadores responsáveis pela análise, validação e inserção dos documentos submetidos.</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Acessar área restrita para validar documentos.
Avaliar conteúdo técnico.
Aprovar, rejeitar ou solicitar correções.
Visualizar estatísticas sobre os documentos cadastrados.
Manter registro de auditoria das moderações.</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Alunos</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Estudantes de ADS da PUC Minas Virtual que utilizam a plataforma para submeter, pesquisar e consultar projetos acadêmicos, visando compartilhar conhecimento e obter referências.</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Submeter projetos para registro e compartilhamento. Realizar buscas avançadas por projetos relevantes. Salvar projetos favoritos para acesso rápido.</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Pesquisadores e Educadores</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Professores, pesquisadores e coordenadores de curso que utilizam a plataforma para pesquisar, analisar e utilizar projetos acadêmicos.</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Realizar buscas avançadas e filtrar por critérios específicos.
Acessar dados estatísticos sobre projetos (tendências, tecnologias, etc.).
Exportar dados para pesquisa.
Salvar projetos favoritos.
Baixar documentos.</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Visitantes</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Profissionais do mercado, empreendedores, estudantes de outras instituições e interessados em geral que buscam conhecer os projetos.</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Navegar pelo repositório.
Realizar buscas gerais.
Acessar informações básicas sobre os projetos.
Visualizar recomendações e categorias de projetos.
Possivelmente, entrar em contato com os criadores.
Marcar projetos como favoritos.</td>
</tr>
</tbody>
</table>

## Histórias de Usuários

|EU COMO... `QUEM`   | QUERO/PRECISO ... `O QUE` |PARA ... `PORQUE`                 |
|--------------------|---------------------------|----------------------------------|
| Aluno              | Enviar um projeto para ser registrado | Disponibilizar o projeto na plataforma e torná-lo acessível para consulta |
| Aluno              | Receber mensagem de envio bem-sucedido | Confirmar que o documento foi enviado corretamente |
| Moderador          | Acessar uma página restrita com os documentos enviados | Validar os documentos antes da publicação |
| Todos perfis       | Pesquisar por projetos acadêmicos utilizando palavras-chave | Encontrar projetos relevantes de forma rápida |
| Todos perfis       | Filtrar os resultados por ano de publicação, tipo de projeto ou tecnologias utilizadas | Localizar projetos específicos de acordo com meus interesses |
| Todos perfis       | Ordenar os resultados da pesquisa por diferentes critérios | Priorizar os projetos com maior identificação com a pesquisa durante a navegação |
| Todos perfis       | Ver uma lista de projetos com título, autores, ano de publicação e resumo | Avaliar rapidamente se o projeto é relevante para minha consulta |
| Todos perfis       | Ver a quantidade de resultados encontrados na pesquisa | Saber a abrangência da busca |
| Todos perfis       | Acessar uma página com informações necessárias para o envio do projeto | Seguir corretamente o formato exigido para submissão de documentos |
| Todos perfis       | Tornar favoritos documentos de interesse | Acessá-los rapidamente no futuro e facilitar as recomendações |
| Todos perfis       | Baixar os documentos completos dos projetos | Analisar detalhadamente as soluções implementadas |
| Todos perfis       | Visualizar estatísticas sobre os projetos cadastrados | Identificar tendências e padrões para minhas pesquisas acadêmicas |
| Moderador          | Solicitar correções em projetos submetidos | Garantir a qualidade e conformidade dos documentos publicados |
| Aluno              | Receber notificações sobre o status da minha submissão | Acompanhar o processo de aprovação do meu projeto |
| Visitante          | Navegar por categorias de projetos | Explorar soluções desenvolvidas em áreas específicas de meu interesse |

## Requisitos do Projeto

### Requisitos Funcionais

|ID    | Descrição                | Prioridade |
|-------|---------------------------------|----|
| RF-01 | A aplicação deve possuir um formulário público para realizar o envio de um documento | Alta | 
| RF-02 | A aplicação deverá possuir uma página restrita, destinada aos moderadores, para deferir ou indeferir um documento | Alta |
| RF-03 | A aplicação deverá disponibilizar um campo de busca aberto para que os visitantes possam pesquisar os projetos disponíveis | Alta |
| RF-04 | A aplicação deverá disponibilizar um formulário para que os visitantes possam filtrar projetos pelos seus atributos de forma específica (autor, ano, tecnologia, disciplina) | Alta |
| RF-05 | A aplicação deverá permitir que o visitante visualize um projeto da lista apresentando os seus atributos e o botão para download | Alta |
| RF-06 | A aplicação deverá disponibilizar páginas para divulgar recomendações, tutoriais, ferramentas e outras informações que auxiliem os alunos na confecção de projetos | Baixa |
| RF-07 | Permitir que o visitante possa marcar como favorito um documento e visualize todos os projetos marcados com esta condição posteriormente | Baixa |
| RF-08 | A aplicação deve permitir a categorização dos projetos por área de conhecimento, tipo de projeto e tecnologias utilizadas | Média |
| RF-09 | A aplicação deve apresentar estatísticas sobre os projetos cadastrados (quantidade por período, por área, por tecnologia) | Média |
| RF-10 | A aplicação deve permitir que moderadores solicitem correções ou complementações nos projetos submetidos | Média |
| RF-11 | A aplicação deve enviar notificações por email aos alunos sobre o status de suas submissões | Baixa |
| RF-12 | A aplicação deve permitir a exportação de dados estatísticos para pesquisadores | Baixa |

**Prioridade: Alta / Média / Baixa. 

### Requisitos não Funcionais

|ID      | Descrição               |Prioridade |
|--------|-------------------------|----|
| RNF-01 | A aplicação deverá ser responsiva, garantindo usabilidade em diferentes dispositivos e tamanhos de tela | Alta | 
| RNF-02 | A aplicação deverá realizar backups diários dos documentos e dados armazenados | Alta | 
| RNF-03 | A aplicação deverá exibir alertas de sucesso, de informações e de erros claros e objetivos para os usuários da plataforma | Média |
| RNF-04 | A aplicação deverá seguir boas práticas de semântica e acessibilidade garantindo visibilidade nos motores de busca e suporte a leitores de tela | Média |
| RNF-05 | O sistema deve garantir o tempo de resposta não superior a 3 segundos para buscas simples e 5 segundos para buscas com filtros complexos | Alta |
| RNF-06 | O sistema deve garantir a segurança dos dados dos usuários e dos documentos submetidos | Alta |
| RNF-07 | A interface deve ser intuitiva e de fácil navegação, com fluxos de trabalho claros para todas as funcionalidades | Média |
| RNF-08 | O sistema deve suportar o upload de documentos em diversos formatos (PDF, DOC, DOCX, PPT, ZIP) com tamanho máximo de 50MB | Média |
| RNF-09 | A aplicação deve ser compatível com os principais navegadores do mercado (Chrome, Firefox, Safari, Edge) | Alta |
| RNF-10 | O sistema deve manter um registro de auditoria para todas as operações de moderação realizadas | Baixa |

**Prioridade: Alta / Média / Baixa. 
