// ==========================================
// SERVIÇO DE GERAÇÃO AUTOMÁTICA DO RELATÓRIO
// ==========================================

function gerarRelatorio(analises) {

    // ==========================================
    // NENHUMA ANÁLISE
    // ==========================================

    if (!analises || analises.length === 0) {

        return {

            resultado:
                "Nenhuma análise de IA disponível.",

            laudo:
                "Não foi possível gerar um laudo automático, pois nenhuma análise foi registrada.",

            status:
                "Aguardando análise"

        };

    }


    // ==========================================
    // FILTRAR ANÁLISES VÁLIDAS
    // ==========================================

    const analisesValidas =
        analises.filter(analise => {

            return (

                analise.resultado &&
                analise.confianca !== null &&
                analise.confianca !== undefined

            );

        });


    // ==========================================
    // NENHUMA ANÁLISE VÁLIDA
    // ==========================================

    if (analisesValidas.length === 0) {

        return {

            resultado:
                "Análise inconclusiva.",

            laudo:
                "As imagens foram processadas, porém não foram obtidos resultados suficientes para gerar um laudo automático.",

            status:
                "Aguardando revisão"

        };

    }


    // ==========================================
    // CONTAR RESULTADOS
    // ==========================================

    const contagem = {};


    analisesValidas.forEach(analise => {

        const resultado =
            String(analise.resultado).trim();


        const chave =
            resultado.toLowerCase();


        if (!contagem[chave]) {

            contagem[chave] = {

                nome: resultado,

                quantidade: 0

            };

        }


        contagem[chave].quantidade++;

    });


    // ==========================================
    // RESULTADO MAIS FREQUENTE
    // ==========================================

    let resultadoPrincipal = null;

    let maiorQuantidade = 0;


    Object.values(contagem).forEach(item => {

        if (
            item.quantidade >
            maiorQuantidade
        ) {

            maiorQuantidade =
                item.quantidade;

            resultadoPrincipal =
                item.nome;

        }

    });


    // ==========================================
    // CONFIANÇA MÉDIA
    // ==========================================

    const confiancaMedia =

        analisesValidas.reduce(

            (total, analise) => {

                return (

                    total +
                    Number(analise.confianca)

                );

            },

            0

        ) / analisesValidas.length;


    // ==========================================
    // MAIOR CONFIANÇA
    // ==========================================

    const maiorConfianca =

        Math.max(

            ...analisesValidas.map(

                analise =>
                    Number(
                        analise.confianca
                    )

            )

        );


    // ==========================================
    // CONVERTER PARA PORCENTAGEM
    // ==========================================

    const confiancaMediaPercentual =

        (
            confiancaMedia * 100
        ).toFixed(2);


    const maiorConfiancaPercentual =

        (
            maiorConfianca * 100
        ).toFixed(2);


    // ==========================================
    // RESULTADO AUTOMÁTICO
    // ==========================================

    const resultadoFinal =

        `Resultado da análise de imagem: ${resultadoPrincipal}.`;


    // ==========================================
    // LAUDO AUTOMÁTICO
    // ==========================================

    const laudoFinal =

        `Foram analisadas ` +
        `${analisesValidas.length} imagem(ns) ` +
        `da amostra pelo sistema de inteligência artificial. ` +

        `O resultado predominante identificado foi ` +
        `"${resultadoPrincipal}". ` +

        `A confiança média das análises foi de ` +
        `${confiancaMediaPercentual}%, ` +

        `com maior confiança registrada de ` +
        `${maiorConfiancaPercentual}%. ` +

        `O resultado foi gerado automaticamente ` +
        `a partir das análises fornecidas pelo sistema ` +
        `de monitoramento e inteligência artificial. ` +

        `O conteúdo deve ser revisado e validado ` +
        `pelo responsável técnico antes da emissão ` +
        `definitiva do relatório.`;


    // ==========================================
    // RETORNAR
    // ==========================================

    return {

        resultado:
            resultadoFinal,

        laudo:
            laudoFinal,

        status:
            "Aguardando revisão"

    };

}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    gerarRelatorio

};