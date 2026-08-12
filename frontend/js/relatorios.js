const tbody = document.getElementById("listaRelatorios");

async function carregarRelatorios() {

    try {

        const resposta = await fetch("http://localhost:3000/relatorios");

        const relatorios = await resposta.json();

        tbody.innerHTML = "";

        if (relatorios.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        Nenhum relatório encontrado.
                    </td>
                </tr>
            `;

            return;

        }

        relatorios.forEach(relatorio => {

            tbody.innerHTML += `
                <tr>
                    <td>${relatorio.paciente}</td>
                    <td>${relatorio.tipo}</td>
                    <td>${relatorio.resultado || "-"}</td>
                    <td>${relatorio.status}</td>
                    <td>
                        <button class="btn-primary">
                            Editar
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (erro) {

        console.log("Erro:", erro);

    }

}

carregarRelatorios();