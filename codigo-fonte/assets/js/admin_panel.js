window.addEventListener('DOMContentLoaded', () => {
    // A API está disponível globalmente através de window.estudioIdeias
    const { projects } = window.estudioIdeias;
    const tabelaBody = document.getElementById('submissoes-tbody');

    function renderTable() {
        const submissions = projects.getSubmissions();
        tabelaBody.innerHTML = ''; // Limpa a tabela

        if (submissions.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhuma submissão para análise.</td></tr>';
            return;
        }

        submissions.forEach(sub => {
            const tr = document.createElement('tr');
            const dataCriacao = new Date(sub.createdAt).toLocaleDateString('pt-BR');
            
            tr.innerHTML = `
                <td><a href="#" class="details-link">${sub.title}</a></td>
                <td>${sub.author}</td>
                <td>${dataCriacao}</td>
                <td><span class="status-${(sub.status || 'Pendente').toLowerCase().replace(' ', '-')}">${sub.status || 'Pendente'}</span></td>
                <td>
                    ${sub.status === 'Pendente' || sub.status === 'Correção Solicitada' ? `
                    <div class="action-buttons-group">
                        <button class="action-btn approve-btn" data-id="${sub.id}"><i class="fas fa-check"></i> Aprovar</button>
                        <button class="action-btn reject-btn" data-id="${sub.id}"><i class="fas fa-times"></i> Rejeitar</button>
                    </div>
                    ` : `<span class="moderated-text">Já moderado</span>`}
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    }

    function handleModeration(event) {
        const button = event.target.closest('.action-btn');
        if (!button) return;

        const id = button.dataset.id;
        let newStatus = '';

        if (button.classList.contains('approve-btn')) newStatus = 'Aprovado';
        if (button.classList.contains('reject-btn')) newStatus = 'Rejeitado';

        if (newStatus) {
            projects.updateStatus(id, newStatus);
            // Adicione sua função de alerta visual aqui, se tiver uma (RNF-03)
            alert(`Projeto marcado como "${newStatus}"!`); 
            renderTable(); // Re-renderiza a tabela para mostrar as mudanças
        }
    }

    // Adiciona o listener de eventos à tabela
    tabelaBody.addEventListener('click', handleModeration);

    // Renderiza a tabela na carga inicial da página
    renderTable();
});