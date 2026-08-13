const express = require("express");

const router = express.Router();

const relatorioController = require("../controllers/relatorioController");

router.post("/relatorios", relatorioController.cadastrar);

router.post("/relatorios/:id", relatorioController.gerar);

router.get("/relatorios", relatorioController.listar);

router.get("/relatorios/:id", relatorioController.buscar);

router.put("/relatorios/:id", relatorioController.atualizar);

module.exports = router;