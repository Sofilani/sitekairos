const db = require("../database/database");

// =====================================================
// Criar amostra
// =====================================================

function criarAmostra(amostra) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO amostras
            (paciente_id, tipo, status, data_coleta, observacoes, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)`,

            [
                amostra.paciente_id,
                amostra.tipo,
                amostra.status,
                amostra.data_coleta,
                amostra.observacoes,
                amostra.usuario_id
            ],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }

            }

        );

    });

}


// =====================================================
// Listar amostras do usuário
// =====================================================

function listarAmostras(usuario_id) {

    return new Promise((resolve, reject) => {

        db.all(

            `SELECT
                amostras.id,
                pacientes.nome AS paciente,
                amostras.tipo,
                amostras.status,
                amostras.data_coleta

            FROM amostras

            INNER JOIN pacientes
            ON pacientes.id = amostras.paciente_id

            WHERE amostras.usuario_id = ?

            ORDER BY amostras.id DESC`,

            [usuario_id],

            (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

            }

        );

    });

}


module.exports = {

    criarAmostra,
    listarAmostras

};