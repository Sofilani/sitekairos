const PDFDocument = require("pdfkit");
const db = require("../database/database");
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
async function buscar(req, res) {

    try {

        const id = req.params.id;

        const relatorio = await relatorioModel.buscarRelatorio(id);

        if (!relatorio) {

            return res.status(404).json({
                erro: "Relatório não encontrado."
            });

        }

        res.json(relatorio);

    } catch (err) {

        res.status(500).json({
            erro: err.message
        });

    }

}
async function atualizar(req, res) {

    try {

        const id = req.params.id;

        const {
            resultado,
            laudo
        } = req.body;

        const alterados =
            await relatorioModel.atualizarRelatorio(
                id,
                resultado,
                laudo
            );

        if (alterados === 0) {

            return res.status(404).json({
                erro: "Relatório não encontrado."
            });

        }

        res.json({

            mensagem: "Relatório atualizado com sucesso!"

        });

    } catch (err) {

        res.status(500).json({

            erro: err.message

        });

    }

} 
async function gerarPDF(req, res) {

    const id = req.params.id;

    db.get(
        `
        SELECT
            relatorios.id,
            pacientes.nome AS paciente,
            amostras.tipo,
            amostras.data_coleta,
            relatorios.resultado,
            relatorios.laudo,
            relatorios.status,
            relatorios.data_emissao

        FROM relatorios

        INNER JOIN amostras
            ON amostras.id = relatorios.amostra_id

        INNER JOIN pacientes
            ON pacientes.id = amostras.paciente_id

        WHERE relatorios.id = ?
        `,
        [id],

        (err, relatorio) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao buscar relatório."
                });

            }

            if (!relatorio) {

                return res.status(404).json({
                    erro: "Relatório não encontrado."
                });

            }

            const doc = new PDFDocument();

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            res.setHeader(
                "Content-Disposition",
                `inline; filename=relatorio-${relatorio.id}.pdf`
            );

            doc.pipe(res);


            // =========================
            // CABEÇALHO
            // =========================

            doc
                .fontSize(22)
                .text("KAIRÓS", {
                    align: "center"
                });

            doc
                .moveDown();

            doc
                .fontSize(16)
                .text("Relatório Laboratorial", {
                    align: "center"
                });

            doc.moveDown(2);


            // =========================
            // DADOS
            // =========================

            doc.fontSize(12);

            doc.text(`Relatório: ${relatorio.id}`);

            doc.text(
                `Paciente: ${relatorio.paciente}`
            );

            doc.text(
                `Tipo de amostra: ${relatorio.tipo}`
            );

            doc.text(
                `Data da coleta: ${relatorio.data_coleta || "-"}`
            );

            doc.text(
                `Data de emissão: ${relatorio.data_emissao || "-"}`
            );

            doc.text(
                `Status: ${relatorio.status}`
            );

            doc.moveDown(2);


            // =========================
            // RESULTADO
            // =========================

            doc
                .fontSize(14)
                .text("Resultado");

            doc.moveDown(0.5);

            doc
                .fontSize(12)
                .text(
                    relatorio.resultado || "Não informado."
                );

            doc.moveDown(2);


            // =========================
            // LAUDO
            // =========================

            doc
                .fontSize(14)
                .text("Laudo");

            doc.moveDown(0.5);

            doc
                .fontSize(12)
                .text(
                    relatorio.laudo || "Não informado."
                );


            // Finaliza o PDF

            doc.end();

        }
    );

}


module.exports = {

    cadastrar,
    gerar,
    listar,
    buscar,
    atualizar,
    gerarPDF

};