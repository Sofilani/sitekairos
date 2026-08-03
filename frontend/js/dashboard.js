// Mobile Navbar Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
});

async function carregarDashboard() {
  try {
    const resposta = await fetch("http://localhost:3000/dashboard");
    if (!resposta.ok) return;

    const dados = await resposta.json();

    const elPacientes = document.getElementById("totalPacientes");
    const elAmostras = document.getElementById("totalAmostras");
    const elRelatorios = document.getElementById("totalRelatorios");
    const elIA = document.getElementById("totalIA");

    if (elPacientes) elPacientes.textContent = dados.pacientes ?? 0;
    if (elAmostras) elAmostras.textContent = dados.amostras ?? 0;
    if (elRelatorios) elRelatorios.textContent = dados.relatorios ?? 0;
    if (elIA) elIA.textContent = dados.ia ?? 0;
  } catch (erro) {
    console.log("Erro ao carregar estatísticas do dashboard:", erro);
  }
}

carregarDashboard();