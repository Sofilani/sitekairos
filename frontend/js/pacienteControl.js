const pacienteModel = require("../models/pacienteModel");

// Cadastrar paciente
async function cadastrar(req, res) {

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

module.exports = {

    cadastrar,
    listar

};