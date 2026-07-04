const db = require("../database/database");
const bcrypt = require("bcrypt");

async function criarUsuario(nome, email, senha) {

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    return new Promise((resolve, reject) => {

        db.run(

            `INSERT INTO usuarios
            (nome,email,senha)
            VALUES(?,?,?)`,

            [nome, email, senhaCriptografada],

            function(err){

                if(err){

                    reject(err);

                }else{

                    resolve(this.lastID);

                }

            }

        );

    });

}

module.exports = {
    criarUsuario
};