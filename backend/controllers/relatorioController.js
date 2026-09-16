const PDFDocument = require("pdfkit");
const db = require("../database/database");
const relatorioModel = require("../models/relatorioModel");
const analiseIaModel = require("../models/analiseIaModel");

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");


// =====================================================
// CADASTRAR RELATÓRIO
// =====================================================

async function cadastrar(req, res) {

    try {

        const id =
            await relatorioModel.criarRelatorio(
                req.body
            );

        res.status(201).json({

            mensagem:
                "Relatório criado!",

            id

        });

    } catch (err) {

        console.error(
            "Erro ao cadastrar relatório:",
            err
        );

        res.status(500).json({

            erro:
                err.message

        });

    }

}


// =====================================================
// GERAR RELATÓRIO
// =====================================================

async function gerar(req, res) {

    try {
        const idAmostra = req.params.id;

const amostra = await new Promise((resolve, reject) => {

    db.get(
        "SELECT usuario_id FROM amostras WHERE id = ?",
        [idAmostra],
        (err, row) => {

            if (err) {
                reject(err);
                return;
            }

            resolve(row);
        }
    );

});

if (!amostra) {

    return res.status(404).json({
        erro: "Amostra não encontrada."
    });

}

        const relatorio = {

            amostra_id:
    idAmostra,

usuario_id:
    amostra.usuario_id,

            resultado:
                "",

            laudo:
                "",

            status:
                "Em análise",

            data_emissao:
                new Date()
                    .toISOString()
                    .split("T")[0]

        };


        const id =
            await relatorioModel
                .criarRelatorio(
                    relatorio
                );


        res.status(201).json({

            mensagem:
                "Relatório gerado com sucesso!",

            id

        });

    } catch (err) {

        console.error(
            "Erro ao gerar relatório:",
            err
        );

        res.status(500).json({

            erro:
                err.message

        });

    }

}


// =====================================================
// LISTAR RELATÓRIOS
// =====================================================

async function listar(req, res) {

    try {

        const relatorios =
            await relatorioModel
                .listarRelatorios(req.query.usuario_id);

        res.json(
            relatorios
        );

    } catch (err) {

        console.error(
            "Erro ao listar relatórios:",
            err
        );

        res.status(500).json({

            erro:
                err.message

        });

    }

}

// =====================================================
// BUSCAR RELATÓRIO
// =====================================================

async function buscar(req, res) {

    try {

        const id =
            req.params.id;


        const relatorio =
    await relatorioModel.buscarRelatorio(
        id,
        req.query.usuario_id
    );


        if (!relatorio) {

            return res.status(404).json({

                erro:
                    "Relatório não encontrado."

            });

        }


        res.json(
            relatorio
        );

    } catch (err) {

        console.error(
            "Erro ao buscar relatório:",
            err
        );

        res.status(500).json({

            erro:
                err.message

        });

    }

}


// =====================================================
// ATUALIZAR RELATÓRIO
// =====================================================

// =====================================================
// ATUALIZAR RELATÓRIO
// =====================================================

async function atualizar(req, res) {

    try {

        const id =
            req.params.id;


        const {
            resultado,
            laudo,
            revisao_status,
            revisao_medica,
            revisado_por
        } = req.body;


        const usuarioId =
            req.query.usuario_id;


        if (!usuarioId) {

            return res.status(400).json({

                erro:
                    "Usuário não identificado."

            });

        }


        const alterados =
            await relatorioModel
                .atualizarRelatorio(
                    id,
                    resultado,
                    laudo,
                    usuarioId,
                    revisao_status,
                    revisao_medica,
                    revisado_por
                );


        if (alterados === 0) {

            return res.status(404).json({

                erro:
                    "Relatório não encontrado."

            });

        }


        res.json({

            mensagem:
                "Relatório e revisão médica salvos com sucesso!"

        });


    } catch (err) {

        console.error(
            "Erro ao atualizar relatório:",
            err
        );


        res.status(500).json({

            erro:
                err.message

        });

    }

}

// =====================================================
// GERAR PDF
// =====================================================

async function gerarPDF(req, res) {

    try {

        const id =
            req.params.id;


        // =================================================
        // 1. BUSCAR DADOS DO RELATÓRIO
        // =================================================

        const relatorio =
            await new Promise(
                (resolve, reject) => {

                    db.get(

                        `
                        SELECT

                            relatorios.id,

                            relatorios.amostra_id,

                            pacientes.nome AS paciente,

                            amostras.tipo,

                            amostras.data_coleta,

                            relatorios.resultado,

                            relatorios.laudo,

                            relatorios.status,

                            relatorios.data_emissao

                        FROM relatorios

                        INNER JOIN amostras
                            ON amostras.id =
                               relatorios.amostra_id

                        INNER JOIN pacientes
                            ON pacientes.id =
                               amostras.paciente_id

                        WHERE relatorios.id = ?

                        `,

                        [id],

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


        if (!relatorio) {

            return res.status(404).json({

                erro:
                    "Relatório não encontrado."

            });

        }


        // =================================================
        // 2. BUSCAR IMAGENS
        // =================================================

        const imagens =
            await new Promise(
                (resolve, reject) => {

                    db.all(

                        `
                        SELECT

                            id,

                            amostra_id,

                            arquivo,

                            camera,

                            data_captura

                        FROM imagens_amostras

                        WHERE amostra_id = ?

                        ORDER BY id ASC

                        `,

                        [
                            relatorio.amostra_id
                        ],

                        (err, rows) => {

                            if (err) {

                                reject(err);

                            } else {

                                resolve(
                                    rows || []
                                );

                            }

                        }

                    );

                }
            );


        // =================================================
        // 3. BUSCAR ANÁLISES DA IA
        // =================================================

        const analises =
            await analiseIaModel
                .listarPorRelatorio(
                    id
                );


        // =================================================
        // 4. CRIAR DOCUMENTO
        // =================================================

        const doc =
            new PDFDocument({

                size: "A4",

                margins: {

                    top: 50,

                    bottom: 50,

                    left: 55,

                    right: 55

                }

            });


        res.setHeader(
            "Content-Type",
            "application/pdf"
        );


        res.setHeader(

            "Content-Disposition",

            `inline; filename=relatorio-${relatorio.id}.pdf`

        );


        doc.pipe(res);


        // =================================================
        // FUNÇÃO PARA CABEÇALHO
        // =================================================

        function cabecalho() {

            doc
                .font("Helvetica-Bold")
                .fontSize(24)
                .text(
                    "KAIRÓS",
                    {
                        align:
                            "center"
                    }
                );


            doc
                .font("Helvetica")
                .fontSize(14)
                .text(
                    "RELATÓRIO LABORATORIAL",
                    {
                        align:
                            "center"
                    }
                );


            doc.moveDown();


            doc
                .moveTo(
                    55,
                    doc.y
                )
                .lineTo(
                    540,
                    doc.y
                )
                .stroke();


            doc.moveDown(2);

        }


        // =================================================
        // FUNÇÃO DE TÍTULO DE SEÇÃO
        // =================================================

        function tituloSecao(
            titulo
        ) {

            doc
                .font("Helvetica-Bold")
                .fontSize(14)
                .text(
                    titulo
                );


            doc.moveDown(
                0.6
            );

        }


        // =================================================
        // CABEÇALHO
        // =================================================

        cabecalho();


        // =================================================
        // IDENTIFICAÇÃO
        // =================================================

        tituloSecao(
            "IDENTIFICAÇÃO"
        );


        doc
            .font("Helvetica")
            .fontSize(10.5);


        doc.text(
            `Relatório: ${relatorio.id}`
        );


        doc.text(
            `Paciente: ${relatorio.paciente || "-"}`
        );


        doc.text(
            `Tipo de amostra: ${relatorio.tipo || "-"}`
        );


        doc.text(
            `Data da coleta: ${relatorio.data_coleta || "-"}`
        );


        doc.text(
            `Data de emissão: ${relatorio.data_emissao || "-"}`
        );


        doc.text(
            `Status: ${relatorio.status || "-"}`
        );


        doc.moveDown(2);


        // =================================================
        // RESULTADO
        // =================================================

        tituloSecao(
            "RESULTADO"
        );


        doc
            .font("Helvetica")
            .fontSize(10.5)
            .text(

                relatorio.resultado ||
                "Não informado.",

                {

                    width:
                        485,

                    align:
                        "left"

                }

            );


        doc.moveDown(2);


        // =================================================
        // LAUDO
        // =================================================

        tituloSecao(
            "LAUDO"
        );


        doc
            .font("Helvetica")
            .fontSize(10.5)
            .text(

                relatorio.laudo ||
                "Não informado.",

                {

                    width:
                        485,

                    align:
                        "left"

                }

            );


        // =================================================
        // ANÁLISES DA IA
        // =================================================

        if (
            analises &&
            analises.length > 0
        ) {

            doc.moveDown(2);


            tituloSecao(
                "ANÁLISE DA INTELIGÊNCIA ARTIFICIAL"
            );


            analises.forEach(
                (
                    analise,
                    index
                ) => {

                    // Evita quebrar a informação no meio
                    if (
                        doc.y > 700
                    ) {

                        doc.addPage();

                        cabecalho();

                    }


                    doc
                        .font(
                            "Helvetica-Bold"
                        )
                        .fontSize(11)
                        .text(
                            `Análise ${index + 1}`
                        );


                    doc.moveDown(
                        0.3
                    );


                    doc
                        .font(
                            "Helvetica"
                        )
                        .fontSize(10);


                    doc.text(

                        `Resultado: ${
                            analise.resultado ||
                            "-"
                        }`

                    );


                    const confianca =
                        analise.confianca != null

                            ? (

                                Number(
                                    analise.confianca
                                ) * 100

                            ).toFixed(2) + "%"

                            : "-";


                    doc.text(

                        `Confiança: ${confianca}`

                    );


                    doc.text(

                        `Tempo de processamento: ${
                            analise.tempo_processamento != null

                                ? analise.tempo_processamento +
                                  " segundos"

                                : "-"
                        }`

                    );


                    doc.text(

                        `Câmera: ${
                            analise.camera ||
                            "-"
                        }`

                    );


                    doc.text(

                        `Imagem analisada: ${
                            analise.arquivo ||
                            "-"
                        }`

                    );


                    doc.moveDown(
                        1
                    );

                }

            );

        }


        // =================================================
        // IMAGENS
        // =================================================

        if (
            imagens &&
            imagens.length > 0
        ) {

            doc.addPage();


            cabecalho();


            tituloSecao(
                "IMAGENS DA AMOSTRA"
            );


            for (
                const imagem
                of imagens
            ) {

                try {

                    // =====================================
                    // ENCONTRAR ARQUIVO
                    // =====================================

                    let caminhoImagem =
                        null;


                    const arquivo =
                        imagem.arquivo;


                    if (
                        arquivo &&
                        /^https?:\/\//i.test(
                            arquivo
                        )
                    ) {

                        // Imagens externas
                        // não serão baixadas
                        // automaticamente neste momento.

                        caminhoImagem =
                            null;

                    } else {

                        const nomeArquivo =
                            arquivo
                                ? path.basename(
                                    arquivo
                                )
                                : null;


                        const caminhosPossiveis = [

                            // uploads/amostras
                            path.join(
                                process.cwd(),
                                "uploads",
                                "amostras",
                                nomeArquivo || ""
                            ),

                            // uploads/ia
                            path.join(
                                process.cwd(),
                                "uploads",
                                "ia",
                                nomeArquivo || ""
                            ),

                            // uploads
                            path.join(
                                process.cwd(),
                                "uploads",
                                nomeArquivo || ""
                            ),

                            // caso o banco tenha
                            // armazenado /uploads/...
                            path.join(
                                process.cwd(),
                                arquivo
                                    ? arquivo.replace(
                                       (/^[/\\]+/),
                                        ""
                                    )
                                    : ""
                            )

                        ];


                        for (
                            const caminho
                            of caminhosPossiveis
                        ) {

                            if (
                                caminho &&
                                fs.existsSync(
                                    caminho
                                )
                            ) {

                                caminhoImagem =
                                    caminho;

                                break;

                            }

                        }

                    }


                    // =====================================
                    // CASO NÃO ENCONTRE
                    // =====================================

                    if (
                        !caminhoImagem
                    ) {

                        doc
                            .font(
                                "Helvetica"
                            )
                            .fontSize(10)
                            .text(

                                `Imagem: ${
                                    imagem.arquivo ||
                                    "-"
                                }`

                            );


                        doc.text(

                            "Arquivo da imagem não encontrado no servidor."

                        );


                        doc.moveDown(
                            1.5
                        );


                        continue;

                    }


                    // =====================================
                    // GARANTIR ESPAÇO
                    // =====================================

                    if (
                        doc.y > 620
                    ) {

                        doc.addPage();

                        cabecalho();

                        tituloSecao(
                            "IMAGENS DA AMOSTRA"
                        );

                    }


                    // =====================================
                    // INFORMAÇÕES
                    // =====================================

                    doc
                        .font(
                            "Helvetica-Bold"
                        )
                        .fontSize(10)
                        .text(

                            `Câmera: ${
                                imagem.camera ||
                                "-"
                            }`

                        );


                    doc
                        .font(
                            "Helvetica"
                        )
                        .fontSize(9)
                        .text(

                            `Data de captura: ${
                                imagem.data_captura ||
                                "-"
                            }`

                        );


                    doc.moveDown(
                        0.5
                    );


                    // =====================================
                    // CONVERTER WEBP PARA PNG
                    // =====================================

                    const imagemPNG =
                        await sharp(
                            caminhoImagem
                        )
                        .png()
                        .toBuffer();


                    // =====================================
                    // ADICIONAR IMAGEM AO PDF
                    // =====================================

                    doc.image(

                        imagemPNG,

                        {

                            fit: [
                                470,
                                300
                            ],

                            align:
                                "center",

                            valign:
                                "center"

                        }

                    );


                    doc.moveDown(
                        1.5
                    );


                } catch (erroImagem) {

                    console.error(

                        "Erro ao adicionar imagem ao PDF:",
                        erroImagem

                    );


                    doc
                        .font(
                            "Helvetica"
                        )
                        .fontSize(9)
                        .text(

                            `Não foi possível inserir a imagem: ${
                                imagem.arquivo ||
                                "-"
                            }`

                        );


                    doc.moveDown(
                        1
                    );

                }

            }

        }


        // =================================================
        // ASSINATURA
        // =================================================

        if (
            doc.y > 680
        ) {

            doc.addPage();

        }


        doc.moveDown(3);


        doc
            .moveTo(
                190,
                doc.y
            )
            .lineTo(
                405,
                doc.y
            )
            .stroke();


        doc.moveDown(
            0.5
        );


        doc
            .font("Helvetica")
            .fontSize(9)
            .text(

                "Responsável técnico",

                {

                    align:
                        "center"

                }

            );


        // =================================================
        // RODAPÉ
        // =================================================

        doc
            .fontSize(8)
            .text(

                "Documento gerado pelo sistema KAIRÓS.",

                55,
                760,

                {

                    width:
                        485,

                    align:
                        "center"

                }

            );


        // =================================================
        // FINALIZAR
        // =================================================

        doc.end();


    } catch (err) {

        console.error(
            "Erro ao gerar PDF:",
            err
        );


        if (
            !res.headersSent
        ) {

            res.status(500).json({

                erro:
                    "Erro ao gerar PDF."

            });

        }

    }

}


// =====================================================
// EXPORTAR
// =====================================================

module.exports = {

    cadastrar,

    gerar,

    listar,

    buscar,

    atualizar,

    gerarPDF

};