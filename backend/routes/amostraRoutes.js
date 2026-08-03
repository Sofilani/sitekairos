const express = require("express");

const router = express.Router();

const amostraController = require("../controllers/amostraController");

router.post("/amostras", amostraController.cadastrar);

router.get("/amostras", amostraController.listar);

module.exports = router;