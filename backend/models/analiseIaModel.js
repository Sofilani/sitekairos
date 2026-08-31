const db = require("../database/database");


// ===============================
// SALVAR ANÁLISE DA IA
// ===============================

function salvarAnalise(analise) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO analises_ia
            (
                relatorio_id,
                imagem_id,
                resultado,
                confianca,
                tempo_processamento
            )
            VALUES (?, ?, ?, ?, ?)`,

            [
                analise.relatorio_id,
                analise.imagem_id,
                analise.resultado,
                analise.confianca,
                analise.tempo_processamento
            ],

            function(err) {

                if (err) {

                    reject(err);

                } else {

                    resolve(this.lastID);

                }

            }

        );

    });

}

// ===============================
// BUSCAR ANÁLISES DO RELATÓRIO
// ===============================

function listarPorRelatorio(relatorio_id) {

    return new Promise((resolve, reject) => {

        db.all(
            `
            SELECT
                id,
                relatorio_id,
                resultado,
                confianca,
                tempo_processamento
            FROM analises_ia
            WHERE relatorio_id = ?
            ORDER BY id DESC
            `,
            [relatorio_id],
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

    salvarAnalise,
    listarPorRelatorio

};