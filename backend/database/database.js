const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "..", "database", "kairos.db");
console.log("Banco em:", dbPath);

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
db.run(`
CREATE TABLE IF NOT EXISTS pacientes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nome TEXT NOT NULL,

    data_nascimento TEXT,

    sexo TEXT,

    observacoes TEXT,

    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);
// Tabela de amostras
db.run(`
CREATE TABLE IF NOT EXISTS amostras (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    paciente_id INTEGER NOT NULL,

    codigo TEXT UNIQUE,

    tipo TEXT,

    status TEXT DEFAULT 'Pendente',

    data_coleta TEXT,

    imagem TEXT,

    observacoes TEXT,

    FOREIGN KEY(paciente_id)
        REFERENCES pacientes(id)

)
`);
// Tabela de relatórios
db.run(`
CREATE TABLE IF NOT EXISTS relatorios (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    amostra_id INTEGER NOT NULL,

    resultado TEXT,

    laudo TEXT,

    status TEXT DEFAULT 'Em análise',

    data_emissao TEXT,

    FOREIGN KEY(amostra_id)
        REFERENCES amostras(id)

)
`);
// Tabela de notificações
db.run(`
CREATE TABLE IF NOT EXISTS notificacoes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    titulo TEXT,

    mensagem TEXT,

    lida INTEGER DEFAULT 0,

    data DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);
// Tabela das análises da IA
db.run(`
CREATE TABLE IF NOT EXISTS analises_ia (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    relatorio_id INTEGER,

    resultado TEXT,

    confianca REAL,

    tempo_processamento REAL,

    FOREIGN KEY(relatorio_id)
        REFERENCES relatorios(id)

)
`);

});

module.exports = db;