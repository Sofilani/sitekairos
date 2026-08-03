const express = require("express");

const router = express.Router();

const pacienteController = require("../controllers/pacienteController");

router.post("/pacientes", pacienteController.cadastrar);

router.get("/pacientes", pacienteController.listar);

router.delete("/pacientes/:id", pacienteController.excluir);

router.put("/pacientes/:id", pacienteController.atualizar);

module.exports = router;