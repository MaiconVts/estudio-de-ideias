document.addEventListener('DOMContentLoaded', () => {
    console.log("Detalhes.js: DOMContentLoaded disparado.");

    // Seletores dos elementos na página de detalhes
    const projectTitleEl = document.getElementById('detail-project-title');
    const projectAuthorEl = document.getElementById('detail-project-author');
    const projectSummaryEl = document.getElementById('detail-project-summary');
    const projectYearEl = document.getElementById('detail-project-year');
    const projectAreaEl = document.getElementById('detail-project-area');
    const projectTechnologiesEl = document.getElementById('detail-project-technologies');
    const projectCitationsEl = document.getElementById('detail-project-citations');
    const projectTypeEl = document.getElementById('detail-project-type');
    const projectDisciplineEl = document.getElementById('detail-project-discipline');
    const projectDownloadLinkEl = document.getElementById('detail-project-download-link');
    
    const projectDetailCardEl = document.getElementById('project-detail-content'); // ID que demos ao article
    const projectNotFoundEl = document.getElementById('project-not-found');

    console.log("Detalhes.js: Seletores DOM definidos.", {
        projectTitleEl, projectAuthorEl, projectSummaryEl, projectYearEl,
        projectAreaEl, projectTechnologiesEl, projectCitationsEl, projectTypeEl,
        projectDisciplineEl, projectDownloadLinkEl, projectDetailCardEl, projectNotFoundEl
    });


    function getDisplayArea(areaValue) {
        if (!areaValue) return "Não especificada";
        const areaMap = {
            "networking": "Redes", "frontend": "Frontend", "backend": "Backend",
            "mobile": "Mobile", "banco-dados": "Banco de Dados", "seguranca": "Segurança da Informação"
        };
        return areaMap[areaValue.toLowerCase()] || areaValue;
    }

    async function loadProjectDetails() {
        console.log("Detalhes.js: Iniciando loadProjectDetails().");
        const urlParams = new URLSearchParams(window.location.search);
        const projectFileIdentifier = urlParams.get('file');
        console.log("Detalhes.js: projectFileIdentifier da URL:", projectFileIdentifier);

        if (!projectFileIdentifier) {
            console.error("Detalhes.js: Nenhum identificador 'file' encontrado na URL.");
            displayProjectNotFoundError("Identificador do projeto não encontrado na URL.");
            return;
        }

        // Verifica se os elementos principais do card de detalhes existem antes de prosseguir
        if (!projectDetailCardEl || !projectNotFoundEl || !projectTitleEl) {
            console.error("Detalhes.js: Um ou mais elementos HTML principais da página de detalhes não foram encontrados. Verifique os IDs no HTML.");
            // Poderia exibir uma mensagem de erro mais genérica no body se nem o projectNotFoundEl existir.
            document.body.innerHTML = "<p style='text-align:center; color:red; padding:20px;'>Erro crítico: Estrutura da página de detalhes está incompleta.</p>";
            return;
        }

        try {
            const jsonPath = './assets/data/projetosIniciais.json'; // Caminho relativo ao HTML da página de detalhes
            console.log(`Detalhes.js: Tentando buscar JSON em: ${jsonPath}`);
            const response = await fetch(jsonPath);
            console.log(`Detalhes.js: Resposta do fetch para JSON. OK: ${response.ok}, Status: ${response.status}`);

            if (!response.ok) {
                throw new Error(`Erro ao carregar dados dos projetos: ${response.status} ${response.statusText}`);
            }
            const allProjects = await response.json();
            console.log("Detalhes.js: JSON carregado e parseado. Total de projetos:", allProjects.length);

            const project = allProjects.find(p => p.file === projectFileIdentifier);

            if (project) {
                console.log("Detalhes.js: Projeto encontrado:", project);
                document.title = `${project.title || 'Detalhes do Projeto'} - Estúdio de Ideias`;

                projectTitleEl.textContent = project.title || "Título não disponível";
                projectAuthorEl.textContent = project.author || "Autor não disponível";
                projectSummaryEl.innerHTML = project.summary ? project.summary.replace(/\n/g, '<br>') : "Resumo não disponível."; // Preserva quebras de linha no resumo
                projectYearEl.textContent = project.year || "N/A";
                projectAreaEl.textContent = getDisplayArea(project.area);
                projectTechnologiesEl.textContent = Array.isArray(project.technologies) ? project.technologies.join(', ') : "N/A";
                projectCitationsEl.textContent = project.citations !== undefined ? project.citations.toString() : "N/A";
                
                projectTypeEl.textContent = project.type || "Não especificado"; 
                projectDisciplineEl.textContent = project.discipline || "Não especificada"; // Assumindo campo 'discipline' no JSON

                if (project.file) {
                    // IMPORTANTE: Defina o caminho base correto para seus arquivos de download!
                    // Se seus arquivos ZIP/PDF estiverem na pasta 'paginaHome/arquivos_download/', por exemplo:
                    const basePathForDownloads = "../paginaHome/downloads/"; // <--- AJUSTE ESTE CAMINHO!!!
                    projectDownloadLinkEl.href = `${basePathForDownloads}${project.file}`;
                    projectDownloadLinkEl.textContent = `Baixar ${project.file}`;
                } else {
                    projectDownloadLinkEl.textContent = "Arquivo não disponível";
                    projectDownloadLinkEl.removeAttribute('href');
                    projectDownloadLinkEl.style.pointerEvents = "none";
                    projectDownloadLinkEl.style.color = "grey";
                }

                projectDetailCardEl.style.display = 'block'; // Ou 'flex', etc., conforme seu CSS
                projectNotFoundEl.style.display = 'none';
                console.log("Detalhes.js: Detalhes do projeto preenchidos e exibidos.");

            } else {
                console.warn(`Detalhes.js: Projeto com arquivo "${projectFileIdentifier}" não encontrado no JSON.`);
                displayProjectNotFoundError(`O projeto especificado (${projectFileIdentifier}) não foi encontrado.`);
            }
        } catch (error) {
            console.error("Detalhes.js: Erro em loadProjectDetails:", error);
            displayProjectNotFoundError("Ocorreu um erro ao tentar carregar os dados do projeto.");
        }
    }

    function displayProjectNotFoundError(customMessage) {
        console.log("Detalhes.js: Exibindo mensagem de projeto não encontrado.");
        if(projectDetailCardEl) projectDetailCardEl.style.display = 'none';
        if(projectNotFoundEl) {
            projectNotFoundEl.style.display = 'block';
            const messageParagraph = projectNotFoundEl.querySelector('p') || projectNotFoundEl; // Tenta achar o <p> ou usa o próprio div
            let baseMessage = "O projeto que você está procurando não foi encontrado.";
            if (customMessage) {
                messageParagraph.textContent = customMessage;
            } else {
                 messageParagraph.innerHTML = `${baseMessage} <a href="./index.html">Voltar para a Home</a>.`;
            }
        } else {
            // Fallback se até o div 'project-not-found' não existir
             if(projectTitleEl) projectTitleEl.textContent = customMessage || "Projeto Não Encontrado";
        }
    }

    loadProjectDetails();
});