const pacienteModel = require("../models/pacienteModel");


// Cadastrar paciente
async function cadastrar(req, res) {

    console.log("Body recebido:", req.body);

    try {

        if (!req.body.usuario_id) {

            return res.status(400).json({
                erro: "Usuário não identificado."
            });

        }

        const id = await pacienteModel.criarPaciente(req.body);

        res.status(201).json({

            mensagem: "Paciente cadastrado com sucesso!",
            id

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

}


// Listar pacientes
async function listar(req, res) {

    try {

        const usuario_id = req.query.usuario_id;

        if (!usuario_id) {

            return res.status(400).json({
                erro: "Usuário não identificado."
            });

        }

        const pacientes =
            await pacienteModel.listarPacientes(usuario_id);

        res.json(pacientes);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

}


// Excluir paciente
async function excluir(req, res) {

    try {

        const usuario_id = req.query.usuario_id;

        if (!usuario_id) {

            return res.status(400).json({
                erro: "Usuário não identificado."
            });

        }

        await pacienteModel.excluirPaciente(
            req.params.id,
            usuario_id
        );

        res.json({

            mensagem: "Paciente excluído com sucesso!"

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

}


// Atualizar paciente
async function atualizar(req, res) {

    try {

        const usuario_id = req.body.usuario_id;

        if (!usuario_id) {

            return res.status(400).json({
                erro: "Usuário não identificado."
            });

        }

        await pacienteModel.atualizarPaciente(
            req.params.id,
            req.body,
            usuario_id
        );

        res.json({

            mensagem: "Paciente atualizado com sucesso!"

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

}


module.exports = {

    cadastrar,
    listar,
    excluir,
    atualizar

};