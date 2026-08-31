const analiseIaModel =
    require("../models/analiseIaModel");

const iaService =
    require("../ia/iaService");

const path = require("path");

// ===============================
// SALVAR ANÁLISE
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
                .listarPorRelatorio(
                    relatorio_id
                );


        res.json(analises);

    } catch (err) {

        console.error(
            "Erro ao listar análises:",
            err
        );


        res.status(500).json({

            erro: err.message

        });

    }

}

// ===============================
// ANALISAR IMAGEM COM IA
// ===============================

async function analisarImagem(req, res) {

    try {

        // Verifica se uma imagem foi enviada

        if (!req.file) {

            return res.status(400).json({

                erro: "Nenhuma imagem foi enviada."

            });

        }


        // ID do relatório

        const relatorio_id =
            req.body.relatorio_id;
        
        const imagem_id =
            req.body.imagem_id;

        if (!relatorio_id) {

            return res.status(400).json({

                erro: "relatorio_id é obrigatório."

            });

        }


        // Caminho da imagem recebida

        const caminhoImagem =
            req.file.path;


        console.log(
            "Imagem recebida:",
            caminhoImagem
        );


        // ===============================
        // INICIAR CRONÔMETRO
        // ===============================

        const inicio =
            Date.now();


        // ===============================
        // ENVIAR IMAGEM PARA IA
        // ===============================

        const resultadoIA =
            await iaService.analisarImagem(
                caminhoImagem
            );


        // ===============================
        // CALCULAR TEMPO
        // ===============================

        const fim =
            Date.now();

        const tempoProcessamento =
            (fim - inicio) / 1000;


        console.log(
            "Resultado da IA:",
            resultadoIA
        );


        // ===============================
        // SALVAR NO BANCO
        // ===============================

        const id =
    await analiseIaModel.salvarAnalise({

        relatorio_id,

        imagem_id,

        resultado:
            resultadoIA.resultado,

        confianca:
            resultadoIA.confianca,

        tempo_processamento:
            tempoProcessamento

    });


        // ===============================
        // RESPONDER
        // ===============================

        res.status(201).json({

            mensagem:
                "Imagem analisada com sucesso!",

            analise_id:
                id,

            resultado:
                resultadoIA.resultado,

            confianca:
                resultadoIA.confianca,

            tempo_processamento:
                tempoProcessamento

        });


    } catch (err) {

        console.error(
            "Erro ao analisar imagem:",
            err
        );


        res.status(500).json({

            erro:
                "Erro ao analisar imagem."

        });

    }

}


module.exports = {

    salvar,
    listarPorRelatorio,
    analisarImagem
};

    