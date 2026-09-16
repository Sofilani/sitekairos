// =====================================================
// LOGIN KAIRÓS
// =====================================================

const formLogin =
    document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // =================================================
            // PEGAR DADOS DO FORMULÁRIO
            // =================================================

            const email =
                document.getElementById("email").value.trim();

            const senha =
                document.getElementById("senha").value;


            // =================================================
            // VALIDAR CAMPOS
            // =================================================

            if (!email || !senha) {

                alert(
                    "Preencha o email e a senha."
                );

                return;

            }


            // =================================================
            // BOTÃO
            // =================================================

            const botao =
                formLogin.querySelector(
                    "button[type='submit']"
                );


            if (botao) {

                botao.disabled = true;

                botao.textContent =
                    "Entrando...";

            }


            try {

                // =================================================
                // ENVIAR PARA O BACKEND
                // =================================================

                const resposta =
                   await fetch(
    "/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                senha
                            })
                        }
                    );


                // =================================================
                // LER RESPOSTA
                // =================================================

                const dados =
                    await resposta.json();


                console.log(
                    "Resposta do login:",
                    dados
                );


                // =================================================
                // VERIFICAR LOGIN
                // =================================================

                if (!resposta.ok) {

                    alert(
                        dados.erro ||
                        "Email ou senha incorretos."
                    );

                    return;

                }


                // =================================================
                // LOGIN REALIZADO
                // =================================================

                console.log(
                    "Login realizado com sucesso!"
                );


                // Guarda os dados do usuário
                // para podermos utilizar depois no sistema

                if (dados.usuario) {

                    localStorage.setItem(
                        "usuario",
                        JSON.stringify(
                            dados.usuario
                        )
                    );

                }


                // =================================================
                // IR PARA O DASHBOARD
                // =================================================

                window.location.href =
                    "dashboard.html";


            } catch (erro) {

                console.error(
                    "Erro ao realizar login:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor KAIRÓS."
                );


            } finally {

                if (botao) {

                    botao.disabled = false;

                    botao.textContent =
                        "Entrar";

                }

            }

        }
    );

}