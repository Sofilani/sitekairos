// Menu responsivo
document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navMenu");

    if (hamburger && navMenu) {

        hamburger.addEventListener("click", () => {

            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");

        });

        document.addEventListener("click", (e) => {

            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {

                hamburger.classList.remove("active");
                navMenu.classList.remove("active");

            }

        });

    }

});

const tbody = document.getElementById("listaAmostras");
const modal = document.getElementById("modal");

const btnNovaAmostra = document.getElementById("btnNovaAmostra");
const btnCancelar = document.getElementById("cancelar");
const btnSalvar = document.getElementById("salvar");

// Abrir modal
btnNovaAmostra.onclick = () => {

    modal.style.display = "flex";
    carregarPacientes();

};

// Fechar modal
btnCancelar.onclick = () => {

    modal.style.display = "none";

};

// Fechar clicando fora
modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});

// Carregar pacientes
async function carregarPacientes() {

    const select = document.getElementById("paciente_id");

    const resposta = await fetch("http://localhost:3000/pacientes");

    const pacientes = await resposta.json();

    select.innerHTML = "";

    pacientes.forEach((paciente) => {

        select.innerHTML += `
            <option value="${paciente.id}">
                ${paciente.nome}
            </option>
        `;

    });

}

// Carregar amostras
async function carregarAmostras() {

    const resposta = await fetch("http://localhost:3000/amostras");

    const amostras = await resposta.json();

    tbody.innerHTML = "";

    if (amostras.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    Nenhuma amostra cadastrada.
                </td>
            </tr>
        `;

        return;

    }

    amostras.forEach((amostra) => {

        tbody.innerHTML += `
            <tr>
                <td>${amostra.paciente}</td>
                <td>${amostra.tipo}</td>
                <td>${amostra.data_coleta || "-"}</td>
                <td>${amostra.status}</td>
            </tr>
        `;

    });

}

// Salvar amostra
btnSalvar.onclick = async () => {

    const paciente_id = document.getElementById("paciente_id").value;
    const tipo = document.getElementById("tipo").value;
    const status = document.getElementById("status").value;
    const data_coleta = document.getElementById("data_coleta").value;
    const observacoes = document.getElementById("observacoes").value;

    const resposta = await fetch("http://localhost:3000/amostras", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            paciente_id,
            tipo,
            status,
            data_coleta,
            observacoes
        })

    });

    const dados = await resposta.json();

    alert(dados.mensagem);

    modal.style.display = "none";

    document.getElementById("tipo").value = "Sangue";
    document.getElementById("status").value = "Pendente";
    document.getElementById("data_coleta").value = "";
    document.getElementById("observacoes").value = "";

    carregarAmostras();

};

carregarAmostras();