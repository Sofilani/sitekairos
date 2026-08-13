const db = require("../database/database");


// ===============================
// SALVAR IMAGEM
// ===============================

function salvarImagem(imagem) {

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO imagens_amostras
            (amostra_id, arquivo, camera)
            VALUES (?, ?, ?)`,

            [
                imagem.amostra_id,
                imagem.arquivo,
                imagem.camera
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


// ===============================
// LISTAR IMAGENS DE UMA AMOSTRA
// ===============================

function listarImagensPorAmostra(amostra_id) {

    return new Promise((resolve, reject) => {

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

            [amostra_id],

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


module.exports = {

    salvarImagem,
    listarImagensPorAmostra

};