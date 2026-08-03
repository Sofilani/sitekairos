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
          <td colspan="4" style="text-align: center; color: #888; padding: 25px;">
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
        </tr>
      `;
    });
  } catch (erro) {
    console.log("Erro ao carregar pacientes:", erro);
  }
}

carregarPacientes();