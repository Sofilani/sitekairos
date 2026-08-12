const relatorioModel = require("../models/relatorioModel");

async function cadastrar(req, res) {

    try {

        const id = await relatorioModel.criarRelatorio(req.body);

        res.status(201).json({

            mensagem: "Relatório criado!",
            id

        });

    } catch (err) {

        res.status(500).json({

            erro: err.message

        });

    }

}


async function gerar(req, res) {

    try {

        const relatorio = {

            amostra_id: req.params.id,

            resultado: "",
            laudo: "",
            status: "Em análise",

            data_emissao: new Date().toISOString().split("T")[0]

        };

        const id = await relatorioModel.criarRelatorio(relatorio);

        res.status(201).json({

            mensagem: "Relatório gerado com sucesso!",
            id

        });

    } catch (err) {

        res.status(500).json({

            erro: err.message

        });

    }

}


async function listar(req, res) {

    try {

        const relatorios = await relatorioModel.listarRelatorios();

        res.json(relatorios);

    } catch (err) {

        res.status(500).json({

            erro: err.message

        });

    }

}


module.exports = {

    cadastrar,
    gerar,
    listar

};