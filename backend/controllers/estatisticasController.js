const db = require("../database/database");

async function dashboard(req, res) {

    try {

        const usuario_id = req.query.usuario_id;

        if (!usuario_id) {

            return res.status(400).json({
                erro: "Usuário não informado."
            });

        }


        db.get(`

            SELECT

                (
                    SELECT COUNT(*)
                    FROM pacientes
                    WHERE usuario_id = ?
                ) AS pacientes,


                (
                    SELECT COUNT(*)
                    FROM amostras
                    WHERE usuario_id = ?
                ) AS amostras,


                (
                    SELECT COUNT(*)
                    FROM relatorios
                    WHERE usuario_id = ?
                ) AS relatorios,


                (
                    SELECT COUNT(*)
                    FROM analises_ia
                    INNER JOIN relatorios
                        ON relatorios.id = analises_ia.relatorio_id
                    WHERE relatorios.usuario_id = ?
                ) AS ia


        `,

        [
            usuario_id,
            usuario_id,
            usuario_id,
            usuario_id
        ],

        (err, row) => {

            if (err) {

                console.error(
                    "Erro ao buscar estatísticas:",
                    err
                );

                return res.status(500).json({

                    erro:
                        "Erro ao carregar estatísticas do dashboard."

                });

            }


            res.json({

                pacientes:
                    row.pacientes,

                amostras:
                    row.amostras,

                relatorios:
                    row.relatorios,

                ia:
                    row.ia

            });

        });

    } catch (erro) {

        console.error(
            "Erro no dashboard:",
            erro
        );

        res.status(500).json({

            erro:
                erro.message

        });

    }

}


module.exports = {

    dashboard

};