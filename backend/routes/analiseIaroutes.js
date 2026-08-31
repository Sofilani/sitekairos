const express = require("express");

const router = express.Router();

const analiseIaController =
    require("../controllers/analiseIaController");


// ===============================
// SALVAR ANÁLISE DA IA
// ===============================

router.post(
    "/analises-ia",
    analiseIaController.salvar
);


// ===============================
// LISTAR ANÁLISES DE UM RELATÓRIO
// ===============================

router.get(
    "/analises-ia/:id",
    analiseIaController.listarPorRelatorio
);


module.exports = router;