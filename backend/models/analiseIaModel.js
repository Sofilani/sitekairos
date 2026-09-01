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
                analises_ia.id,
                analises_ia.relatorio_id,
                analises_ia.imagem_id,
                analises_ia.resultado,
                analises_ia.confianca,
                analises_ia.tempo_processamento,

                imagens_amostras.arquivo,
                imagens_amostras.camera,
                imagens_amostras.data_captura

            FROM analises_ia

            LEFT JOIN imagens_amostras
                ON analises_ia.imagem_id = imagens_amostras.id

            WHERE analises_ia.relatorio_id = ?

            ORDER BY analises_ia.id DESC
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

// ==========================================
// BUSCAR ANÁLISES DE UMA AMOSTRA
// ==========================================

function listarPorAmostra(amostra_id) {

    return new Promise((resolve, reject) => {

        db.all(

            `
            SELECT

                analises_ia.id,
                analises_ia.relatorio_id,
                analises_ia.imagem_id,
                analises_ia.resultado,
                analises_ia.confianca,
                analises_ia.tempo_processamento,

                imagens_amostras.arquivo,
                imagens_amostras.camera,
                imagens_amostras.data_captura

            FROM analises_ia

            INNER JOIN imagens_amostras
                ON analises_ia.imagem_id =
                   imagens_amostras.id

            WHERE imagens_amostras.amostra_id = ?

            ORDER BY analises_ia.id DESC

            `,

            [amostra_id],

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
    listarPorRelatorio,
    listarPorAmostra

};