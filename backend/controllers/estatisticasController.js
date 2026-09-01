const db = require("../database/database");

async function dashboard(req, res) {

    try {

        db.get(`
            SELECT

                (SELECT COUNT(*) FROM pacientes) AS pacientes,

                (SELECT COUNT(*) FROM amostras) AS amostras,

                (SELECT COUNT(*) FROM relatorios) AS relatorios,

                (SELECT COUNT(*) FROM analises_ia) AS ia,

                (SELECT COUNT(*) FROM usuarios) AS usuarios

        `,

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
                    row.ia,

                usuarios:
                    row.usuarios

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