const bcrypt = require("bcrypt");
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

async function login(req, res) {
     console.log("===== LOGIN =====");
    console.log(req.body);

    try {

        const { email, senha } = req.body;

        // Procura o usuário
        const usuario = await usuarioModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        // Compara a senha digitada com a senha criptografada
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        res.json({
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo
            }
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

}

module.exports = {
    cadastrar,
    login
};