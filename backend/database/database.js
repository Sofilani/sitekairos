const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "kairos.db");

const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {
        console.error("Erro ao conectar:", err.message);
    } else {

        console.log("Banco SQLite conectado!");

        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                nome TEXT NOT NULL,

                email TEXT UNIQUE NOT NULL,

                senha TEXT NOT NULL,

                cargo TEXT DEFAULT 'usuario',

                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP

            )
        `);

    }

});

module.exports = db;