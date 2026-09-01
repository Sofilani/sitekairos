// ==========================================
// SERVIÇO DE GERAÇÃO AUTOMÁTICA DO RELATÓRIO
// ==========================================

function gerarRelatorio(analises) {

    if (!analises || analises.length === 0) {

        return {
            resultado: "Nenhuma análise de IA disponível.",
            laudo: "Não foi possível gerar um laudo automático, pois nenhuma análise foi registrada.",
            status: "Aguardando análise"
        };

    }


    // ==========================================
    // CONSIDERAR APENAS ANÁLISES VÁLIDAS
    // ==========================================

    const analisesValidas =
        analises.filter(analise =>
            analise.resultado &&
            analise.confianca !== null &&
            analise.confianca !== undefined
        );


    if (analisesValidas.length === 0) {

        return {
            resultado: "Análise inconclusiva.",
            laudo: "As imagens foram processadas, porém não foram obtidos resultados suficientes para gerar um laudo automático.",
            status: "Aguardando revisão"
        };

    }


    // ==========================================
    // AGRUPAR RESULTADOS
    // ==========================================

    const contagem = {};


    analisesValidas.forEach(analise => {

        const resultado =
            analise.resultado.trim();


        if (!contagem[resultado]) {

            contagem[resultado] = 0;

        }


        contagem[resultado]++;

    });


    // ==========================================
    // ENCONTRAR RESULTADO MAIS FREQUENTE
    // ==========================================

    let resultadoPrincipal = null;

    let maiorQuantidade = 0;


    Object.entries(contagem).forEach(
        ([resultado, quantidade]) => {

            if (quantidade > maiorQuantidade) {

                maiorQuantidade = quantidade;

                resultadoPrincipal = resultado;

            }

        }
    );


    // ==========================================
    // MAIOR CONFIANÇA
    // ==========================================

    const maiorConfianca =
        Math.max(
            ...analisesValidas.map(
                analise =>
                    Number(analise.confianca)
            )
        );


    // ==========================================
    // CONFIANÇA MÉDIA
    // ==========================================

    const confiancaMedia =
        analisesValidas.reduce(
            (total, analise) =>
                total +
                Number(analise.confianca),
            0
        ) / analisesValidas.length;


    const confiancaPercentual =
        (confiancaMedia * 100).toFixed(2);


    // ==========================================
    // RESULTADO AUTOMÁTICO
    // ==========================================

    let resultadoFinal;


    if (
        resultadoPrincipal
            .toLowerCase()
            .includes("bactéria")
    ) {

        resultadoFinal =
            `Presença de ${resultadoPrincipal.toLowerCase()} detectada nas imagens analisadas.`;

    } else {

        resultadoFinal =
            `Resultado da análise de imagem: ${resultadoPrincipal}.`;

    }


    // ==========================================
    // LAUDO AUTOMÁTICO
    // ==========================================

    const laudoFinal =

        `Análise automatizada das imagens da amostra ` +
        `realizada pelo sistema de inteligência artificial. ` +

        `Foram analisadas ${analisesValidas.length} imagem(ns), ` +
        `com confiança média de ${confiancaPercentual}%. ` +

        `O resultado predominante identificado foi ` +
        `"${resultadoPrincipal}". ` +

        `A maior confiança registrada entre as análises foi ` +
        `${(maiorConfianca * 100).toFixed(2)}%. ` +

        `O resultado gerado automaticamente deve ser ` +
        `revisado e validado pelo responsável técnico antes da emissão definitiva do relatório.`;


    return {

        resultado: resultadoFinal,

        laudo: laudoFinal,

        status: "Aguardando revisão"

    };

}


// ==========================================
// EXPORTAR SERVIÇO
// ==========================================

module.exports = {

    gerarRelatorio

};