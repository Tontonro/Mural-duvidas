const botaoCarregar = document.querySelector("#botao-carregar");
const campoPesquisa = document.querySelector("#campo-pesquisa");
const ordenacao = document.querySelector("#ordenacao");
const mensagem = document.querySelector("#mensagem");
const resumo = document.querySelector("#resumo");
const listaPublicacoes = document.querySelector("#lista-publicacoes");
const areaResultado = document.querySelector(".area-resultado");

let publicacoesCarregadas = [];

function alterarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem mensagem--${tipo}`;
}

function criarCartao(publicacao) {
    return `
        <article class="cartao">
            <span class="cartao__numero">Publicação ${publicacao.id}</span>
            <h3>${publicacao.title}</h3>
            <p>${publicacao.body}</p>
            <p class="cartao__tags">Tags: ${publicacao.tags.join(", ")}</p>
            <p class="cartao__metadados"><span>Likes: ${publicacao.reactions.likes}</span><span>Dislikes: ${publicacao.reactions.dislikes}</span><span>Visualizações: ${publicacao.views}</span></p>
        </article>`;
}

function exibirPublicacoes(publicacoes) {
    listaPublicacoes.innerHTML = publicacoes.map(criarCartao).join("");
}

async function carregarPublicacoes() {
    alterarMensagem("Carregando publicações...", "carregando");

    listaPublicacoes.innerHTML = "";
    botaoCarregar.disabled = true;
    campoPesquisa.disabled = true;
    ordenacao.disabled = true;

    areaResultado.setAttribute("aria-busy", "true");

    try {
        const resposta = await fetch("https://dummyjson.com/posts?limit=67");
        if (!resposta.ok) {
            throw new Error(`A API respondeu com o status ${resposta.status}.`);
        }

        const dados = await resposta.json();
        publicacoesCarregadas = dados.posts.slice(0, 67);

        exibirPublicacoes(publicacoesCarregadas);
        alterarMensagem(`${publicacoesCarregadas.length} publicações carregadas.`, "sucesso");
        campoPesquisa.disabled = false;
        ordenacao.disabled = false;
        atualizarResumo(publicacoesCarregadas);
    } catch (erro) {
        alterarMensagem("Não foi possível carregar os dados. Tente novamente.", "erro");
        console.error("Detalhes do erro:", erro);
    } finally {
        botaoCarregar.disabled = false;
        areaResultado.setAttribute("aria-busy", "false");
    }
}

function filtrarPublicacoes() {
    const termo = campoPesquisa.value.trim().toLowerCase();
    const resultado = publicacoesCarregadas.filter((publicacao) => {
        const texto = `${publicacao.title} ${publicacao.body} ${publicacao.tags.join(" ")}`.toLowerCase();
        return texto.includes(termo);
    });

    exibirPublicacoes(ordenarPublicacoes(resultado));
    if (resultado.length === 0) {
        alterarMensagem("Nenhuma publicação corresponde à pesquisa.", "vazio");
    } else if (termo) {
        alterarMensagem(`${resultado.length} publicações encontradas.`, "pesquisa");
    } else {
        alterarMensagem(`${publicacoesCarregadas.length} publicações carregadas.`, "sucesso");
    }
    atualizarResumo(resultado);
}

function ordenarPublicacoes(publicacoes) {
    const resultado = [...publicacoes];
    if (ordenacao.value === "curtidas") {
        return resultado.sort((a, b) => b.reactions.likes - a.reactions.likes);
    }
    if (ordenacao.value === "visualizacoes") {
        return resultado.sort((a, b) => b.views - a.views);
    }
    return resultado;
}

function aplicarOrdenacao() {
    const termo = campoPesquisa.value.trim().toLowerCase();
    const filtradas = publicacoesCarregadas.filter((publicacao) => {
        const texto = `${publicacao.title} ${publicacao.body} ${publicacao.tags.join(" ")}`.toLowerCase();
        return texto.includes(termo);
    });
    exibirPublicacoes(ordenarPublicacoes(filtradas));
}

function atualizarResumo(publicacoes) {
    const totalCurtidas = publicacoes.reduce((total, publicacao) => total + publicacao.reactions.likes, 0);
    resumo.textContent = `${totalCurtidas} curtidas nos cartões exibidos.`;
    resumo.hidden = publicacoes.length === 0;
}


botaoCarregar.addEventListener("click", carregarPublicacoes);
campoPesquisa.addEventListener("input", filtrarPublicacoes);
ordenacao.addEventListener("change", aplicarOrdenacao);