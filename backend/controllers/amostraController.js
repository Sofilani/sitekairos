const amostraModel = require("../models/amostraModel");

async function cadastrar(req,res){

    try{

        const id = await amostraModel.criarAmostra(req.body);

        res.status(201).json({

            mensagem:"Amostra cadastrada com sucesso!",
            id

        });

    }catch(err){

        res.status(500).json({

            erro:err.message

        });

    }

}

async function listar(req,res){

    try{

        const amostras = await amostraModel.listarAmostras();

        res.json(amostras);

    }catch(err){

        res.status(500).json({

            erro:err.message

        });

    }

}

module.exports = {

    cadastrar,
    listar

};