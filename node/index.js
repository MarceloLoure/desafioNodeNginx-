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
    connection.query('SELECT name FROM people', (error, results) => {
        if (error) {
            res.status(500).send('Erro ao recuperar nomes do banco de dados');
        } else {
            const names = results.map(result => result.name);
            
            let htmlResponse = '<h1>Full Cycle Rocks!</h1><p>Lista de nomes cadastrados:</p><ul>';
            names.forEach(name => {
                htmlResponse += `<li>${name}</li>`;
            });
            htmlResponse += '</ul>';

            res.send(htmlResponse);
        }
    });
});

app.listen(port, () => {    
    console.log(`Servidor rodando na porta: ${port}`);
});
