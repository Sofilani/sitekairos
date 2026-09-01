const db = require("../database/database");

const analiseIaModel =
    require("../models/analiseIaModel");

const relatorioModel =
    require("../models/relatorioModel");

const relatorioIaService =
    require("../services/relatorioIaService");


// ==========================================
// RECEBER ANÁLISE DA IA EXTERNA
// ==========================================

async function receberAnalise(req, res) {

    try {

        const {

            amostra_id,
            arquivo,
            camera,
            data_captura,
            resultado,
            confianca,
            tempo_processamento

        } = req.body;


        // ==========================================
        // VALIDAR DADOS
        // ==========================================

        if (!amostra_id) {

            return res.status(400).json({

                erro: "amostra_id é obrigatório."

            });

        }


        if (!arquivo) {

            return res.status(400).json({

                erro: "arquivo é obrigatório."

            });

        }


        if (!resultado) {

            return res.status(400).json({

                erro: "resultado é obrigatório."

            });

        }


        if (
            confianca === undefined ||
            confianca === null
        ) {

            return res.status(400).json({

                erro: "confianca é obrigatória."

            });

        }


        // ==========================================
        // 1. REGISTRAR IMAGEM
        // ==========================================

        const imagemId =
            await new Promise(
                (resolve, reject) => {

                    db.run(

                        `
                        INSERT INTO imagens_amostras
                        (
                            amostra_id,
                            arquivo,
                            camera,
                            data_captura
                        )

                        VALUES (?, ?, ?, ?)
                        `,

                        [

                            amostra_id,

                            arquivo,

                            camera || null,

                            data_captura ||
                            new Date().toISOString()

                        ],

                        function(err) {

                            if (err) {

                                reject(err);

                            } else {

                                resolve(
                                    this.lastID
                                );

                            }

                        }

                    );

                }
            );


        // ==========================================
        // 2. ENCONTRAR RELATÓRIO DA AMOSTRA
        // ==========================================

        const relatorio =
            await new Promise(
                (resolve, reject) => {

                    db.get(

                        `
                        SELECT *

                        FROM relatorios

                        WHERE amostra_id = ?

                        ORDER BY id DESC

                        LIMIT 1
                        `,

                        [amostra_id],

                        (err, row) => {

                            if (err) {

                                reject(err);

                            } else {

                                resolve(row);

                            }

                        }

                    );

                }
            );


        // ==========================================
        // 3. SE NÃO EXISTIR RELATÓRIO,
        //    CRIAR AUTOMATICAMENTE
        // ==========================================

        let relatorioId;


        if (!relatorio) {

            relatorioId =
                await relatorioModel.criarRelatorio({

                    amostra_id,

                    resultado: "",

                    laudo: "",

                    status: "Em análise",

                    data_emissao:
                        new Date()
                            .toISOString()
                            .split("T")[0]

                });

        } else {

            relatorioId =
                relatorio.id;

        }


        // ==========================================
        // 4. SALVAR ANÁLISE DA IA
        // ==========================================

        const analiseId =
            await analiseIaModel.salvarAnalise({

                relatorio_id:
                    relatorioId,

                imagem_id:
                    imagemId,

                resultado,

                confianca:
                    Number(confianca),

                tempo_processamento:
                    tempo_processamento
                        ? Number(
                            tempo_processamento
                        )
                        : null

            });


        // ==========================================
        // 5. BUSCAR TODAS AS ANÁLISES
        // ==========================================

        const analises =
            await analiseIaModel
                .listarPorAmostra(
                    amostra_id
                );


        // ==========================================
        // 6. GERAR RESULTADO + LAUDO
        // ==========================================

        const relatorioAutomatico =
            relatorioIaService
                .gerarRelatorio(
                    analises
                );


        // ==========================================
        // 7. ATUALIZAR RELATÓRIO
        // ==========================================

        await relatorioModel
            .atualizarAutomaticamente(

                relatorioId,

                relatorioAutomatico
                    .resultado,

                relatorioAutomatico
                    .laudo,

                relatorioAutomatico
                    .status

            );


        // ==========================================
        // 8. RESPONDER
        // ==========================================

        res.status(201).json({

            mensagem:
                "Análise recebida e relatório atualizado com sucesso.",

            imagem_id:
                imagemId,

            analise_id:
                analiseId,

            relatorio_id:
                relatorioId,

            resultado:
                relatorioAutomatico
                    .resultado,

            laudo:
                relatorioAutomatico
                    .laudo,

            status:
                relatorioAutomatico
                    .status

        });


    } catch (err) {

        console.error(
            "Erro na integração com IA:",
            err
        );


        res.status(500).json({

            erro:
                "Erro ao processar análise recebida."

        });

    }

}


module.exports = {

    receberAnalise

};