const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./database/database");
const usuarioRoutes = require("./routes/usuarioRoutes");
const analiseIaRoutes =
    require("./routes/analiseIaRoutes");
const imagemAmostraRoutes = require("./routes/imagemAmostraRoutes");
const estatisticasRoutes = require("./routes/estatisticasRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const amostraRoutes = require("./routes/amostraRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const integracaoIaRoutes =
    require("./routes/integracaoIaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);
app.use(usuarioRoutes);
app.use(estatisticasRoutes);
app.use(pacienteRoutes);
app.use(amostraRoutes);
app.use(relatorioRoutes);
app.use(imagemAmostraRoutes);
app.use(analiseIaRoutes);
app.use(integracaoIaRoutes);

app.get("/", (req, res) => {
    res.send("Servidor KAIRÓS funcionando! ");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});