window.addEventListener('DOMContentLoaded', () => {
    console.log("admin_panel.js carregado e DOM pronto.");

    // Verifica se a API de projetos está disponível no escopo global
    if (!window.estudioIdeias || !window.estudioIdeias.projects) {
        console.error('ERRO CRÍTICO: API window.estudioIdeias.projects não encontrada!');
        const tbody = document.getElementById('submissoes-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Erro crítico: API de projetos não carregada. O painel não pode funcionar.</td></tr>';
        }
        return; // Interrompe a execução do script se a API não estiver disponível
    }

    const { projects } = window.estudioIdeias; // Pega o módulo 'projects' da API global
    const tabelaBody = document.getElementById('submissoes-tbody');

    // Verifica se o elemento da tabela foi encontrado
    if (!tabelaBody) {
        console.error('ERRO CRÍTICO: Elemento com ID "submissoes-tbody" não encontrado no HTML.');
        return; // Interrompe se a tabela não for encontrada
    }

    // --- FUNÇÃO PARA EXIBIR ALERTAS VISUAIS ---
    function exibirAlerta(mensagem, tipo) {
        const alertaDiv = document.createElement("div");
        alertaDiv.className = `alerta ${tipo}`; // Certifique-se que as classes CSS 'alerta', 'sucesso', 'erro' existam
        alertaDiv.textContent = mensagem;
        document.body.appendChild(alertaDiv);
        
        // Remove o alerta após 3 segundos
        setTimeout(() => {
            if (alertaDiv.parentNode) { // Verifica se o alerta ainda está no DOM
                alertaDiv.remove();
            }
        }, 3000);
    }

    // --- FUNÇÃO PARA RENDERIZAR A TABELA DE SUBMISSÕES ---
    function renderTable() {
        // Verifica se as funções necessárias da API existem
        if (!projects.getSubmissions || typeof projects.getSubmissions !== 'function') {
            console.error("ERRO: Função projects.getSubmissions() não encontrada ou não é uma função na API.");
            tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Erro ao carregar submissões: API incompleta.</td></tr>';
            return;
        }

        const submissions = projects.getSubmissions(); // Pega apenas os projetos que não estão 'Aprovado'
        tabelaBody.innerHTML = ''; // Limpa a tabela antes de preencher

        if (submissions.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhuma submissão para análise no momento.</td></tr>';
            return;
        }

        submissions.forEach(sub => {
            const tr = document.createElement('tr');
            // Usa 'createdAt' se existir, senão usa 'id' (timestamp) como fallback para a data
            const dataCriacao = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('pt-BR') : (sub.id ? new Date(sub.id).toLocaleDateString('pt-BR') : 'Data Indisponível');
            
            let actionButtonsHTML = '';
            if (sub.status === 'Pendente') {
                actionButtonsHTML = `
                    <div class="action-buttons-group">
                        <button type="button" class="action-btn approve-btn" title="Aprovar" data-id="${sub.id}">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                        <button type="button" class="action-btn reject-btn" title="Rejeitar" data-id="${sub.id}">
                            <i class="fas fa-times"></i> Rejeitar
                        </button>
                        <button type="button" class="action-btn correct-btn" title="Solicitar Correção" data-id="${sub.id}">
                            <i class="fas fa-edit"></i> Correção
                        </button>
                    </div>
                `;
            } else if (sub.status === 'Correção Solicitada') {
                actionButtonsHTML = `
                    <div class="action-buttons-group">
                         <button type="button" class="action-btn approve-btn" title="Aprovar Após Correção" data-id="${sub.id}">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                        <button type="button" class="action-btn reject-btn" title="Rejeitar Mesmo Após Correção" data-id="${sub.id}">
                            <i class="fas fa-times"></i> Rejeitar
                        </button>
                    </div>
                `;
            } else { // Status 'Aprovado' ou 'Rejeitado' não são pegos por getSubmissions, mas por segurança:
                actionButtonsHTML = `<span class="moderated-text">Status: ${sub.status}</span>`;
            }
            
            // Gera a classe de status dinamicamente, tratando espaços.
            const statusClass = (sub.status || 'pendente').toLowerCase().replace(/\s+/g, '-');

            tr.innerHTML = `
                <td><a href="./detalhes.html?id=${sub.id}" class="details-link" title="Ver detalhes do projeto">${sub.title || 'Sem título'}</a></td>
                <td>${sub.author || 'Sem autor'}</td>
                <td>${dataCriacao}</td>
                <td><span class="status-${statusClass}">${sub.status || 'Pendente'}</span></td>
                <td>${actionButtonsHTML}</td>
            `;
            tabelaBody.appendChild(tr);
        });
    }

    // --- FUNÇÃO PARA LIDAR COM AÇÕES DE MODERAÇÃO ---
    function handleModeration(event) {
        const button = event.target.closest('.action-btn');
        if (!button) return; // Sai se o clique não foi em um botão de ação

        const idDoProjeto = button.dataset.id;
        let novoStatus = '';
        let mensagemConfirmacao = '';

        if (button.classList.contains('approve-btn')) {
            novoStatus = 'Aprovado';
            mensagemConfirmacao = 'Tem certeza que deseja APROVAR este projeto?';
        } else if (button.classList.contains('reject-btn')) {
            novoStatus = 'Rejeitado';
            mensagemConfirmacao = 'Tem certeza que deseja REJEITAR este projeto?';
        } else if (button.classList.contains('correct-btn')) {
            novoStatus = 'Correção Solicitada';
            mensagemConfirmacao = 'Tem certeza que deseja solicitar CORREÇÕES para este projeto?';
        }

        if (novoStatus && mensagemConfirmacao) {
            if (confirm(mensagemConfirmacao)) { // Pede confirmação ao usuário
                // Verifica se a função de update da API existe
                if (!projects.updateStatus || typeof projects.updateStatus !== 'function') {
                    console.error("ERRO: Função projects.updateStatus() não encontrada ou não é uma função na API.");
                    exibirAlerta("Erro crítico: Não foi possível atualizar o status do projeto.", "erro");
                    return;
                }
                projects.updateStatus(idDoProjeto, novoStatus); // Chama a função da API para atualizar o status
                
                let mensagemFeedback = '';
                if (novoStatus === 'Aprovado') {
                    mensagemFeedback = 'Projeto APROVADO com sucesso!';
                } else if (novoStatus === 'Rejeitado') {
                    mensagemFeedback = 'Projeto REJEITADO.';
                } else if (novoStatus === 'Correção Solicitada') {
                    mensagemFeedback = 'CORREÇÃO SOLICITADA para o projeto.';
                }
                
                exibirAlerta(mensagemFeedback, 'sucesso'); // Exibe o feedback visual
                renderTable(); // Re-renderiza a tabela para refletir a mudança de status
            }
        }
    }

    // Adiciona o listener de eventos à tabela (delegação de eventos)
    tabelaBody.addEventListener('click', handleModeration);

    // Renderiza a tabela na carga inicial da página
    renderTable();
});