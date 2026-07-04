const botaoCadastrar = document.getElementById("btnCadastrar");

botaoCadastrar.addEventListener("click", function () {

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Senha:", senha);

});