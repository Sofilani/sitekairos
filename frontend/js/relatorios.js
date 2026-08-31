// ===============================
// MENU RESPONSIVO
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const hamburger =
        document.getElementById("hamburgerBtn");

    const navMenu =
        document.getElementById("navMenu");

    if (hamburger && navMenu) {

        hamburger.addEventListener("click", () => {

            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");

        });

        document.addEventListener("click", (e) => {

            if (
                !hamburger.contains(e.target) &&
                !navMenu.contains(e.target)
            ) {

                hamburger.classList.remove("active");
                navMenu.classList.remove("active");

            }

        });

    }

});


// ===============================
// RELATÓRIO ATUAL
// ===============================

let relatorioAtual = null;


// ===============================
// CARREGAR RELATÓRIOS
// ===============================

async function carregarRelatorios() {

    const tbody =
        document.getElementById("listaRelatorios");

    if (!tbody) {

        console.error(
            "Elemento #listaRelatorios não encontrado."
        );

        return;

    }

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/relatorios"
            );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar relatórios."
            );

        }

        const relatorios =
            await resposta.json();

        tbody.innerHTML = "";

        if (
            !relatorios ||
            relatorios.length === 0
        ) {

            tbody.innerHTML = `
                <tr>

                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:25px;
                            color:#888;
                        "
                    >

                        Nenhum relatório gerado
                        até o momento.

                    </td>

                </tr>
            `;

            return;

        }

        relatorios.forEach((relatorio) => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${relatorio.id}
                    </td>

                    <td>
                        ${relatorio.paciente || "-"}
                    </td>

                    <td>
                        ${relatorio.tipo || "-"}
                    </td>

                    <td>
                        ${relatorio.data_emissao || "-"}
                    </td>

                    <td>
                        ${relatorio.status || "-"}
                    </td>

                    <td>

                        <button
                            class="btn-primary"
                            onclick="visualizarRelatorio(${relatorio.id})"
                        >

                            👁 Visualizar

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar relatórios:",
            erro
        );

    }

}


// ===============================
// VISUALIZAR RELATÓRIO
// ===============================

async function visualizarRelatorio(id) {

    console.log(
        "ID do relatório selecionado:",
        id
    );

    try {

        const resposta =
            await fetch(
                `http://localhost:3000/relatorios/${id}`
            );

        console.log(
            "Status da resposta:",
            resposta.status
        );

        if (!resposta.ok) {

            alert(
                "Não foi possível encontrar o relatório."
            );

            return;

        }

        const relatorio =
            await resposta.json();

        console.log(
            "Relatório recebido:",
            relatorio
        );


        // ===============================
        // GUARDAR ID
        // ===============================

        relatorioAtual =
            relatorio.id;

        console.log(
            "Relatório atual:",
            relatorioAtual
        );


        // ===============================
        // PREENCHER DADOS
        // ===============================

        const paciente =
            document.getElementById(
                "relatorioPaciente"
            );

        const tipo =
            document.getElementById(
                "relatorioTipo"
            );

        const dataColeta =
            document.getElementById(
                "relatorioDataColeta"
            );

        const dataEmissao =
            document.getElementById(
                "relatorioDataEmissao"
            );

        const status =
            document.getElementById(
                "relatorioStatus"
            );

        const resultado =
            document.getElementById(
                "relatorioResultado"
            );

        const laudo =
            document.getElementById(
                "relatorioLaudo"
            );


        if (paciente)
            paciente.textContent =
                relatorio.paciente || "-";

        if (tipo)
            tipo.textContent =
                relatorio.tipo || "-";

        if (dataColeta)
            dataColeta.textContent =
                relatorio.data_coleta || "-";

        if (dataEmissao)
            dataEmissao.textContent =
                relatorio.data_emissao || "-";

        if (status)
            status.textContent =
                relatorio.status || "-";

        if (resultado)
            resultado.value =
                relatorio.resultado || "";

        if (laudo)
            laudo.value =
                relatorio.laudo || "";


        // ===============================
        // MOSTRAR IMAGENS
        // ===============================

        const containerImagens =
            document.getElementById(
                "imagensRelatorio"
            );

        if (containerImagens) {

            containerImagens.innerHTML = "";

            if (
                relatorio.imagens &&
                relatorio.imagens.length > 0
            ) {

                relatorio.imagens.forEach(
                    (imagem) => {

                        const div =
                            document.createElement(
                                "div"
                            );

                        div.className =
                            "imagem-relatorio";

                        div.innerHTML = `

                            <img
                                src="${imagem.arquivo}"
                                alt="Imagem da amostra"
                            >

                            <div class="info-imagem">

                                <strong>
                                    Câmera:
                                </strong>

                                ${imagem.camera || "-"}

                            </div>

                        `;

                        containerImagens.appendChild(
                            div
                        );

                    }
                );

            } else {

                containerImagens.innerHTML = `
                    <p>
                        Nenhuma imagem registrada.
                    </p>
                `;

            }

        }


        // ===============================
        // CARREGAR ANÁLISE DA IA
        // ===============================

        const iaResultado =
            document.getElementById(
                "iaResultado"
            );

        const iaConfianca =
            document.getElementById(
                "iaConfianca"
            );

        const iaTempo =
            document.getElementById(
                "iaTempo"
            );


        // Estado inicial

        if (iaResultado)
            iaResultado.textContent =
                "Carregando...";

        if (iaConfianca)
            iaConfianca.textContent =
                "-";

        if (iaTempo)
            iaTempo.textContent =
                "-";


        try {

            const respostaIA =
                await fetch(
                    `http://localhost:3000/relatorios/${id}/analises-ia`
                );


            if (respostaIA.ok) {

                const analises =
                    await respostaIA.json();

                console.log(
                    "Análises da IA:",
                    analises
                );


                if (
                    analises &&
                    analises.length > 0
                ) {

                    // A API retorna
                    // da mais recente para a mais antiga

                    const analise =
                        analises[0];


                    if (iaResultado) {

                        iaResultado.textContent =
                            analise.resultado || "-";

                    }


                    if (iaConfianca) {

                        iaConfianca.textContent =
                            analise.confianca != null
                                ? `${(
                                    analise.confianca * 100
                                ).toFixed(2)}%`
                                : "-";

                    }


                    if (iaTempo) {

                        iaTempo.textContent =
                            analise.tempo_processamento != null
                                ? `${analise.tempo_processamento} segundos`
                                : "-";

                    }

                } else {

                    if (iaResultado)
                        iaResultado.textContent =
                            "Nenhuma análise realizada.";

                    if (iaConfianca)
                        iaConfianca.textContent =
                            "-";

                    if (iaTempo)
                        iaTempo.textContent =
                            "-";

                }

            } else {

                if (iaResultado)
                    iaResultado.textContent =
                        "Nenhuma análise realizada.";

            }

        } catch (erroIA) {

            console.error(
                "Erro ao carregar análise da IA:",
                erroIA
            );

            if (iaResultado)
                iaResultado.textContent =
                    "Não foi possível carregar a análise.";

            if (iaConfianca)
                iaConfianca.textContent =
                    "-";

            if (iaTempo)
                iaTempo.textContent =
                    "-";

        }


        // ===============================
        // ABRIR MODAL
        // ===============================

        const modal =
            document.getElementById(
                "modalRelatorio"
            );

        if (modal) {

            modal.style.display =
                "flex";

        } else {

            console.error(
                "Elemento #modalRelatorio não encontrado."
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao visualizar relatório:",
            erro
        );

        alert(
            "Erro ao carregar o relatório."
        );

    }

}


// ===============================
// FECHAR MODAL
// ===============================

const btnFecharRelatorio =
    document.getElementById(
        "fecharRelatorio"
    );

if (btnFecharRelatorio) {

    btnFecharRelatorio.onclick = () => {

        const modal =
            document.getElementById(
                "modalRelatorio"
            );

        if (modal) {

            modal.style.display =
                "none";

        }

        relatorioAtual = null;

    };

}


// ===============================
// FECHAR CLICANDO FORA
// ===============================

const modalRelatorio =
    document.getElementById(
        "modalRelatorio"
    );

if (modalRelatorio) {

    modalRelatorio.addEventListener(
        "click",
        (e) => {

            if (
                e.target === modalRelatorio
            ) {

                modalRelatorio.style.display =
                    "none";

                relatorioAtual = null;

            }

        }
    );

}


// ===============================
// SALVAR RELATÓRIO
// ===============================

const btnSalvarRelatorio =
    document.getElementById(
        "salvarRelatorio"
    );

if (btnSalvarRelatorio) {

    btnSalvarRelatorio.onclick =
        async () => {

            if (!relatorioAtual) {

                alert(
                    "Nenhum relatório selecionado."
                );

                return;

            }


            const resultado =
                document.getElementById(
                    "relatorioResultado"
                ).value;


            const laudo =
                document.getElementById(
                    "relatorioLaudo"
                ).value;


            try {

                const resposta =
                    await fetch(
                        `http://localhost:3000/relatorios/${relatorioAtual}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                resultado,
                                laudo
                            })
                        }
                    );


                const dados =
                    await resposta.json();


                alert(
                    dados.mensagem ||
                    dados.erro
                );


                if (resposta.ok) {

                    document.getElementById(
                        "modalRelatorio"
                    ).style.display =
                        "none";

                    relatorioAtual =
                        null;

                    carregarRelatorios();

                }

            } catch (erro) {

                console.error(
                    "Erro ao salvar relatório:",
                    erro
                );

                alert(
                    "Erro ao salvar o relatório."
                );

            }

        };

}


// ===============================
// GERAR PDF
// ===============================

const btnGerarPDF =
    document.getElementById(
        "gerarPDF"
    );

if (btnGerarPDF) {

    btnGerarPDF.onclick = () => {

        if (!relatorioAtual) {

            alert(
                "Nenhum relatório selecionado."
            );

            return;

        }

        window.open(
            `http://localhost:3000/relatorios/${relatorioAtual}/pdf`,
            "_blank"
        );

    };

}


// ===============================
// ANALISAR IMAGEM COM IA
// ===============================

const btnAnalisarIA =
    document.getElementById(
        "analisarIA"
    );

if (btnAnalisarIA) {

    btnAnalisarIA.onclick =
        async () => {

            if (!relatorioAtual) {

                alert(
                    "Nenhum relatório selecionado."
                );

                return;

            }


            try {

                // ===============================
                // BUSCAR RELATÓRIO
                // ===============================

                const resposta =
                    await fetch(
                        `http://localhost:3000/relatorios/${relatorioAtual}`
                    );


                if (!resposta.ok) {

                    alert(
                        "Não foi possível carregar as imagens."
                    );

                    return;

                }


                const relatorio =
                    await resposta.json();


                // ===============================
                // VERIFICAR IMAGENS
                // ===============================

                if (
                    !relatorio.imagens ||
                    relatorio.imagens.length === 0
                ) {

                    alert(
                        "Este relatório não possui imagens para analisar."
                    );

                    return;

                }


                // Primeira imagem

                const imagem =
                    relatorio.imagens[0];


                console.log(
                    "Imagem selecionada:",
                    imagem
                );


                if (!imagem.arquivo) {

                    alert(
                        "A imagem não possui um arquivo válido."
                    );

                    return;

                }


                // ===============================
                // BAIXAR IMAGEM
                // ===============================

                const respostaImagem =
                    await fetch(
                        imagem.arquivo
                    );


                if (!respostaImagem.ok) {

                    alert(
                        "Não foi possível acessar a imagem."
                    );

                    return;

                }


                const blob =
                    await respostaImagem.blob();


                // ===============================
                // CRIAR ARQUIVO
                // ===============================

                const nomeArquivo =
                    imagem.arquivo
                        .split("/")
                        .pop() ||
                    "imagem.webp";


                const arquivoImagem =
                    new File(
                        [blob],
                        nomeArquivo,
                        {
                            type:
                                blob.type ||
                                "image/webp"
                        }
                    );


                // ===============================
                // FORM DATA
                // ===============================

                const formData =
                    new FormData();


                formData.append(
                    "imagem",
                    arquivoImagem
                );


                formData.append(
                    "relatorio_id",
                    relatorioAtual
                );


                formData.append(
                    "imagem_id",
                    imagem.id
                );


                // ===============================
                // BOTÃO
                // ===============================

                btnAnalisarIA.disabled =
                    true;

                btnAnalisarIA.textContent =
                    "🧠 Analisando...";


                // ===============================
                // ENVIAR PARA IA
                // ===============================

                const respostaIA =
                    await fetch(
                        "http://localhost:3000/analises-ia/imagem",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const dadosIA =
                    await respostaIA.json();


                console.log(
                    "Resposta da IA:",
                    dadosIA
                );


                if (!respostaIA.ok) {

                    alert(
                        dadosIA.erro ||
                        "Erro ao analisar imagem."
                    );

                    return;

                }


                // ===============================
                // MOSTRAR RESULTADO
                // ===============================

                const campoResultado =
                    document.getElementById(
                        "iaResultado"
                    );

                const campoConfianca =
                    document.getElementById(
                        "iaConfianca"
                    );

                const campoTempo =
                    document.getElementById(
                        "iaTempo"
                    );


                if (campoResultado) {

                    campoResultado.textContent =
                        dadosIA.resultado;

                }


                if (campoConfianca) {

                    campoConfianca.textContent =
                        (
                            dadosIA.confianca *
                            100
                        ).toFixed(2) + "%";

                }


                if (campoTempo) {

                    campoTempo.textContent =
                        dadosIA.tempo_processamento +
                        " segundos";

                }


                alert(
                    "Imagem analisada com sucesso!"
                );

            } catch (erro) {

                console.error(
                    "Erro ao analisar imagem:",
                    erro
                );

                alert(
                    "Erro ao comunicar com a IA."
                );

            } finally {

                btnAnalisarIA.disabled =
                    false;

                btnAnalisarIA.textContent =
                    "🧠 Analisar imagem com IA";

            }

        };// =====================================================
// MENU RESPONSIVO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const hamburger =
        document.getElementById("hamburgerBtn");

    const navMenu =
        document.getElementById("navMenu");


    if (hamburger && navMenu) {

        hamburger.addEventListener("click", () => {

            hamburger.classList.toggle("active");

            navMenu.classList.toggle("active");

        });


        document.addEventListener("click", (e) => {

            if (
                !hamburger.contains(e.target) &&
                !navMenu.contains(e.target)
            ) {

                hamburger.classList.remove("active");

                navMenu.classList.remove("active");

            }

        });

    }

});


// =====================================================
// RELATÓRIO ATUAL
// =====================================================

let relatorioAtual = null;


// =====================================================
// CARREGAR RELATÓRIOS
// =====================================================

async function carregarRelatorios() {

    const tbody =
        document.getElementById("listaRelatorios");


    if (!tbody) {

        console.error(
            "Elemento #listaRelatorios não encontrado."
        );

        return;

    }


    try {

        const resposta =
            await fetch(
                "http://localhost:3000/relatorios"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar relatórios."
            );

        }


        const relatorios =
            await resposta.json();


        tbody.innerHTML = "";


        if (
            !relatorios ||
            relatorios.length === 0
        ) {

            tbody.innerHTML = `
                <tr>

                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:25px;
                            color:#888;
                        "
                    >

                        Nenhum relatório
                        gerado até o momento.

                    </td>

                </tr>
            `;

            return;

        }


        relatorios.forEach((relatorio) => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${relatorio.id}
                    </td>


                    <td>
                        ${relatorio.paciente || "-"}
                    </td>


                    <td>
                        ${relatorio.tipo || "-"}
                    </td>


                    <td>
                        ${relatorio.data_emissao || "-"}
                    </td>


                    <td>
                        ${relatorio.status || "-"}
                    </td>


                    <td>

                        <button
                            class="btn-primary"
                            onclick="
                                visualizarRelatorio(
                                    ${relatorio.id}
                                )
                            "
                        >

                            👁 Visualizar

                        </button>

                    </td>

                </tr>

            `;

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar relatórios:",
            erro
        );


        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:25px;
                        color:red;
                    "
                >

                    Erro ao carregar
                    os relatórios.

                </td>

            </tr>

        `;

    }

}


// =====================================================
// VISUALIZAR RELATÓRIO
// =====================================================

async function visualizarRelatorio(id) {

    console.log(
        "ID do relatório selecionado:",
        id
    );


    try {

        // ---------------------------------------------
        // BUSCAR RELATÓRIO
        // ---------------------------------------------

        const resposta =
            await fetch(
                `http://localhost:3000/relatorios/${id}`
            );


        console.log(
            "Status da resposta:",
            resposta.status
        );


        if (!resposta.ok) {

            alert(
                "Não foi possível encontrar o relatório."
            );

            return;

        }


        const relatorio =
            await resposta.json();


        console.log(
            "Relatório recebido:",
            relatorio
        );


        // ---------------------------------------------
        // GUARDAR ID
        // ---------------------------------------------

        relatorioAtual =
            relatorio.id;


        console.log(
            "Relatório atual:",
            relatorioAtual
        );


        // ---------------------------------------------
        // PREENCHER DADOS
        // ---------------------------------------------

        const paciente =
            document.getElementById(
                "relatorioPaciente"
            );


        const tipo =
            document.getElementById(
                "relatorioTipo"
            );


        const dataColeta =
            document.getElementById(
                "relatorioDataColeta"
            );


        const dataEmissao =
            document.getElementById(
                "relatorioDataEmissao"
            );


        const status =
            document.getElementById(
                "relatorioStatus"
            );


        const resultado =
            document.getElementById(
                "relatorioResultado"
            );


        const laudo =
            document.getElementById(
                "relatorioLaudo"
            );


        if (paciente) {

            paciente.textContent =
                relatorio.paciente || "-";

        }


        if (tipo) {

            tipo.textContent =
                relatorio.tipo || "-";

        }


        if (dataColeta) {

            dataColeta.textContent =
                relatorio.data_coleta || "-";

        }


        if (dataEmissao) {

            dataEmissao.textContent =
                relatorio.data_emissao || "-";

        }


        if (status) {

            status.textContent =
                relatorio.status || "-";

        }


        if (resultado) {

            resultado.value =
                relatorio.resultado || "";

        }


        if (laudo) {

            laudo.value =
                relatorio.laudo || "";

        }


        // ---------------------------------------------
        // MOSTRAR IMAGENS
        // ---------------------------------------------

        mostrarImagens(
            relatorio.imagens
        );


        // ---------------------------------------------
        // BUSCAR ANÁLISES DA IA
        // ---------------------------------------------

        await carregarAnalisesIA(id);


        // ---------------------------------------------
        // ABRIR MODAL
        // ---------------------------------------------

        const modal =
            document.getElementById(
                "modalRelatorio"
            );


        if (modal) {

            modal.style.display = "flex";

        } else {

            console.error(
                "Elemento #modalRelatorio não encontrado."
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao visualizar relatório:",
            erro
        );


        alert(
            "Erro ao carregar o relatório."
        );

    }

}


// =====================================================
// MOSTRAR IMAGENS
// =====================================================

function mostrarImagens(imagens) {

    const container =
        document.getElementById(
            "imagensRelatorio"
        );


    if (!container) {

        console.error(
            "Elemento #imagensRelatorio não encontrado."
        );

        return;

    }


    container.innerHTML = "";


    if (
        !imagens ||
        imagens.length === 0
    ) {

        container.innerHTML = `

            <p>
                Nenhuma imagem registrada.
            </p>

        `;

        return;

    }


    imagens.forEach((imagem) => {

        const div =
            document.createElement("div");


        div.className =
            "imagem-relatorio";


        div.innerHTML = `

            <img
                src="${imagem.arquivo}"
                alt="Imagem da amostra"
            >


            <div class="info-imagem">

                <strong>
                    Câmera:
                </strong>

                ${imagem.camera || "-"}

            </div>

        `;


        container.appendChild(div);

    });

}


// =====================================================
// CARREGAR ANÁLISES DA IA
// =====================================================

async function carregarAnalisesIA(id) {

    const container =
        document.getElementById(
            "analisesIaRelatorio"
        );


    if (!container) {

        console.error(
            "Elemento #analisesIaRelatorio não encontrado."
        );

        return;

    }


    container.innerHTML = `

        <p>
            Carregando análise da IA...
        </p>

    `;


    try {

        const resposta =
            await fetch(
                `http://localhost:3000/relatorios/${id}/analises-ia`
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as análises da IA."
            );

        }


        const analises =
            await resposta.json();


        console.log(
            "Análises da IA:",
            analises
        );


        container.innerHTML = "";


        if (
            !analises ||
            analises.length === 0
        ) {

            container.innerHTML = `

                <p>
                    Nenhuma análise realizada pela IA.
                </p>

            `;

            return;

        }


        // ---------------------------------------------
        // MOSTRAR TODAS AS ANÁLISES
        // ---------------------------------------------

        analises.forEach((analise) => {

            const div =
                document.createElement("div");


            div.className =
                "analise-ia";


            const confianca =
                analise.confianca != null
                    ? (
                        Number(
                            analise.confianca
                        ) * 100
                    ).toFixed(2) + "%"
                    : "-";


            const tempo =
                analise.tempo_processamento != null
                    ? `${analise.tempo_processamento} segundos`
                    : "-";


            div.innerHTML = `

                <div class="resultado-ia">

                    <p>

                        <strong>
                            Resultado:
                        </strong>

                        ${analise.resultado || "-"}

                    </p>


                    <p>

                        <strong>
                            Confiança:
                        </strong>

                        ${confianca}

                    </p>


                    <p>

                        <strong>
                            Tempo de processamento:
                        </strong>

                        ${tempo}

                    </p>


                    ${
                        analise.arquivo
                            ? `
                                <p>

                                    <strong>
                                        Imagem analisada:
                                    </strong>

                                    ${analise.arquivo}

                                </p>
                            `
                            : ""
                    }


                    ${
                        analise.camera
                            ? `
                                <p>

                                    <strong>
                                        Câmera:
                                    </strong>

                                    ${analise.camera}

                                </p>
                            `
                            : ""
                    }

                </div>

            `;


            container.appendChild(div);

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar análises da IA:",
            erro
        );


        container.innerHTML = `

            <p>

                Não foi possível carregar
                as análises da IA.

            </p>

        `;

    }

}


// =====================================================
// FECHAR MODAL
// =====================================================

const btnFecharRelatorio =
    document.getElementById(
        "fecharRelatorio"
    );


if (btnFecharRelatorio) {

    btnFecharRelatorio.onclick = () => {

        const modal =
            document.getElementById(
                "modalRelatorio"
            );


        if (modal) {

            modal.style.display = "none";

        }


        relatorioAtual = null;

    };

}


// =====================================================
// FECHAR CLICANDO FORA
// =====================================================

const modalRelatorio =
    document.getElementById(
        "modalRelatorio"
    );


if (modalRelatorio) {

    modalRelatorio.addEventListener(
        "click",
        (e) => {

            if (
                e.target === modalRelatorio
            ) {

                modalRelatorio.style.display =
                    "none";

                relatorioAtual = null;

            }

        }
    );

}


// =====================================================
// SALVAR RELATÓRIO
// =====================================================

const btnSalvarRelatorio =
    document.getElementById(
        "salvarRelatorio"
    );


if (btnSalvarRelatorio) {

    btnSalvarRelatorio.onclick =
        async () => {

            if (!relatorioAtual) {

                alert(
                    "Nenhum relatório selecionado."
                );

                return;

            }


            const resultado =
                document.getElementById(
                    "relatorioResultado"
                ).value;


            const laudo =
                document.getElementById(
                    "relatorioLaudo"
                ).value;


            try {

                const resposta =
                    await fetch(

                        `http://localhost:3000/relatorios/${relatorioAtual}`,

                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    resultado,
                                    laudo

                                })

                        }

                    );


                const dados =
                    await resposta.json();


                alert(
                    dados.mensagem ||
                    dados.erro ||
                    "Operação concluída."
                );


                if (resposta.ok) {

                    const modal =
                        document.getElementById(
                            "modalRelatorio"
                        );


                    if (modal) {

                        modal.style.display =
                            "none";

                    }


                    carregarRelatorios();


                    relatorioAtual = null;

                }


            } catch (erro) {

                console.error(
                    "Erro ao salvar relatório:",
                    erro
                );


                alert(
                    "Erro ao salvar o relatório."
                );

            }

        };

}


// =====================================================
// GERAR PDF
// =====================================================

const btnGerarPDF =
    document.getElementById(
        "gerarPDF"
    );


if (btnGerarPDF) {

    btnGerarPDF.onclick = () => {

        if (!relatorioAtual) {

            alert(
                "Nenhum relatório selecionado."
            );

            return;

        }


        window.open(

            `http://localhost:3000/relatorios/${relatorioAtual}/pdf`,

            "_blank"

        );

    };

}


// =====================================================
// INICIAR
// =====================================================

carregarRelatorios();

}


// ===============================
// INICIAR
// ===============================

carregarRelatorios();