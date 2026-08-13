// ===============================
// MENU RESPONSIVO
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navMenu");

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
// RELATÓRIO SELECIONADO
// ===============================

// Aqui vamos guardar o ID do relatório
// que o usuário está visualizando/editando.

let relatorioAtual = null;


// ===============================
// CARREGAR RELATÓRIOS
// ===============================

async function carregarRelatorios() {

    const tbody = document.getElementById("listaRelatorios");

    try {

        const resposta = await fetch(
            "http://localhost:3000/relatorios"
        );

        const relatorios = await resposta.json();

        tbody.innerHTML = "";

        if (relatorios.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center; padding:25px;">
                        Nenhum relatório gerado até o momento.
                    </td>
                </tr>
            `;

            return;
        }

        relatorios.forEach((relatorio) => {

            tbody.innerHTML += `
                <tr>

                    <td>${relatorio.id}</td>

                    <td>${relatorio.paciente}</td>

                    <td>${relatorio.tipo}</td>

                    <td>${relatorio.data_emissao || "-"}</td>

                    <td>${relatorio.status}</td>

                    <td>

                        <button
                            class="btn-primary"
                            onclick="visualizarRelatorio(${relatorio.id})">

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

    console.log("ID do relatório selecionado:", id);

    try {

        const resposta = await fetch(
            `http://localhost:3000/relatorios/${id}`
        );

        console.log(
            "Status da resposta:",
            resposta.status
        );

        if (!resposta.ok) {

            alert("Não foi possível encontrar o relatório.");

            return;

        }

        const relatorio = await resposta.json();

        console.log(
            "Relatório recebido:",
            relatorio
        );


        // ==================================
        // O MAIS IMPORTANTE
        // ==================================

        // Guardamos o ID do relatório.

        relatorioAtual = relatorio.id;

        console.log(
            "Relatório atual:",
            relatorioAtual
        );


        // ==================================
        // PREENCHER O MODAL
        // ==================================

        document.getElementById(
            "relatorioPaciente"
        ).textContent = relatorio.paciente || "-";


        document.getElementById(
            "relatorioTipo"
        ).textContent = relatorio.tipo || "-";


        document.getElementById(
            "relatorioDataColeta"
        ).textContent = relatorio.data_coleta || "-";


        document.getElementById(
            "relatorioDataEmissao"
        ).textContent = relatorio.data_emissao || "-";


        document.getElementById(
            "relatorioStatus"
        ).textContent = relatorio.status || "-";


        document.getElementById(
            "relatorioResultado"
        ).value = relatorio.resultado || "";


        document.getElementById(
            "relatorioLaudo"
        ).value = relatorio.laudo || "";


        // Abre o modal

        document.getElementById(
            "modalRelatorio"
        ).style.display = "flex";


    } catch (erro) {

        console.error(
            "Erro ao visualizar relatório:",
            erro
        );

        alert("Erro ao carregar o relatório.");

    }

}


// ===============================
// FECHAR MODAL
// ===============================

const btnFecharRelatorio =
    document.getElementById("fecharRelatorio");

if (btnFecharRelatorio) {

    btnFecharRelatorio.onclick = () => {

        document.getElementById(
            "modalRelatorio"
        ).style.display = "none";

    };

}


// Fechar clicando fora do modal

const modalRelatorio =
    document.getElementById("modalRelatorio");

if (modalRelatorio) {

    modalRelatorio.addEventListener(
        "click",
        (e) => {

            if (e.target === modalRelatorio) {

                modalRelatorio.style.display = "none";

            }

        }
    );

}


// ===============================
// SALVAR ALTERAÇÕES
// ===============================

const btnSalvarRelatorio =
    document.getElementById("salvarRelatorio");


if (btnSalvarRelatorio) {

    btnSalvarRelatorio.onclick = async () => {


        // Verifica se existe um relatório selecionado

        if (!relatorioAtual) {

            alert("Nenhum relatório selecionado.");

            return;

        }


        // Pega os valores digitados

        const resultado =
            document.getElementById(
                "relatorioResultado"
            ).value;


        const laudo =
            document.getElementById(
                "relatorioLaudo"
            ).value;


        try {

            const resposta = await fetch(

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
                ).style.display = "none";


                // Atualiza a tabela

                carregarRelatorios();


                // Limpa o relatório selecionado

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


// ===============================
// INICIAR
// ===============================

carregarRelatorios();

// ===============================
// GERAR PDF
// ===============================

const btnGerarPDF =
    document.getElementById("gerarPDF");

if (btnGerarPDF) {

    btnGerarPDF.onclick = () => {

        if (!relatorioAtual) {

            alert("Nenhum relatório selecionado.");

            return;

        }

        window.open(
            `http://localhost:3000/relatorios/${relatorioAtual}/pdf`,
            "_blank"
        );

    };

}