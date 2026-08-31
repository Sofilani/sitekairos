const analiseIaModel =
    require("../models/analiseIaModel");


// ===============================
// SALVAR ANÁLISE DA IA
// ===============================

async function salvar(req, res) {

    try {

        const analise = {

            relatorio_id:
                req.body.relatorio_id,

            resultado:
                req.body.resultado,

            confianca:
                req.body.confianca,

            tempo_processamento:
                req.body.tempo_processamento

        };


        const id =
            await analiseIaModel.salvarAnalise(
                analise
            );


        res.status(201).json({

            mensagem:
                "Análise da IA registrada com sucesso!",

            id

        });


    } catch (err) {

        console.error(
            "Erro ao salvar análise da IA:",
            err
        );


        res.status(500).json({

            erro: err.message

        });

    }

}


// ===============================
// LISTAR ANÁLISES DO RELATÓRIO
// ===============================

async function listarPorRelatorio(req, res) {

    try {

        const relatorio_id =
            req.params.id;


        const analises =
            await analiseIaModel
                .listarAnalisesPorRelatorio(
                    relatorio_id
                );


        res.json(analises);


    } catch (err) {

        console.error(
            "Erro ao listar análises da IA:",
            err
        );


        res.status(500).json({

            erro: err.message

        });

    }

}


module.exports = {

    salvar,
    listarPorRelatorio

};