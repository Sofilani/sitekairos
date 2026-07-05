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


function buscarPorEmail(email) {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM usuarios WHERE email = ?",
            [email],

            (err, row) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }

            }

        );

    });

}

module.exports = {

    criarUsuario,
    buscarPorEmail

};