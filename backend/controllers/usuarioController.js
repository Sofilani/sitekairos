const usuarioModel = require("../models/usuarioModel");

async function cadastrar(req, res) {

    const { nome, email, senha } = req.body;

    try {

        await usuarioModel.criarUsuario(nome, email, senha);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!"
        });

    } catch (erro) {

        res.status(500).json({
            erro: "Este email já está em uso."
        });

    }

}

module.exports = {
    cadastrar
};