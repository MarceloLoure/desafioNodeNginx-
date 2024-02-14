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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function createDatabaseAndTable() {
    connection.query('CREATE DATABASE IF NOT EXISTS nodedb', (error) => {
        if (error) {
            console.error('Erro ao criar o banco de dados:', error);
        } else {
            connection.query('USE nodedb', (error) => {
                if (error) {
                    console.error('Erro ao selecionar o banco de dados:', error);
                } else {
                    connection.query('CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY (id))', (error) => {
                        if (error) {
                            console.error('Erro ao criar a tabela:', error);
                        } else {
                            console.log('Banco de dados e tabela criados com sucesso.');
                        }
                    });
                }
            });
        }
    });
}

createDatabaseAndTable();

app.all('/', (req, res) => {
    if (req.method === 'GET') {
        connection.query('SELECT name FROM people', (error, results) => {
            if (error) {
                res.status(500).send('Erro ao recuperar nomes do banco de dados');
            } else {
                const names = results.map(result => result.name);
                
                let htmlResponse = `
                    <h1>Insira o nome</h1>
                    <form method="post">
                        <label for="name">Nome:</label>
                        <input type="text" id="name" name="name" required>
                        <button type="submit">Adicionar Nome</button>
                    </form>
                    <h2>Full Cycle Rocks!</h2>
                    <p>Lista de nomes cadastrados:</p>
                    <ul>`;
                names.forEach(name => {
                    htmlResponse += `<li>${name}</li>`;
                });
                htmlResponse += '</ul>';
                res.send(htmlResponse);
            }
        });
    } else if (req.method === 'POST') {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send('Nome é obrigatório');
        }

        connection.query('INSERT INTO people (name) VALUES (?)', [name], (error, results) => {
            if (error) {
                res.status(500).send('Erro ao adicionar nome ao banco de dados');
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.status(405).send('Método não permitido');
    }
});

app.listen(port, () => {    
    console.log(`Servidor rodando na porta: ${port}`);
});
