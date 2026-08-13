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
function buscarRelatorio(id) {

    return new Promise((resolve, reject) => {

        db.get(

            `SELECT

                relatorios.id,
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

                } else {

                    resolve(row);

                }

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

module.exports = {

    criarRelatorio,
    listarRelatorios,
    buscarRelatorio,
    atualizarRelatorio

};
