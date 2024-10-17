const fileInput = document.getElementById('images');
const fileListDiv = document.getElementById('file-list');
const dropArea = document.getElementById('drop-area');
const uploadButton = document.getElementById('upload-button');

// Adiciona eventos para arrastar e soltar
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault(); // Impede o comportamento padrão
    dropArea.classList.add('hover'); // Adiciona estilo quando arrastando
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('hover'); // Remove o estilo quando sai
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('hover');
    const files = event.dataTransfer.files;
    handleFiles(files); // Processa os arquivos arrastados
});

dropArea.addEventListener('click', () => {
    fileInput.click(); // Abre o seletor de arquivos ao clicar na área
});

fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    handleFiles(files); // Processa os arquivos selecionados
});

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        // Cria uma miniatura da imagem
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'thumbnail';
        
        fileItem.innerHTML = `
            ${file.name}
            <button type="button" onclick="removeFile(${i})">Remover</button>
        `;
        fileItem.prepend(img); // Adiciona a miniatura antes do nome do arquivo
        fileListDiv.appendChild(fileItem);
    }
    uploadButton.style.display = 'inline'; // Mostra o botão de upload
}

function removeFile(index) {
    const dt = new DataTransfer();
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        if (i !== index) {
            dt.items.add(files[i]);
        }
    }

    fileInput.files = dt.files; // Atualiza os arquivos no input
    updateFileList(); // Atualiza a lista de arquivos
}

uploadButton.addEventListener('click', async function() {
    const files = fileInput.files;
    const resultsDiv = document.getElementById('result');
    resultsDiv.innerHTML = ''; // Limpa resultados anteriores

    for (const file of files) {
        const base64 = await getBase64(file);
        try {
            const response = await fetch(`https://api.github.com/repos/seu-usuario/imagem-upload/contents/folheto-sn/${file.name}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'token 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', // Seu token de acesso
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Upload de imagem',
                    content: base64 // Converte a imagem para base64
                })
            });
            const data = await response.json();
            if (data.content) {
                resultsDiv.innerHTML += `
                    <p>${file.name}: <a href="${data.content.html_url}" target="_blank">${data.content.html_url}</a></p>
                `;
            } else {
                console.error('Erro ao fazer upload:', data);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
});

// Função para converter a imagem para Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

function updateFileList() {
    fileListDiv.innerHTML = ''; // Limpa a lista anterior

    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        // Cria uma miniatura da imagem
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'thumbnail';
        
        fileItem.innerHTML = `
            ${file.name}
            <button type="button" onclick="removeFile(${i})">Remover</button>
        `;
        fileItem.prepend(img); // Adiciona a miniatura antes do nome do arquivo
        fileListDiv.appendChild(fileItem);
    }
}
