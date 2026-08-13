const express = require("express");

const router = express.Router();

const imagemAmostraController =
    require("../controllers/imagemAmostraController");


// ===============================
// SALVAR IMAGEM
// ===============================

router.post(
    "/imagens-amostras",
    imagemAmostraController.salvar
);


// ===============================
// LISTAR IMAGENS DE UMA AMOSTRA
// ===============================

router.get(
    "/amostras/:id/imagens",
    imagemAmostraController.listarPorAmostra
);


module.exports = router;