const imagemAmostraModel =
    require("../models/imagemAmostraModel");


// ===============================
// SALVAR IMAGEM
// ===============================

async function salvar(req, res) {

    try {

        const imagem = {

            amostra_id: req.body.amostra_id,

            arquivo: req.body.arquivo,

            camera: req.body.camera

        };


        const id =
            await imagemAmostraModel.salvarImagem(imagem);


        res.status(201).json({

            mensagem: "Imagem registrada com sucesso!",

            id

        });


    } catch (err) {

        console.error(
            "Erro ao salvar imagem:",
            err
        );

        res.status(500).json({

            erro: err.message

        });

    }

}


// ===============================
// LISTAR IMAGENS DA AMOSTRA
// ===============================

async function listarPorAmostra(req, res) {

    try {

        const amostra_id =
            req.params.id;


        const imagens =
            await imagemAmostraModel
                .listarImagensPorAmostra(amostra_id);


        res.json(imagens);


    } catch (err) {

        console.error(
            "Erro ao listar imagens:",
            err
        );

        res.status(500).json({

            erro: err.message

        });

    }

}


module.exports = {

    salvar,
    listarPorAmostra

};