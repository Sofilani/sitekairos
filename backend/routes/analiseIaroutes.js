const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const analiseIaController =
    require("../controllers/analiseIaController");

    // ===============================
// CONFIGURAÇÃO DO UPLOAD
// ===============================

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(
            null,
            path.join(
                __dirname,
                "..",
                "..",
                "uploads",
                "ia"
            )
        );

    },

    filename: function(req, file, cb) {

        const nome =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, nome);

    }

});


const upload =
    multer({

        storage

    });
// ===============================
// SALVAR ANÁLISE DA IA
// ===============================

router.post(
    "/analises-ia",
    analiseIaController.salvar
);

// ===============================
// RECEBER IMAGEM E ANALISAR COM IA
// ===============================

router.post(

    "/analises-ia/imagem",

    upload.single("imagem"),

    analiseIaController.analisarImagem

);


// ===============================
// LISTAR ANÁLISES DE UM RELATÓRIO
// ===============================

router.get(
    "/relatorios/:id/analises-ia",
    analiseIaController.listarPorRelatorio
);


module.exports = router;