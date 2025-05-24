document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Panel JS: DOMContentLoaded disparado.");

    const projectsTableBody = document.querySelector('.table tbody');
    const paginationContainer = document.querySelector('.admin-pagination ul');

    let allProjectsData = []; // Para guardar todos os projetos do JSON
    let currentProjectsView = []; // Projetos atualmente filtrados/ordenados (para o painel, inicialmente todos)
    const ITEMS_PER_PAGE_ADMIN = 10; // Quantos projetos por página na tabela
    let currentPageAdmin = 1;

    // --- 1. CARREGAMENTO INICIAL DOS DADOS ---
    async function fetchAdminProjects() {
        console.log("Admin Panel JS: Iniciando fetchAdminProjects().");
        // Ajuste este caminho se o seu admin_panel.html estiver em um local diferente
        // em relação à paginaHome/projetosIniciais.json
        const jsonPath = './assets/data/projetosIniciais.json';
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Erro HTTP ao buscar projetos: ${response.status}`);
            }
            allProjectsData = await response.json();
            currentProjectsView = [...allProjectsData]; // Inicialmente, todos os projetos
            console.log(`Admin Panel JS: ${allProjectsData.length} projetos carregados.`);
            
            if (!projectsTableBody) {
                console.error("Admin Panel JS: Elemento tbody da tabela não encontrado!");
                return;
            }
            if (!paginationContainer) {
                console.warn("Admin Panel JS: Container da paginação não encontrado.");
            }
            
            renderTablePage(); // Renderiza a primeira página da tabela
            setupPagination();

        } catch (error) {
            console.error("Admin Panel JS: Falha ao carregar projetos para o painel:", error);
            if (projectsTableBody) {
                projectsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Falha ao carregar projetos. ${error.message}</td></tr>`;
            }
        }
    }

    // --- 2. RENDERIZAÇÃO DA TABELA E PAGINAÇÃO ---
    function renderTablePage() {
        if (!projectsTableBody) return;
        projectsTableBody.innerHTML = ''; // Limpa a tabela

        if (currentProjectsView.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum projeto para moderação no momento.</td></tr>';
            updatePaginationButtons();
            return;
        }

        const startIndex = (currentPageAdmin - 1) * ITEMS_PER_PAGE_ADMIN;
        const endIndex = startIndex + ITEMS_PER_PAGE_ADMIN;
        const projectsForCurrentPage = currentProjectsView.slice(startIndex, endIndex);

        projectsForCurrentPage.forEach(project => {
            const row = projectsTableBody.insertRow();
            row.innerHTML = `
                <td><a href="./detalhes.html?file=${encodeURIComponent(project.file || '')}" class="details-link" title="Ver detalhes do projeto">${project.title || 'N/A'}</a></td>
                <td>${project.author || 'N/A'}</td>
                <td>${project.year || 'N/A'}</td> <td><span class="status-pending">Pendente</span></td> <td>
                    <div class="action-buttons-group">
                        <button type="button" class="action-btn approve-btn" title="Aprovar" data-project-title="${project.title || ''}"><i class="fas fa-check"></i> Aprovar</button>
                        <button type="button" class="action-btn reject-btn" title="Rejeitar" data-project-title="${project.title || ''}"><i class="fas fa-times"></i> Rejeitar</button>
                        <button type="button" class="action-btn correct-btn" title="Solicitar Correções" data-project-title="${project.title || ''}"><i class="fas fa-edit"></i> Correção</button>
                    </div>
                </td>
            `;
        });
        addModerationButtonListeners();
        updatePaginationButtons();
    }

    function setupPagination() {
        if (!paginationContainer || currentProjectsView.length === 0) return;
        
        const totalPages = Math.ceil(currentProjectsView.length / ITEMS_PER_PAGE_ADMIN);
        paginationContainer.innerHTML = ''; // Limpa botões existentes

        // Botão "Anterior"
        const prevLi = document.createElement('li');
        const prevLink = document.createElement('a');
        prevLink.href = "#";
        prevLink.textContent = "Anterior";
        prevLink.classList.add('page-link');
        if (currentPageAdmin === 1) {
            prevLi.classList.add('disabled'); // Usa a classe do seu HTML (se for Bootstrap, senão, estilizar)
        }
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPageAdmin > 1) {
                currentPageAdmin--;
                renderTablePage();
            }
        });
        prevLi.appendChild(prevLink);
        paginationContainer.appendChild(prevLi);

        // Números das Páginas (simplificado para este exemplo)
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            const pageLink = document.createElement('a');
            pageLink.href = "#";
            pageLink.textContent = i;
            pageLink.classList.add('page-link');
            if (i === currentPageAdmin) {
                pageLink.classList.add('active'); // Usa a classe do seu HTML
            }
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                currentPageAdmin = i;
                renderTablePage();
            });
            pageLi.appendChild(pageLink);
            paginationContainer.appendChild(pageLi);
        }

        // Botão "Próxima"
        const nextLi = document.createElement('li');
        const nextLink = document.createElement('a');
        nextLink.href = "#";
        nextLink.textContent = "Próxima";
        nextLink.classList.add('page-link');
        if (currentPageAdmin === totalPages) {
            nextLi.classList.add('disabled');
        }
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPageAdmin < totalPages) {
                currentPageAdmin++;
                renderTablePage();
            }
        });
        nextLi.appendChild(nextLink);
        paginationContainer.appendChild(nextLi);
    }
    
    function updatePaginationButtons() {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(currentProjectsView.length / ITEMS_PER_PAGE_ADMIN);
        const links = paginationContainer.querySelectorAll('.page-link');

        links.forEach(link => {
            const parentLi = link.parentElement;
            if (link.textContent === "Anterior") {
                parentLi.classList.toggle('disabled', currentPageAdmin === 1);
            } else if (link.textContent === "Próxima") {
                parentLi.classList.toggle('disabled', currentPageAdmin === totalPages || totalPages === 0);
            } else {
                // Para os números
                const pageNum = parseInt(link.textContent);
                if (pageNum === currentPageAdmin) {
                    link.classList.add('active');
                     parentLi.classList.add('active'); // Se a classe active for no LI
                } else {
                    link.classList.remove('active');
                    parentLi.classList.remove('active');
                }
            }
        });
         // Esconde paginação se só tiver uma página ou nenhuma
        paginationContainer.style.display = totalPages > 1 ? 'flex' : 'none';
    }


    // --- 3. AÇÕES DE MODERAÇÃO ---
    function addModerationButtonListeners() {
        document.querySelectorAll('.action-btn').forEach(button => {
            // Remove listener antigo para evitar duplicação se a função for chamada múltiplas vezes
            button.replaceWith(button.cloneNode(true)); 
        });
        // Adiciona novos listeners aos botões clonados
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', handleModerationAction);
        });
    }

    function handleModerationAction(event) {
        const button = event.currentTarget; // Usar currentTarget é mais seguro
        const action = button.title;
        const projectTitle = button.dataset.projectTitle; // Pega do data attribute

        if (confirm(`Tem certeza que deseja "${action}" o projeto "${projectTitle}"?`)) {
            console.log(`Admin Panel JS: Ação "${action}" selecionada para "${projectTitle}". (Simulado)`);
            
            const row = button.closest('tr');
            const statusCell = row.querySelector('td:nth-child(4)'); // A 4ª célula é o Status
            const actionsCell = button.closest('td'); // A célula que contém os botões

            let newStatusHTML = '';
            switch (action) {
                case 'Aprovar':
                    newStatusHTML = '<span class="status-approved">Aprovado</span>';
                    break;
                case 'Rejeitar':
                    newStatusHTML = '<span class="status-rejected">Rejeitado</span>';
                    break;
                case 'Solicitar Correções': // RF-10
                    newStatusHTML = '<span class="status-pending">Correção Solicitada</span>'; // Você precisará de um estilo para .status-correction-requested
                    break;
                default:
                    alert(`Funcionalidade "${action}" para "${projectTitle}" não implementada completamente.`);
                    return; // Sai se a ação não for uma das esperadas para mudar o status
            }

            if (statusCell) statusCell.innerHTML = newStatusHTML;
            if (actionsCell) actionsCell.innerHTML = '<span class="moderated-text">Já moderado</span>';

            // Aqui você faria a chamada AJAX para o backend para persistir a mudança.
            // Ex: updateProjectStatusOnServer(projectId, newStatus);
        }
    }

    // --- Inicialização ---
    if (projectsTableBody) { // Garante que a tabela existe antes de tentar buscar os dados
        fetchAdminProjects();
    } else {
        console.error("Admin Panel JS: Container da tabela (tbody) não encontrado no carregamento inicial.");
    }
});