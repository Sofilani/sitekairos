const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./database/database");
const usuarioRoutes = require("./routes/usuarioRoutes");
const estatisticasRoutes = require("./routes/estatisticasRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(usuarioRoutes);
app.use(estatisticasRoutes);
app.use(pacienteRoutes);

app.get("/", (req, res) => {
    res.send("Servidor KAIRÓS funcionando! ");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});