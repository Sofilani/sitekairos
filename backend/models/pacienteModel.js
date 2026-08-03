const db = require("../database/database");

// Cadastrar paciente
function criarPaciente(paciente) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO pacientes
            (nome, data_nascimento, sexo, observacoes)
            VALUES (?, ?, ?, ?)`,

            [
                paciente.nome,
                paciente.data_nascimento,
                paciente.sexo,
                paciente.observacoes
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

// Listar pacientes
function listarPacientes(){

    return new Promise((resolve,reject)=>{

        db.all(

            "SELECT * FROM pacientes ORDER BY nome",

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
// Excluir paciente
function excluirPaciente(id) {

    return new Promise((resolve, reject) => {

        db.run(

            "DELETE FROM pacientes WHERE id = ?",

            [id],

            function (err) {

                if (err) {

                    reject(err);

                } else {

                    resolve();

                }

            }

        );

    });

}

// Atualizar paciente
function atualizarPaciente(id, paciente) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE pacientes
             SET nome = ?,
                 data_nascimento = ?,
                 sexo = ?,
                 observacoes = ?
             WHERE id = ?`,

            [
                paciente.nome,
                paciente.data_nascimento,
                paciente.sexo,
                paciente.observacoes,
                id
            ],

            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }

            }

        );

    });

}

module.exports = {

    criarPaciente,
    listarPacientes,
    excluirPaciente,
    atualizarPaciente

};