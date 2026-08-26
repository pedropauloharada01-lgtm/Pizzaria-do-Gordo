let produtos = [
    { id: 1, nome: "Pizza de queijo" },
    { id: 2, nome: "Pastel de carne" },
    { id: 3, nome: "Pizza de calabresa" }
];

let quantidades = { unidade1: 0, unidade2: 0, unidade3: 0 };

function salvar() {
    localStorage.setItem("quantidades", JSON.stringify(quantidades));
}

function carregar() {
    let dados = localStorage.getItem("quantidades");
    if (dados) {
        quantidades = JSON.parse(dados);
    }
}

// lê o localStorage e escreve os valores de volta na tela (sobrevive a F5)
function restaurarContadores() {
    carregar();
    produtos.forEach(function(p) {
        const el = document.getElementById(`unidade${p.id}`);
        if (el) {
            el.textContent = quantidades[`unidade${p.id}`] || 0;
        }
    });
}

window.onload = function() {
    // Restaura os contadores do cardápio (só faz efeito se os elementos existirem nessa página)
    restaurarContadores();

    // Mostra o resumo do pedido na página de contato, se existir
    let pedidoSalvo = localStorage.getItem("pedido");
    let container = document.getElementById("resumo-pedido");
    if (pedidoSalvo && container) {
        let pedido = JSON.parse(pedidoSalvo);
        pedido.forEach(function(item) {
            container.innerHTML += `<p>${item.quantidade}x ${item.nome}</p>`;
        });
    }
};

function add(id) {
    const a = document.getElementById(`unidade${id}`);
    let valoratual = Number(a.textContent);
    valoratual++;
    a.textContent = valoratual;

    quantidades[`unidade${id}`] = valoratual;
    salvar();
}

function remove(id) {
    const a = document.getElementById(`unidade${id}`);
    let valoratual = Number(a.textContent);
    if (valoratual > 0) {
        valoratual--;
    }
    a.textContent = valoratual;

    quantidades[`unidade${id}`] = valoratual;
    salvar();
}

function finalizarPedido() {
    let pedido = [];

    produtos.forEach(function(p) {
        let qtd = Number(document.getElementById(`unidade${p.id}`).textContent);
        if (qtd > 0) {
            pedido.push({ nome: p.nome, quantidade: qtd });
        }
    });

    localStorage.setItem("pedido", JSON.stringify(pedido));
    salvarPedidoNoBanco(pedido);
    window.location.href = "contato.html";
}

// Manda uma cópia do pedido pro banco de dados (Supabase), pro dono
// conseguir ver tudo organizado no painel (admin.html). Se as chaves em
// supabase-config.js ainda não tiverem sido preenchidas, isso é ignorado
// silenciosamente — o site continua funcionando normal via WhatsApp.
function salvarPedidoNoBanco(pedido) {
    if (
        typeof SUPABASE_URL === "undefined" ||
        typeof SUPABASE_ANON_KEY === "undefined" ||
        SUPABASE_URL.includes("COLE_AQUI") ||
        SUPABASE_ANON_KEY.includes("COLE_AQUI") ||
        pedido.length === 0
    ) {
        return;
    }

    fetch(`${SUPABASE_URL}/rest/v1/pedidos`, {
        method: "POST",
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify([{ itens: pedido }])
    }).catch(function (erro) {
        console.warn("Não consegui salvar o pedido no banco (o WhatsApp continua funcionando normal):", erro);
    });
}

// ---------------------------------------------------------------------
// Direção do slide entre as abas (Home / Cardápio / Avaliações / Contato)
// Guarda em sessionStorage se estamos indo "pra frente" ou "voltando" na
// ordem das abas, pra próxima página saber de que lado o conteúdo entra.
// ---------------------------------------------------------------------
(function () {
    const ordemAbas = ["index.html", "cardapio.html", "avaliações.html", "contato.html"];

    function nomeArquivo(url) {
        try {
            const caminho = new URL(url, location.href).pathname;
            const ultimo = caminho.split("/").pop() || "index.html";
            return decodeURIComponent(ultimo);
        } catch (e) {
            return "";
        }
    }

    const paginaAtual = nomeArquivo(location.href);

    document.addEventListener("click", function (evento) {
        const link = evento.target.closest("a[href]");
        if (!link) return;

        const destino = nomeArquivo(link.href);
        const indiceAtual = ordemAbas.indexOf(paginaAtual);
        const indiceDestino = ordemAbas.indexOf(destino);

        if (indiceAtual > -1 && indiceDestino > -1 && indiceDestino !== indiceAtual) {
            sessionStorage.setItem("vt-dir", indiceDestino < indiceAtual ? "back" : "forward");
        }
    });
})();
