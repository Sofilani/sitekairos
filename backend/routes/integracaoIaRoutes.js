const express = require("express");

const router =
    express.Router();

const integracaoIaController =
    require("../controllers/integracaoIaController");


router.post(
    "/integracao/analise-ia",
    integracaoIaController.receberAnalise
);


module.exports = router;