const db = require("../database/database");

// ==========================================
// CRIAR RELATÓRIO
// ==========================================

function criarRelatorio(relatorio) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO relatorios
            (amostra_id, resultado, laudo, status, data_emissao, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)`,

            [
                relatorio.amostra_id,
                relatorio.resultado,
                relatorio.laudo,
                relatorio.status,
                relatorio.data_emissao,
                relatorio.usuario_id
            ],

            function(err) {

                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }

            }

        );

    });

}


// ==========================================
// LISTAR RELATÓRIOS DO USUÁRIO
// ==========================================

function listarRelatorios(usuario_id) {

    return new Promise((resolve, reject) => {

        db.all(

            `SELECT

                relatorios.id,

                pacientes.nome AS paciente,

                amostras.tipo,

                relatorios.resultado,

                relatorios.status

            FROM relatorios

            INNER JOIN amostras
                ON amostras.id = relatorios.amostra_id

            INNER JOIN pacientes
                ON pacientes.id = amostras.paciente_id

            WHERE relatorios.usuario_id = ?

            ORDER BY relatorios.id DESC`,

            [usuario_id],

            (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

            }

        );

    });

}


// ==========================================
// BUSCAR UM RELATÓRIO ESPECÍFICO
// ==========================================

function buscarRelatorio(id, usuario_id) {

    return new Promise((resolve, reject) => {

        db.get(

            `SELECT

                relatorios.id,
                relatorios.amostra_id,

                pacientes.nome AS paciente,

                amostras.tipo,
                amostras.data_coleta,

                relatorios.resultado,
relatorios.laudo,
relatorios.status,
relatorios.data_emissao,

relatorios.revisao_status,
relatorios.revisao_medica,
relatorios.revisado_por,
relatorios.revisado_em

            FROM relatorios

            INNER JOIN amostras
                ON amostras.id = relatorios.amostra_id

            INNER JOIN pacientes
                ON pacientes.id = amostras.paciente_id

            WHERE relatorios.id = ?
            AND relatorios.usuario_id = ?`,

            [id, usuario_id],

            (err, row) => {

                if (err) {

                    reject(err);

                    return;

                }

                if (!row) {

                    resolve(null);

                    return;

                }


                // ==========================================
                // BUSCAR IMAGENS DA AMOSTRA
                // ==========================================

                db.all(

                    `SELECT

                        id,
                        amostra_id,
                        arquivo,
                        camera,
                        data_captura

                    FROM imagens_amostras

                    WHERE amostra_id = ?

                    ORDER BY id DESC`,

                    [row.amostra_id],

                    (err, imagens) => {

                        if (err) {

                            reject(err);

                            return;

                        }

                        row.imagens = imagens;

                        resolve(row);

                    }

                );

            }

        );

    });

}


// ==========================================
// ATUALIZAR RESULTADO E LAUDO
// ==========================================

function atualizarRelatorio(
    id,
    resultado,
    laudo,
    usuario_id,
    revisao_status,
    revisao_medica,
    revisado_por
) {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE relatorios

            SET
                resultado = ?,
                laudo = ?,
                revisao_status = ?,
                revisao_medica = ?,
                revisado_por = ?,
                revisado_em = CURRENT_TIMESTAMP,
                status = ?

            WHERE id = ?
            AND usuario_id = ?
        `;


        // Se confirmou a IA, o relatório fica aprovado.
        // Se alterou, também fica aprovado após a revisão médica.
        const novoStatus =
            revisao_status === "confirmado" ||
            revisao_status === "alterar"
                ? "Aprovado pelo médico"
                : "Aguardando revisão";


        db.run(

            sql,

            [
                resultado,
                laudo,
                revisao_status,
                revisao_medica || null,
                revisado_por || null,
                novoStatus,
                id,
                usuario_id
            ],

            function (err) {

                if (err) {

                    console.error(
                        "Erro ao atualizar relatório:",
                        err
                    );

                    reject(err);

                    return;

                }


                resolve(
                    this.changes
                );

            }

        );

    });

}


// ==========================================
// ATUALIZAR RELATÓRIO AUTOMATICAMENTE
// ==========================================

function atualizarAutomaticamente(
    id,
    resultado,
    laudo,
    status,
    usuario_id
) {

    return new Promise((resolve, reject) => {

        db.run(

            `UPDATE relatorios

             SET
                resultado = ?,
                laudo = ?,
                status = ?

             WHERE id = ?
             AND usuario_id = ?`,

            [
                resultado,
                laudo,
                status,
                id,
                usuario_id
            ],

            function(err) {

                if (err) {

                    reject(err);

                } else {

                    resolve(this.changes);

                }

            }

        );

    });

}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    criarRelatorio,
    listarRelatorios,
    buscarRelatorio,
    atualizarRelatorio,
    atualizarAutomaticamente

};