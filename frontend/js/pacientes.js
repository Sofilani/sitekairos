// =====================================================
// KAIRÓS - PACIENTES
// =====================================================

// Mobile Navbar Toggle
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


// =====================================================
// USUÁRIO LOGADO
// =====================================================

const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo) {

    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "index.html";

}

const usuario = JSON.parse(usuarioSalvo);
const usuarioId = usuario.id;

const nomeUsuario = document.getElementById("nomeUsuario");

if (nomeUsuario) {
    nomeUsuario.textContent = usuario.nome;
}

// =====================================================
// ELEMENTOS
// =====================================================

const tbody = document.getElementById("listaPacientes");
const modal = document.getElementById("modal");

let pacienteEditando = null;

const btnNovoPaciente =
    document.getElementById("btnNovoPaciente");

const btnCancelar =
    document.getElementById("cancelar");

const btnSalvar =
    document.getElementById("salvar");


// =====================================================
// ABRIR MODAL
// =====================================================

if (btnNovoPaciente) {

    btnNovoPaciente.onclick = () => {

        pacienteEditando = null;

        limparFormulario();

        if (modal) {
            modal.style.display = "flex";
        }

    };

}


// =====================================================
// CANCELAR
// =====================================================

if (btnCancelar) {

    btnCancelar.onclick = () => {

        if (modal) {
            modal.style.display = "none";
        }

        pacienteEditando = null;

        limparFormulario();

    };

}


// =====================================================
// FECHAR MODAL CLICANDO FORA
// =====================================================

if (modal) {

    modal.addEventListener("click", (e) => {

        if (e.target === modal) {

            modal.style.display = "none";

            pacienteEditando = null;

            limparFormulario();

        }

    });

}


// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================

function limparFormulario() {

    const nome =
        document.getElementById("nome");

    const dataNascimento =
        document.getElementById("data_nascimento");

    const sexo =
        document.getElementById("sexo");

    const observacoes =
        document.getElementById("observacoes");


    if (nome) {
        nome.value = "";
    }

    if (dataNascimento) {
        dataNascimento.value = "";
    }

    if (sexo) {
        sexo.value = "Feminino";
    }

    if (observacoes) {
        observacoes.value = "";
    }

}


// =====================================================
// LISTAR PACIENTES
// =====================================================

async function carregarPacientes() {

    if (!tbody) return;

    try {

        const resposta = await fetch(
    `/pacientes?usuario_id=${usuarioId}`
);

        if (!resposta.ok) {

            const erro = await resposta.json();

            console.log("Erro:", erro);

            return;

        }

        const pacientes = await resposta.json();

        tbody.innerHTML = "";


        if (pacientes.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align: center;
                               color: #888;
                               padding: 25px;">
                        Nenhum paciente cadastrado até o momento.
                    </td>
                </tr>
            `;

            return;

        }


        pacientes.forEach((paciente) => {

            tbody.innerHTML += `

                <tr>

                    <td>
                        <strong>
                            ${paciente.nome || "-"}
                        </strong>
                    </td>

                    <td>
                        ${paciente.data_nascimento || "-"}
                    </td>

                    <td>
                        ${paciente.sexo || "-"}
                    </td>

                    <td>
                        ${paciente.observacoes || "-"}
                    </td>

                    <td>

                        <button
                            onclick="editarPaciente(${paciente.id})">
                            ✏️
                        </button>

                        <button
                            onclick="excluirPaciente(${paciente.id})">
                            🗑️
                        </button>

                    </td>

                </tr>

            `;

        });


    } catch (erro) {

        console.log(
            "Erro ao carregar pacientes:",
            erro
        );

    }

}


// =====================================================
// SALVAR / ATUALIZAR PACIENTE
// =====================================================

if (btnSalvar) {

    btnSalvar.onclick = async () => {

        const nome =
            document.getElementById("nome").value.trim();

        const data_nascimento =
            document.getElementById("data_nascimento").value;

        const sexo =
            document.getElementById("sexo").value;

        const observacoes =
            document.getElementById("observacoes").value.trim();


        if (!nome) {

            alert("Digite o nome do paciente.");

            return;

        }


        try {

           const url = pacienteEditando

    ? `/pacientes/${pacienteEditando}`

    : "/pacientes";


            const metodo =
                pacienteEditando ? "PUT" : "POST";


            const resposta = await fetch(url, {

                method: metodo,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nome,
                    data_nascimento,
                    sexo,
                    observacoes,
                    usuario_id: usuarioId

                })

            });


            const dados = await resposta.json();


            if (!resposta.ok) {

                alert(
                    dados.erro ||
                    "Não foi possível salvar o paciente."
                );

                return;

            }


            alert(dados.mensagem);


            if (modal) {
                modal.style.display = "none";
            }


            pacienteEditando = null;

            limparFormulario();

            carregarPacientes();


        } catch (erro) {

            console.log(erro);

            alert(
                "Erro ao salvar paciente."
            );

        }

    };

}


// =====================================================
// EXCLUIR PACIENTE
// =====================================================

async function excluirPaciente(id) {

    const confirmar = confirm(
        "Deseja realmente excluir este paciente?"
    );


    if (!confirmar) return;


    try {

        const resposta = await fetch(

            `/pacientes/${id}?usuario_id=${usuarioId}`,

            {
                method: "DELETE"
            }

        );


        const dados = await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.erro ||
                "Não foi possível excluir o paciente."
            );

            return;

        }


        alert(dados.mensagem);

        carregarPacientes();


    } catch (erro) {

        console.log(erro);

        alert(
            "Erro ao excluir paciente."
        );

    }

}


// =====================================================
// EDITAR PACIENTE
// =====================================================

function editarPaciente(id) {

    pacienteEditando = id;


    const linha =
        event.target.closest("tr");


    document.getElementById("nome").value =
        linha.cells[0].innerText;


    document.getElementById("data_nascimento").value =
        linha.cells[1].innerText;


    document.getElementById("sexo").value =
        linha.cells[2].innerText;


    document.getElementById("observacoes").value =
        linha.cells[3].innerText;


    if (modal) {
        modal.style.display = "flex";
    }

}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

carregarPacientes();