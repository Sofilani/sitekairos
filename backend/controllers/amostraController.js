const amostraModel = require("../models/amostraModel");

// Cadastrar amostra
async function cadastrar(req, res) {

    try {

        const id = await amostraModel.criarAmostra(req.body);

        res.status(201).json({

            mensagem: "Amostra cadastrada com sucesso!",

            id

        });

    } catch (erro) {

        res.status(500).json({

            erro: erro.message

        });

    }

}

// Listar amostras
async function listar(req, res) {

    try {

        const amostras = await amostraModel.listarAmostras();

        res.json(amostras);

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