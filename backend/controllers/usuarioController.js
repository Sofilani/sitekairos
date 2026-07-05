const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");

async function cadastrar(req, res) {

    const { nome, email, senha } = req.body;

    try {

        const senhaCriptografada = await bcrypt.hash(senha, 10);

// Salva a senha criptografada
        await usuarioModel.criarUsuario(nome, email, senhaCriptografada);

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