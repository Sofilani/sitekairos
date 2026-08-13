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
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("KAIRÓS", {
        align: "center"
    });

doc
    .fontSize(15)
    .font("Helvetica")
    .text("RELATÓRIO LABORATORIAL", {
        align: "center"
    });

doc.moveDown();

doc
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

doc.moveDown(2);


// =========================
// IDENTIFICAÇÃO
// =========================

doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("IDENTIFICAÇÃO");

doc.moveDown(0.8);

doc
    .fontSize(11)
    .font("Helvetica")
    .text(`Relatório: ${relatorio.id}`);

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
    .font("Helvetica-Bold")
    .text("RESULTADO");

doc.moveDown(0.8);

doc
    .fontSize(11)
    .font("Helvetica")
    .text(
        relatorio.resultado || "Não informado.",
        {
            width: 495,
            align: "left"
        }
    );

doc.moveDown(2);


// =========================
// LAUDO
// =========================

doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("LAUDO");

doc.moveDown(0.8);

doc
    .fontSize(11)
    .font("Helvetica")
    .text(
        relatorio.laudo || "Não informado.",
        {
            width: 495,
            align: "left"
        }
    );

doc.moveDown(3);


// =========================
// ASSINATURA
// =========================

doc
    .moveTo(190, doc.y)
    .lineTo(405, doc.y)
    .stroke();

doc.moveDown(0.5);

doc
    .fontSize(10)
    .text(
        "Responsável técnico",
        {
            align: "center"
        }
    );


// =========================
// FINALIZAR PDF
// =========================

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