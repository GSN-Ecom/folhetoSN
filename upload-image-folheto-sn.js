const dropArea = document.getElementById('drop-area');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');
const resultDiv = document.getElementById('result');
let filesToUpload = [];

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('active');
    handleFiles(event.dataTransfer.files);
});

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        filesToUpload.push(files[i]);
        displayFile(files[i]);
    }
}

function displayFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.innerHTML = `
            <img src="${event.target.result}" alt="${file.name}">
            <p>${file.name}</p>
            <button onclick="removeFile('${file.name}')">Remover</button>
        `;
        gallery.appendChild(thumbnail);
    };
    reader.readAsDataURL(file);
}

function removeFile(fileName) {
    filesToUpload = filesToUpload.filter(file => file.name !== fileName);
    gallery.innerHTML = ''; // Limpa a galeria
    filesToUpload.forEach(file => displayFile(file)); // Redesenha a galeria
}

uploadBtn.addEventListener('click', async () => {
    for (const file of filesToUpload) {
        const base64 = await toBase64(file);
        await uploadImage(file, base64);
    }
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

async function uploadImage(file, base64) {
    try {
        const response = await fetch(`https://api.github.com/repos/GSN-Ecom/folhetoSN/contents/folheto-sn/${file.name}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'token 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', // Seu token aqui
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Upload de imagem',
                content: base64
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao fazer upload:', errorData);
            resultDiv.innerHTML += `<p>Erro ao fazer upload de ${file.name}: ${errorData.message}</p>`;
        } else {
            const jsonData = await response.json();
            resultDiv.innerHTML += `<p>${file.name} foi carregado com sucesso! <a href="${jsonData.content.html_url}" target="_blank">Ver imagem</a></p>`;
        }
    } catch (error) {
        console.error('Erro inesperado:', error);
        resultDiv.innerHTML += `<p>Erro inesperado ao fazer upload de ${file.name}.</p>`;
    }
}
