
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
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
});

const tbody = document.getElementById("listaPacientes");
const modal = document.getElementById("modal");
let pacienteEditando = null;

const btnNovoPaciente = document.getElementById("btnNovoPaciente");
const btnCancelar = document.getElementById("cancelar");

if (btnNovoPaciente) {
  btnNovoPaciente.onclick = () => {
    if (modal) modal.style.display = "flex";
  };
}

if (btnCancelar) {
  btnCancelar.onclick = () => {
    if (modal) modal.style.display = "none";
  };
}

// Fechar modal ao clicar fora da caixa do modal
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

async function carregarPacientes() {
  if (!tbody) return;

  try {
    const resposta = await fetch("http://localhost:3000/pacientes");
    if (!resposta.ok) return;

    const pacientes = await resposta.json();
    tbody.innerHTML = "";

    if (pacientes.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #888; padding: 25px;">
            Nenhum paciente cadastrado até o momento.
          </td>
        </tr>
      `;
      return;
    }

   pacientes.forEach((paciente) => {
  tbody.innerHTML += `
    <tr>

      <td><strong>${paciente.nome || "-"}</strong></td>

      <td>${paciente.data_nascimento || "-"}</td>

      <td>${paciente.sexo || "-"}</td>

      <td>${paciente.observacoes || "-"}</td>

      <td>

        <button onclick="editarPaciente(${paciente.id})">
          ✏️
        </button>

        <button onclick="excluirPaciente(${paciente.id})">
          🗑️
        </button>

      </td>

    </tr>
  `;
});
  } catch (erro) {
    console.log("Erro ao carregar pacientes:", erro);
  }
}

carregarPacientes();
const btnSalvar = document.getElementById("salvar");

if (btnSalvar) {

    btnSalvar.onclick = async () => {

        const nome = document.getElementById("nome").value.trim();
        const data_nascimento = document.getElementById("data_nascimento").value;
        const sexo = document.getElementById("sexo").value;
        const observacoes = document.getElementById("observacoes").value.trim();

        if (!nome) {
            alert("Digite o nome do paciente.");
            return;
        }

        try {

            const url = pacienteEditando
                ? `http://localhost:3000/pacientes/${pacienteEditando}`
                   : "http://localhost:3000/pacientes";

                  const metodo = pacienteEditando ? "PUT" : "POST";

                  const resposta = await fetch("http://localhost:3000/pacientes", {

    method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    nome,
                    data_nascimento,
                    sexo,
                    observacoes
                })

            });

            const dados = await resposta.json();

            alert(dados.mensagem);

            modal.style.display = "none";
            

            document.getElementById("nome").value = "";
            document.getElementById("data_nascimento").value = "";
            document.getElementById("sexo").value = "Feminino";
            document.getElementById("observacoes").value = "";

            carregarPacientes();

        } catch (erro) {

            console.log(erro);
            alert("Erro ao cadastrar paciente.");

        }

    };

}

async function excluirPaciente(id) {

    const confirmar = confirm("Deseja realmente excluir este paciente?");

    if (!confirmar) return;

    try {

        await fetch(`http://localhost:3000/pacientes/${id}`, {

            method: "DELETE"

        });

        carregarPacientes();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao excluir paciente.");

    }

}
function editarPaciente(id) {

    pacienteEditando = id;

    const linha = event.target.closest("tr");

    document.getElementById("nome").value =
        linha.cells[0].innerText;

    document.getElementById("data_nascimento").value =
        linha.cells[1].innerText;

    document.getElementById("sexo").value =
        linha.cells[2].innerText;

    document.getElementById("observacoes").value =
        linha.cells[3].innerText;

    modal.style.display = "flex";

}