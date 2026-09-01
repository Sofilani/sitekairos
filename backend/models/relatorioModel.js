const db = require("../database/database");

// Criar relatório
function criarRelatorio(relatorio){

    return new Promise((resolve,reject)=>{

        db.run(

            `INSERT INTO relatorios
            (amostra_id, resultado, laudo, status, data_emissao)
            VALUES (?, ?, ?, ?, ?)`,

            [
                relatorio.amostra_id,
                relatorio.resultado,
                relatorio.laudo,
                relatorio.status,
                relatorio.data_emissao
            ],

            function(err){

                if(err){
                    reject(err);
                }else{
                    resolve(this.lastID);
                }

            }

        );

    });

}

// Listar relatórios
function listarRelatorios(){

    return new Promise((resolve,reject)=>{

        db.all(

            `SELECT

                relatorios.id,

                pacientes.nome AS paciente,

                amostras.tipo,

                relatorios.resultado,

                relatorios.status

            FROM relatorios

            INNER JOIN amostras
                ON amostras.id = relatorios.amostra_id

            INNER JOIN pacientes
                ON pacientes.id = amostras.paciente_id

            ORDER BY relatorios.id DESC`,

            [],

            (err,rows)=>{

                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }

            }

        );

    });

}
// Buscar um relatório específico
// ===============================
// BUSCAR UM RELATÓRIO ESPECÍFICO
// ===============================

// ===============================
// BUSCAR UM RELATÓRIO ESPECÍFICO
// ===============================

function buscarRelatorio(id) {

    return new Promise((resolve, reject) => {

        db.get(

            `SELECT

                relatorios.id,
                relatorios.amostra_id,

                pacientes.nome AS paciente,

                amostras.tipo,
                amostras.data_coleta,

                relatorios.resultado,
                relatorios.laudo,
                relatorios.status,
                relatorios.data_emissao

            FROM relatorios

            INNER JOIN amostras
                ON amostras.id = relatorios.amostra_id

            INNER JOIN pacientes
                ON pacientes.id = amostras.paciente_id

            WHERE relatorios.id = ?`,

            [id],

            (err, row) => {

                if (err) {

                    reject(err);

                    return;

                }

                if (!row) {

                    resolve(null);

                    return;

                }

                // ===============================
                // BUSCAR IMAGENS DA AMOSTRA
                // ===============================

                db.all(

                    `SELECT

                        id,
                        amostra_id,
                        arquivo,
                        camera,
                        data_captura

                    FROM imagens_amostras

                    WHERE amostra_id = ?

                    ORDER BY id DESC`,

                    [row.amostra_id],

                    (err, imagens) => {

                        if (err) {

                            reject(err);

                            return;

                        }

                        row.imagens = imagens;

                        resolve(row);

                    }

                );

            }

        );

    });

}
// Atualizar resultado e laudo
function atualizarRelatorio(id, resultado, laudo) {

    return new Promise((resolve, reject) => {

        db.run(
            `UPDATE relatorios
             SET resultado = ?, laudo = ?
             WHERE id = ?`,

            [
                resultado,
                laudo,
                id
            ],

            function(err) {

                if (err) {

                    reject(err);

                } else {

                    resolve(this.changes);

                }

            }
        );

    });

}

// ==========================================
// ATUALIZAR RELATÓRIO AUTOMATICAMENTE
// ==========================================

function atualizarAutomaticamente(
    id,
    resultado,
    laudo,
    status
) {

    return new Promise((resolve, reject) => {

        db.run(

            `
            UPDATE relatorios

            SET
                resultado = ?,
                laudo = ?,
                status = ?

            WHERE id = ?

            `,

            [
                resultado,
                laudo,
                status,
                id
            ],

            function(err) {

                if (err) {

                    reject(err);

                } else {

                    resolve(this.changes);

                }

            }

        );

    });

}

module.exports = {

    criarRelatorio,
    listarRelatorios,
    buscarRelatorio,
    atualizarRelatorio,
    atualizarAutomaticamente

};
