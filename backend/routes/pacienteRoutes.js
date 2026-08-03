const express = require("express");

const router = express.Router();

const pacienteController = require("../controllers/pacienteController");

router.post("/pacientes", pacienteController.cadastrar);

router.get("/pacientes", pacienteController.listar);

module.exports = router;