// Example: Add confirmation dialogs or interaction logic
document.querySelectorAll('.btn-approve, .btn-reject, .btn-correct').forEach(button => {
    button.addEventListener('click', function(event) {
        const action = this.title;
        const projectTitle = this.closest('tr').querySelector('.details-link').textContent;
        // Example confirmation - replace with actual logic (e.g., AJAX call)
        if (confirm(`Tem certeza que deseja "${action}" o projeto "${projectTitle}"?`)) {
            console.log(`Ação "${action}" selecionada para "${projectTitle}".`);
            // Here you would typically send a request to the server
            // For demonstration, we could change the status locally:
            const statusCell = this.closest('tr').querySelector('td:nth-child(4)');
            if (action === 'Aprovar') {
                statusCell.innerHTML = '<span class="status-approved">Aprovado</span>';
                this.closest('.btn-group').innerHTML = '<small class="text-muted">Já moderado</small>';
            } else if (action === 'Rejeitar') {
                statusCell.innerHTML = '<span class="status-rejected">Rejeitado</span>';
                this.closest('.btn-group').innerHTML = '<small class="text-muted">Já moderado</small>';
            } else {
                alert(`Funcionalidade "${action}" para "${projectTitle}" ainda não implementada.`);
            }
        }
    });
});

