const amostraModel = require("../models/amostraModel");


// =====================================================
// Cadastrar amostra
// =====================================================

async function cadastrar(req, res) {

    try {

        if (!req.body.usuario_id) {

            return res.status(400).json({

                erro: "Usuário não identificado."

            });

        }


        const id =
            await amostraModel.criarAmostra(req.body);


        res.status(201).json({

            mensagem: "Amostra cadastrada com sucesso!",
            id

        });


    } catch (err) {

        res.status(500).json({

            erro: err.message

        });

    }

}


// =====================================================
// Listar amostras
// =====================================================

async function listar(req, res) {

    try {

        const usuario_id =
            req.query.usuario_id;


        if (!usuario_id) {

            return res.status(400).json({

                erro: "Usuário não identificado."

            });

        }


        const amostras =
            await amostraModel.listarAmostras(usuario_id);


        res.json(amostras);


    } catch (err) {

        res.status(500).json({

            erro: err.message

        });

    }

}


module.exports = {

    cadastrar,
    listar

};