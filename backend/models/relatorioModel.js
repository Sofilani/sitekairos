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

module.exports = {

    criarRelatorio,
    listarRelatorios

};