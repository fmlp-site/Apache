// Configurações do RestDB.io
const apiKey = "YOUR_RESTDB_API_KEY";
const restdbURL = "https://YOUR_DATABASE_NAME.restdb.io/rest";

// Função para carregar as inscrições dos candidatos
async function carregarInscricoes() {
    try {
        const resposta = await fetch(`${restdbURL}/inscricoes`, {
            headers: {
                "content-type": "application/json",
                "x-apikey": apiKey
            }
        });
        
        const inscricoes = await resposta.json();
        
        const listaInscricoes = document.getElementById("lista-inscricoes");
        listaInscricoes.innerHTML = ""; // Limpa o conteúdo anterior

        inscricoes.forEach(inscricao => {
            const itemInscricao = document.createElement("div");
            itemInscricao.className = "inscricao-item";
            itemInscricao.innerHTML = `
                <p><strong>ID:</strong> ${inscricao._id}</p>
                <p><strong>Nome:</strong> ${inscricao.nomeCompleto}</p>
                <p><strong>Status:</strong> ${inscricao.status || "Em Análise"}</p>
                <label for="status-select-${inscricao._id}">Alterar Status:</label>
                <select id="status-select-${inscricao._id}" data-id="${inscricao._id}">
                    <option value="Em Análise" ${inscricao.status === "Em Análise" ? "selected" : ""}>Em Análise</option>
                    <option value="Homologada" ${inscricao.status === "Homologada" ? "selected" : ""}>Homologada</option>
                    <option value="Não Homologada" ${inscricao.status === "Não Homologada" ? "selected" : ""}>Não Homologada</option>
                </select>
                <button onclick="atualizarStatus('${inscricao._id}')">Salvar</button>
                <hr>
            `;
            listaInscricoes.appendChild(itemInscricao);
        });
    } catch (erro) {
        document.getElementById("lista-inscricoes").innerHTML = "Erro ao carregar inscrições.";
    }
}

// Função para atualizar o status de uma inscrição
async function atualizarStatus(id) {
    const selectStatus = document.getElementById(`status-select-${id}`);
    const novoStatus = selectStatus.value;

    try {
        const resposta = await fetch(`${restdbURL}/inscricoes/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "x-apikey": apiKey
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (resposta.ok) {
            document.getElementById("status-mensagem").textContent = "Status atualizado com sucesso!";
            carregarInscricoes(); // Recarrega as inscrições para atualizar a interface
        } else {
            document.getElementById("status-mensagem").textContent = "Erro ao atualizar o status. Tente novamente.";
        }
    } catch (erro) {
        document.getElementById("status-mensagem").textContent = "Erro de conexão com o servidor.";
    }
}

// Carregar as inscrições ao carregar a página
if (window.location.pathname.endsWith("admin-inscricoes.html")) {
    carregarInscricoes();
}


// Função para consultar o status de uma inscrição pelo ID
async function consultarStatusInscricao() {
    const idInscricao = document.getElementById("id-inscricao").value.trim();
    const resultadoDiv = document.getElementById("resultado-consulta");

    if (!idInscricao) {
        resultadoDiv.textContent = "Por favor, insira seu ID de inscrição.";
        return;
    }

    try {
        // Busca a inscrição pelo ID no banco de dados
        const resposta = await fetch(`${restdbURL}/inscricoes?q={"id_inscricao": "${idInscricao}"}`, {
            headers: {
                "content-type": "application/json",
                "x-apikey": apiKey
            }
        });

        const inscricoes = await resposta.json();

        // Verifica se encontrou uma inscrição com o ID fornecido
        if (inscricoes.length > 0) {
            const inscricao = inscricoes[0];
            resultadoDiv.innerHTML = `
                <p><strong>ID da Inscrição:</strong> ${inscricao.id_inscricao}</p>
                <p><strong>Nome do Candidato:</strong> ${inscricao.nomeCompleto}</p>
                <p><strong>Status da Inscrição:</strong> ${inscricao.status || "Em Análise"}</p>
            `;
        } else {
            resultadoDiv.textContent = "Inscrição não encontrada. Verifique seu ID e tente novamente.";
        }
    } catch (erro) {
        resultadoDiv.textContent = "Erro ao consultar o status. Tente novamente mais tarde.";
        console.error("Erro na consulta:", erro);
    }
}