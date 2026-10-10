# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Principal, sempre: os discentes de ADS, que são autores e leitores dos projetos. Publicam o trabalho para que ele não se perca depois da nota e buscam projetos de colegas para se inspirar, estudar uma tecnologia ou mostrar o próprio trabalho. A interface é desenhada para eles, não para recrutadores.

Também atendidos (perfis de `documentos/01-Documentação de Contexto.md`): docentes que consultam e moderam, e visitantes que pesquisam.

## Product Purpose

Repositório de projetos acadêmicos do curso de ADS, parecido com o Google Scholar: guarda o conhecimento que se perdia depois da avaliação dos trabalhos e permite pesquisar, filtrar, ler detalhes, favoritar, submeter e moderar projetos.

Publicado como demonstração, o site se comporta como produto real, com dados simulados identificados como tais. Sucesso é o discente encontrar em poucos passos o projeto que procura e sentir que o próprio trabalho tem um lugar à altura dele.

## Positioning

É um projeto acadêmico real da PUC Minas (2025, cinco integrantes, orientação de Marco Rodrigo Costa) revisitado em 2026, sem framework e sem backend: HTML, CSS e JavaScript puros, com dados locais, PDFs gerados e referências científicas reais buscadas no OpenAlex.

## Operating Context

- Publicado no GitHub Pages pelo GitHub Actions (`.github/workflows/deploy.yml`): https://maiconvts.github.io/estudio-de-ideias
- Dados em `codigo-fonte/assets/data/projects.json` (125 projetos simulados), persistidos no `localStorage`; favoritos, submissões e moderação ficam no navegador.
- Documentação acadêmica em `documentos/` e apresentação em `apresentacao/`.

## Capabilities and Constraints

- Stack fixa: site estático em HTML, CSS e JS puros, sem build. Bibliotecas só por CDN.
- Páginas: home, projetos (busca e filtros), detalhes (PDF e leituras relacionadas), favoritos, submissão, login, admin (moderação), FAQ, contato e páginas institucionais (normas, guia de apresentação, eventos, tutoriais, ferramentas, carreiras, privacidade).
- Áreas: front-end, back-end, mobile, redes, banco de dados e segurança.
- OpenAlex sem chave e com cota por IP: cache de 24 h, 1 chamada a cada 3 s, 30 por dia por navegador e snapshot offline (`assets/data/referencias.json`).
- Os arquivos originais dos projetos (.zip, .apk) não existem; só os PDFs simulados em `assets/docs/`.
- Login e admin são simulados no front-end; não há autenticação real.

## Brand Commitments

O nome "Estúdio de Ideias" é o único compromisso. O Maicon autorizou trocar logo, cor e tipografia ("pode mudar tudo que precisar").

O crédito acadêmico (PUC Minas, curso de ADS, integrantes e orientador) aparece no README e na documentação.

## Evidence on Hand

- Projeto acadêmico real: integrantes e orientador no `README.md`; documentação completa em `documentos/`.
- Vídeos e PDF da apresentação em `apresentacao/`. **Intocáveis**: nunca mover, renomear nem apagar.
- Projetos, autores e citações são fictícios e não devem ser apresentados como reais. As referências científicas do OpenAlex são reais.
- Não há depoimentos, métricas de uso nem usuários reais. Não inventar nenhum deles.

## Product Principles

1. Funcionar de verdade. Cada tela executa o fluxo que promete, com estados de carregamento, vazio e erro.
2. Honestidade sobre o que é simulado: dados e documentos de demonstração são sempre identificados.
3. Leveza sem framework: carregar sob demanda e economizar chamadas externas.
4. A busca e a leitura vêm antes da vitrine. Quem procura um projeto chega nele em poucos passos.

## Accessibility & Inclusion

Seguir WCAG 2.2 AA (objetivo já presente na documentação de 2025: interface responsiva, acessível e intuitiva para diferentes perfis), com navegação completa por teclado e respeito a `prefers-reduced-motion`.
