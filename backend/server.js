const express = require("express");
const cors = require("cors");
const db = require("./database/database");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(usuarioRoutes);

app.get("/", (req, res) => {
    res.send("Servidor KAIRÓS funcionando! ");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});