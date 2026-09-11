// =====================================================
// KAIRÓS - AMOSTRAS
// =====================================================


// =====================================================
// Menu responsivo
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
// Usuário logado
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
// Elementos
// =====================================================

const tbody =
    document.getElementById("listaAmostras");

const modal =
    document.getElementById("modal");

const btnNovaAmostra =
    document.getElementById("btnNovaAmostra");

const btnCancelar =
    document.getElementById("cancelar");

const btnSalvar =
    document.getElementById("salvar");


// =====================================================
// Abrir modal
// =====================================================

btnNovaAmostra.onclick = () => {

    modal.style.display = "flex";

    carregarPacientes();

};


// =====================================================
// Fechar modal
// =====================================================

btnCancelar.onclick = () => {

    modal.style.display = "none";

};


// =====================================================
// Fechar clicando fora
// =====================================================

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});


// =====================================================
// Carregar pacientes do usuário
// =====================================================

async function carregarPacientes() {

    const select =
        document.getElementById("paciente_id");


    try {

        const resposta = await fetch(

            `http://localhost:3000/pacientes?usuario_id=${usuarioId}`

        );


        const pacientes =
            await resposta.json();


        select.innerHTML = "";


        if (pacientes.length === 0) {

            select.innerHTML = `
                <option value="">
                    Nenhum paciente cadastrado
                </option>
            `;

            return;

        }


        pacientes.forEach((paciente) => {

            select.innerHTML += `

                <option value="${paciente.id}">
                    ${paciente.nome}
                </option>

            `;

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar pacientes:",
            erro
        );

    }

}


// =====================================================
// Carregar amostras do usuário
// =====================================================

async function carregarAmostras() {

    try {

        const resposta = await fetch(

            `http://localhost:3000/amostras?usuario_id=${usuarioId}`

        );


        if (!resposta.ok) {

            const erro =
                await resposta.json();

            console.error(erro);

            return;

        }


        const amostras =
            await resposta.json();


        tbody.innerHTML = "";


        if (amostras.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="text-align:center;"
                    >
                        Nenhuma amostra cadastrada.
                    </td>

                </tr>

            `;

            return;

        }


        amostras.forEach((amostra) => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        ${amostra.paciente}
                    </td>

                    <td>
                        ${amostra.tipo}
                    </td>

                    <td>
                        ${amostra.data_coleta || "-"}
                    </td>

                    <td>
                        ${amostra.status}
                    </td>

                    <td>

                        <button
                            class="btn-primary"
                            onclick="gerarRelatorio(${amostra.id})"
                        >
                            Gerar
                        </button>

                    </td>

                </tr>

            `;

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar amostras:",
            erro
        );

    }

}


// =====================================================
// Salvar amostra
// =====================================================

btnSalvar.onclick = async () => {

    const paciente_id =
        document.getElementById("paciente_id").value;

    const tipo =
        document.getElementById("tipo").value;

    const status =
        document.getElementById("status").value;

    const data_coleta =
        document.getElementById("data_coleta").value;

    const observacoes =
        document.getElementById("observacoes").value;


    if (!paciente_id) {

        alert(
            "Cadastre um paciente antes de criar uma amostra."
        );

        return;

    }


    try {

        const resposta = await fetch(

            "http://localhost:3000/amostras",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    paciente_id,
                    tipo,
                    status,
                    data_coleta,
                    observacoes,

                    // Dono da amostra
                    usuario_id: usuarioId

                })

            }

        );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.erro ||
                "Erro ao cadastrar amostra."
            );

            return;

        }


        alert(dados.mensagem);


        modal.style.display = "none";


        document.getElementById("tipo").value =
            "Sangue";

        document.getElementById("status").value =
            "Pendente";

        document.getElementById("data_coleta").value =
            "";

        document.getElementById("observacoes").value =
            "";


        carregarAmostras();


    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao cadastrar amostra."
        );

    }

};


// =====================================================
// Gerar relatório
// =====================================================

async function gerarRelatorio(idAmostra) {

    const resposta = await fetch(

        `http://localhost:3000/relatorios/${idAmostra}`,

        {

            method: "POST"

        }

    );


    const dados =
        await resposta.json();


    alert(dados.mensagem);

}


// =====================================================
// Inicialização
// =====================================================

carregarAmostras();