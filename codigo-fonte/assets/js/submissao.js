window.addEventListener('DOMContentLoaded', () => {
    console.log("submissao.js carregado e DOM pronto.");

    const form = document.getElementById('submission-form');
    
    // Verifica se a API e a função 'add' estão disponíveis
    if (!window.estudioIdeias || !window.estudioIdeias.projects || !window.estudioIdeias.projects.add) {
        console.error('ERRO: API de projetos (estudioIdeias.projects.add) não encontrada.');
        alert('Erro crítico ao carregar a página. A funcionalidade de submissão pode não funcionar.');
        return;
    }
    const addProject = window.estudioIdeias.projects.add;

    if (!form) {
        console.error('ERRO: Formulário com id "submission-form" não encontrado.');
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Formulário enviado.');

        const formData = new FormData(form);
        
        const payload = {
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            year: parseInt(formData.get('year'), 10),
            area: formData.get('area'),
            technologies: formData.get('technologies').split(',').map(tech => tech.trim()).filter(tech => tech),
            summary: formData.get('summary').trim(),
            file: formData.get('file').trim()
        };
        console.log('Payload montado:', payload);

        if (!payload.title || !payload.author || !payload.year || !payload.area || !payload.technologies.length || !payload.summary || !payload.file) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            console.warn('Validação falhou. Campos obrigatórios:', payload);
            return;
        }

        try {
            const novoProjeto = addProject(payload);
            console.log('Projeto adicionado via API:', novoProjeto);
            
            // Mensagem para o usuário comum
            alert('Seu projeto foi enviado com sucesso para moderação!\nEle poderá aparecer na plataforma após ser aprovado.');
            form.reset(); 
            
            // A linha de redirecionamento para o admin foi REMOVIDA.
            // O usuário permanece na página de submissão ou você pode redirecioná-lo
            // para outra página pública, se desejar (veja sugestões abaixo).

        } catch (error) {
            console.error('Erro ao tentar salvar o projeto via API:', error);
            alert('Ocorreu um erro ao enviar seu projeto. Verifique o console para mais detalhes e tente novamente.');
        }
    });
});