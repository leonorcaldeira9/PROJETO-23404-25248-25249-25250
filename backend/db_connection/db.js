const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fb_db'
});
app.use(express.json());

db.connect((err) => {
    if (err) {
        console.error('Erro a ligar à base de dados:', err);
        return;
    }
    console.log('Ligado ao MySQL com sucesso!');
});

module.exports = db;