const db = require("../database/database");

// Cadastrar paciente
function criarPaciente(paciente) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO pacientes
            (nome, data_nascimento, sexo, observacoes, usuario_id)
            VALUES (?, ?, ?, ?, ?)`,

            [
                paciente.nome,
                paciente.data_nascimento,
                paciente.sexo,
                paciente.observacoes,
                paciente.usuario_id
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


// Listar pacientes de um usuário
function listarPacientes(usuario_id) {

    return new Promise((resolve, reject) => {

        db.all(

            `SELECT *
             FROM pacientes
             WHERE usuario_id = ?
             ORDER BY nome`,

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


// Excluir paciente
function excluirPaciente(id, usuario_id) {

    return new Promise((resolve, reject) => {

        db.run(

            `DELETE FROM pacientes
             WHERE id = ?
             AND usuario_id = ?`,

            [id, usuario_id],

            function(err) {

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
function atualizarPaciente(id, paciente, usuario_id) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE pacientes
             SET nome = ?,
                 data_nascimento = ?,
                 sexo = ?,
                 observacoes = ?
             WHERE id = ?
             AND usuario_id = ?`,

            [
                paciente.nome,
                paciente.data_nascimento,
                paciente.sexo,
                paciente.observacoes,
                id,
                usuario_id
            ],

            function(err) {

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