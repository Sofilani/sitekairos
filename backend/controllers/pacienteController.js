const pacienteModel = require("../models/pacienteModel");

// Cadastrar paciente
async function cadastrar(req, res) {

    console.log("Body recebido:", req.body);

    try {

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

        const pacientes = await pacienteModel.listarPacientes();

        res.json(pacientes);

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

}

async function excluir(req, res) {

    try {

        await pacienteModel.excluirPaciente(req.params.id);

        res.json({
            mensagem: "Paciente excluído com sucesso!"
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

}
async function atualizar(req, res) {

    try {

        await pacienteModel.atualizarPaciente(req.params.id, req.body);

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