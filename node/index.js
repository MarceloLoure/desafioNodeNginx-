const express = require('express');
const mysql = require('mysql');

const app = express();

const port = 8080;

const config = {
    host: 'db',
    user: 'nodedb',
    password: 'root',
    database: 'nodedb'
}

const connection = mysql.createConnection(config);

app.get('/', (req, res) => {
    // Consulta ao banco de dados para recuperar a lista de nomes
    connection.query('SELECT name FROM people', (error, results) => {
        if (error) {
            // Se houver um erro na consulta ao banco de dados, envie uma resposta de erro
            res.status(500).send('Erro ao recuperar nomes do banco de dados');
        } else {
            // Se a consulta for bem-sucedida, mapeie os resultados para extrair os nomes
            const names = results.map(result => result.name);
            
            // Construa a resposta HTML com a lista de nomes
            let htmlResponse = '<h1>Full Cycle Rocks!</h1><p>Lista de nomes cadastrados:</p><ul>';
            names.forEach(name => {
                htmlResponse += `<li>${name}</li>`;
            });
            htmlResponse += '</ul>';

            // Envie a resposta HTML completa
            res.send(htmlResponse);
        }
    });
});

app.listen(port, () => {    
    console.log(`Servidor rodando na porta: ${port}`);
});
