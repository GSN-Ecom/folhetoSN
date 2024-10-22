require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Para usar o fetch no servidor
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos da pasta 'public'

// Rota para fazer o upload
app.put('/upload', async (req, res) => {
    const { fileName, fileContent } = req.body;
    const token = process.env.GITHUB_TOKEN;

    try {
        const response = await fetch(`https://api.github.com/repos/GSN-Ecom/folhetoSN/contents/folheto-sn/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Upload de imagem',
                content: fileContent
            })
        });
        const data = await response.json();
        if (data.content) {
            res.status(200).json({ link: `https://gsn-ecom.github.io/folhetoSN/folheto-sn/${fileName}` });
        } else {
            res.status(500).json({ error: 'Erro ao fazer upload' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer upload' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
