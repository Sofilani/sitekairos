const tf = require("@tensorflow/tfjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

let modelo = null;


// ===============================
// CARREGAR MODELO
// ===============================

async function carregarModelo() {

    try {

        if (modelo) {
            return modelo;
        }

        console.log("Carregando modelo de IA...");

        const pastaModelo = path.join(
            __dirname,
            "modelo"
        );

        const caminhoModelo = path.join(
            pastaModelo,
            "model.json"
        );

        // ===============================
        // LER MODEL.JSON
        // ===============================

        const modelJSON = JSON.parse(
            fs.readFileSync(
                caminhoModelo,
                "utf8"
            )
        );

        console.log("model.json carregado.");

        // ===============================
        // PEGAR PESOS
        // ===============================

        const arquivosBin =
            modelJSON.weightsManifest
                .flatMap(
                    manifest => manifest.paths
                );

        console.log(
            "Arquivos de pesos:",
            arquivosBin
        );

        const buffers = arquivosBin.map(
            arquivo =>
                fs.readFileSync(
                    path.join(
                        pastaModelo,
                        arquivo
                    )
                )
        );

        // ===============================
        // JUNTAR PESOS
        // ===============================

        const tamanhoTotal =
            buffers.reduce(
                (total, buffer) =>
                    total + buffer.length,
                0
            );

        const pesos =
            new Uint8Array(tamanhoTotal);

        let posicao = 0;

        for (const buffer of buffers) {

            pesos.set(
                buffer,
                posicao
            );

            posicao += buffer.length;

        }

        console.log(
            "Pesos carregados:",
            pesos.length,
            "bytes"
        );

        // ===============================
        // ESPECIFICAÇÕES DOS PESOS
        // ===============================

        const weightSpecs =
            modelJSON.weightsManifest
                .flatMap(
                    manifest =>
                        manifest.weights
                );

        // ===============================
        // CRIAR MODELO
        // ===============================

        const handler = tf.io.fromMemory({

            modelTopology:
                modelJSON.modelTopology,

            weightSpecs,

            weightData:
                pesos.buffer

        });

        modelo =
            await tf.loadLayersModel(
                handler
            );

        console.log(
            "Modelo de IA carregado com sucesso!"
        );

        return modelo;

    } catch (erro) {

        console.error(
            "Erro ao carregar modelo de IA:",
            erro
        );

        throw erro;

    }

}


// ===============================
// ANALISAR IMAGEM
// ===============================

async function analisarImagem(caminhoImagem) {

    try {

        // Garante que o modelo esteja carregado

        const modeloCarregado =
            await carregarModelo();


        console.log(
            "Analisando imagem:",
            caminhoImagem
        );


        // ===============================
        // PREPARAR IMAGEM
        // ===============================

        const bufferImagem =
            await sharp(caminhoImagem)

                // O modelo espera 224x224

                .resize(224, 224)

                // Garantimos RGB

                .removeAlpha()

                .raw()

                .toBuffer();


        // ===============================
        // TRANSFORMAR EM TENSOR
        // ===============================

        const tensor =
            tf.tensor3d(
                new Uint8Array(bufferImagem),
                [224, 224, 3]
            );


        // ===============================
        // NORMALIZAR
        // ===============================

        const entrada =
            tensor
                .toFloat()
                .div(255)
                .expandDims(0);


        // ===============================
        // FAZER PREVISÃO
        // ===============================

        const previsao =
            modelo.predict(entrada);


        const probabilidades =
            await previsao.data();


        // ===============================
        // IDENTIFICAR RESULTADO
        // ===============================

        const probBacteria =
            probabilidades[0];

        const probFundo =
            probabilidades[1];


        const resultado =
            probBacteria >= probFundo
                ? "Bactéria"
                : "Fundo Vazio";


        const confianca =
            Math.max(
                probBacteria,
                probFundo
            );


        // ===============================
        // LIBERAR MEMÓRIA
        // ===============================

        tensor.dispose();
        entrada.dispose();
        previsao.dispose();


        // ===============================
        // RETORNAR RESULTADO
        // ===============================

        return {

            resultado,

            confianca,

            probabilidades: {

                bacteria:
                    probBacteria,

                fundoVazio:
                    probFundo

            }

        };

    } catch (erro) {

        console.error(
            "Erro ao analisar imagem:",
            erro
        );

        throw erro;

    }

}


// ===============================
// TESTAR MODELO
// ===============================

async function testar() {

    const modeloCarregado =
        await carregarModelo();

    console.log(
        "IA pronta para receber imagens."
    );

    return modeloCarregado;

}


// ===============================
// EXPORTAR
// ===============================

module.exports = {

    carregarModelo,

    analisarImagem,

    testar

};