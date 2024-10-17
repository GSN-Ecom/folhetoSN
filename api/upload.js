// api/upload.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fileName, content } = req.body;

        // Configurações da requisição para o GitHub
        const url = `https://api.github.com/repos/GSN-Ecom/folhetoSN/contents/folheto-sn/${fileName}`;
        const token = process.env.GITHUB_TOKEN; // Obtendo o token da variável de ambiente

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`, // Usando o token da variável de ambiente
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Upload de imagem',
                    content: content
                })
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json(data);
            } else {
                res.status(response.status).json({ error: data.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao fazer upload' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
