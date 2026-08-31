const path = require("path");

const iaService =
    require("./ia/iaService");


async function iniciar() {

    try {

        console.log(
            "=============================="
        );

        console.log(
            "TESTE DA ANÁLISE DE IMAGEM"
        );

        console.log(
            "=============================="
        );


        const caminhoImagem =
            path.join(
                __dirname,
                "..",
                "uploads",
                "amostras",
                "bacteria.webp"
            );


        const resultado =
            await iaService.analisarImagem(
                caminhoImagem
            );


        console.log(
            "\n=============================="
        );

        console.log(
            "RESULTADO DA IA"
        );

        console.log(
            "=============================="
        );

        console.log(
            "Resultado:",
            resultado.resultado
        );

        console.log(
            "Confiança:",
            (
                resultado.confianca * 100
            ).toFixed(2) + "%"
        );

        console.log(
            "Bactéria:",
            (
                resultado.probabilidades.bacteria * 100
            ).toFixed(2) + "%"
        );

        console.log(
            "Fundo Vazio:",
            (
                resultado.probabilidades.fundoVazio * 100
            ).toFixed(2) + "%"
        );

        console.log(
            "=============================="
        );


    } catch (erro) {

        console.error(
            "\nTESTE FALHOU."
        );

        console.error(erro);

    }

}


iniciar();