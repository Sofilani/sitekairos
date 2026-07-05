const db = require("../database/database");

async function dashboard(req, res) {

    try {

        db.get(`
            SELECT
                (SELECT COUNT(*) FROM usuarios) AS usuarios
        `,

        (err, row) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({

                pacientes: 0,

                amostras: 0,

                relatorios: 0,

                ia: 0,

                usuarios: row.usuarios

            });

        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

}

module.exports = {
    dashboard
};