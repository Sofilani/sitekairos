const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/usuarios", usuarioController.cadastrar);

module.exports = router;

router.get("/usuarios", (req, res) => {
    res.send("Rota de usuários funcionando!");
});
