async function carregarDashboard(){

    try{

        const resposta = await fetch("http://localhost:3000/dashboard");

        const dados = await resposta.json();

        document.getElementById("totalPacientes").textContent = dados.pacientes;

        document.getElementById("totalAmostras").textContent = dados.amostras;

        document.getElementById("totalRelatorios").textContent = dados.relatorios;

        document.getElementById("totalIA").textContent = dados.ia;

    }catch(erro){

        console.log(erro);

    }

}

carregarDashboard();