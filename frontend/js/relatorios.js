// =====================================================
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
// USUÁRIO LOGADO
// =====================================================

const usuarioSalvo =
    localStorage.getItem("usuario");

if (!usuarioSalvo) {

    alert("Usuário não identificado. Faça login novamente.");

    window.location.href = "index.html";

}

const usuario =
    JSON.parse(usuarioSalvo);

const usuarioId =
    usuario.id;

const nomeUsuario =
    document.getElementById("nomeUsuario");

if (nomeUsuario) {
    nomeUsuario.textContent = usuario.nome;
}


// =====================================================
// RELATÓRIO ATUAL
// =====================================================

let relatorioAtual = null;


// =====================================================
// CARREGAR RELATÓRIOS
// =====================================================

async function carregarRelatorios() {

    const tbody =
        document.getElementById(
            "listaRelatorios"
        );


    if (!tbody) {

        console.error(
            "Elemento #listaRelatorios não encontrado."
        );

        return;

    }


    try {

       const resposta = await fetch(
    `http://localhost:3000/relatorios?usuario_id=${usuarioId}`
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

       const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo) {
    window.location.href = "index.html";
    return;
}

const usuario = JSON.parse(usuarioSalvo);

const resposta = await fetch(
    `http://localhost:3000/relatorios/${id}?usuario_id=${usuario.id}`
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

const relatorio = await resposta.json();

if (!relatorio) {
    alert(
        "Relatório não encontrado."
    );
    return;
}


if (!relatorio) {

    alert(
        "Relatório não encontrado."
    );

    return;

}


console.log(
    "Relatório recebido:",
    relatorio
);


// ---------------------------------------------
// GUARDAR ID DO RELATÓRIO
// ---------------------------------------------

relatorioAtual =
    id;


console.log(
    "Relatório atual:",
    relatorioAtual
);

        console.log(
            "Relatório atual:",
            relatorioAtual
        );


        // ---------------------------------------------
        // PREENCHER DADOS DO RELATÓRIO
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
        // CARREGAR ANÁLISES DA IA
        // ---------------------------------------------

       await carregarAnalisesIA(id);


/// ---------------------------------------------
// CARREGAR REVISÃO MÉDICA SALVA
// ---------------------------------------------

const opcoesConfirmacao =
    document.querySelectorAll(
        'input[name="confirmacaoIa"]'
    );

const campoRevisaoMedica =
    document.getElementById(
        "campoRevisaoMedica"
    );

const revisaoMedica =
    document.getElementById(
        "revisaoMedica"
    );

// Primeiro, limpar os campos
opcoesConfirmacao.forEach((opcao) => {
    opcao.checked = false;
});

if (campoRevisaoMedica) {
    campoRevisaoMedica.style.display = "none";
}

if (revisaoMedica) {
    revisaoMedica.value = "";
}

// Depois, carregar o que está salvo
if (relatorio.revisao_status) {

    const opcaoSalva =
        document.querySelector(
            `input[name="confirmacaoIa"][value="${relatorio.revisao_status}"]`
        );

    if (opcaoSalva) {
        opcaoSalva.checked = true;
    }

    if (
        relatorio.revisao_status === "alterar"
    ) {

        if (campoRevisaoMedica) {
            campoRevisaoMedica.style.display =
                "block";
        }

        if (revisaoMedica) {
            revisaoMedica.value =
                relatorio.revisao_medica || "";
        }

    }

}


// ---------------------------------------------
// ABRIR MODAL
// -----------------------------------------------------------------------------------------

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


// =====================================================
// MOSTRAR IMAGENS
// =====================================================

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


        // =============================================
        // CORRIGIR CAMINHO DA IMAGEM
        // =============================================

        let caminhoImagem =
            imagem.arquivo;


        if (
            caminhoImagem &&
            !caminhoImagem.startsWith("http")
        ) {

            if (
                !caminhoImagem.startsWith("/")
            ) {

                caminhoImagem =
                    "/uploads/" +
                    caminhoImagem;

            }

            caminhoImagem =
                "http://localhost:3000" +
                caminhoImagem;

        }


        console.log(
            "Imagem sendo carregada:",
            caminhoImagem
        );


        div.innerHTML = `

            <img
                src="${caminhoImagem}"
                alt="Imagem da amostra"
                onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('beforeend', '<p>Não foi possível carregar esta imagem.</p>')"
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

        const resposta = await fetch(
            `http://localhost:3000/relatorios/${id}/analises-ia?usuario_id=${usuario.id}`
        );

        console.log(
            "Status da resposta das análises IA:",
            resposta.status
        );

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as análises da IA."
            );

        }

        const analises =
            await resposta.json();

        container.innerHTML = "";

        if (!analises || analises.length === 0) {

            container.innerHTML = `

                <p>
                    Nenhuma análise da IA encontrada.
                </p>

            `;

            return;

        }

        // ---------------------------------------------
        // MOSTRAR TODAS AS ANÁLISES
        // ---------------------------------------------

        analises.forEach((analise) => {

            const div =
                document.createElement(
                    "div"
                );

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

            container.appendChild(
                div
            );

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

            modal.style.display =
                "none";

        }


        relatorioAtual = null;

    };

}


// =====================================================
// FECHAR CLICANDO FORA DO MODAL
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


            const campoResultado =
                document.getElementById(
                    "relatorioResultado"
                );


            const campoLaudo =
                document.getElementById(
                    "relatorioLaudo"
                );


            const resultado =
                campoResultado
                    ? campoResultado.value
                    : "";


            const laudo =
                campoLaudo
                    ? campoLaudo.value
                    : "";

                    const opcaoConfirmacao =
    document.querySelector(
        'input[name="confirmacaoIa"]:checked'
    );

const revisaoStatus =
    opcaoConfirmacao
        ? opcaoConfirmacao.value
        : null;

const campoRevisaoMedica =
    document.getElementById(
        "revisaoMedica"
    );

const revisaoMedicaTexto =
    campoRevisaoMedica
        ? campoRevisaoMedica.value
        : "";
if (!revisaoStatus) {

    alert(
        "Selecione se você confirma a análise da IA ou se deseja alterá-la."
    );

    return;

}
if (
    revisaoStatus === "alterar" &&
    !revisaoMedicaTexto.trim()
) {

    alert(
        "Digite a alteração ou observação médica."
    );

    return;

}

            try {

                const resposta =
                    await fetch(

                        `http://localhost:3000/relatorios/${relatorioAtual}?usuario_id=${usuarioId}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                           body:
    JSON.stringify({

        resultado,
        laudo,
        revisao_status: revisaoStatus,
        revisao_medica: revisaoMedicaTexto,
        revisado_por: usuarioId

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
// REVISÃO MÉDICA
// =====================================================

const opcoesConfirmacao =
    document.querySelectorAll(
        'input[name="confirmacaoIa"]'
    );

const campoRevisaoMedica =
    document.getElementById(
        "campoRevisaoMedica"
    );

const revisaoMedica =
    document.getElementById(
        "revisaoMedica"
    );


// Quando o médico escolher uma opção
opcoesConfirmacao.forEach((opcao) => {

    opcao.addEventListener("change", () => {

        // ---------------------------------------------
        // MÉDICO CONFIRMOU A IA
        // ---------------------------------------------

        if (
            opcao.value === "confirmado" &&
            opcao.checked
        ) {

            if (campoRevisaoMedica) {

                campoRevisaoMedica.style.display =
                    "none";

            }

            if (revisaoMedica) {

                revisaoMedica.value = "";

            }

        }


        // ---------------------------------------------
        // MÉDICO QUER ALTERAR
        // ---------------------------------------------

        if (
            opcao.value === "alterar" &&
            opcao.checked
        ) {

            if (campoRevisaoMedica) {

                campoRevisaoMedica.style.display =
                    "block";

            }

        }

    });

});

// =====================================================
// INICIAR
// =====================================================

carregarRelatorios();