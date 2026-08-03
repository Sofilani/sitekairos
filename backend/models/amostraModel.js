const db = require("../database/database");

// Cadastrar amostra
function criarAmostra(amostra) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO amostras
            (paciente_id, codigo, tipo, status, data_coleta, observacoes)
            VALUES (?, ?, ?, ?, ?, ?)`,

            [
                amostra.paciente_id,
                amostra.codigo,
                amostra.tipo,
                amostra.status,
                amostra.data_coleta,
                amostra.observacoes
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

// Listar amostras
function listarAmostras(){

    return new Promise((resolve,reject)=>{

        db.all(

            `
            SELECT
                amostras.*,
                pacientes.nome AS paciente

            FROM amostras

            JOIN pacientes
            ON pacientes.id = amostras.paciente_id

            ORDER BY amostras.id DESC
            `,

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

    criarAmostra,
    listarAmostras

};