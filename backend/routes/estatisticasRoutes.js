const express = require("express");

const router = express.Router();

const estatisticasController = require("../controllers/estatisticasController");

router.get("/dashboard", estatisticasController.dashboard);

module.exports = router;