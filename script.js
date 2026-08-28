// ===================================================================
// Pizzaria do Gordo — carrinho de compras
// Agora orientado a dados (ver cardapio-dados.js): cada linha do
// carrinho é identificada por categoria + nome + tamanho, guarda o
// preço de verdade, e o pedido final já sai com o total calculado.
// ===================================================================

let carrinho = {}; // chave -> { nome, tamanho, precoUnit, qtd, categoria }

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function chaveItem(categoriaId, nome, tamanhoLabel) {
    return `${categoriaId}::${nome}::${tamanhoLabel || "unico"}`;
}

function formatarReal(valor) {
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function carregarCarrinho() {
    const dados = localStorage.getItem("carrinho");
    carrinho = dados ? JSON.parse(dados) : {};
}

// ---------------------------------------------------------------------
// Renderização do cardápio (só roda se a página tiver #cardapio-container)
// ---------------------------------------------------------------------
function renderizarCardapio() {
    const container = document.getElementById("cardapio-container");
    if (!container || typeof CARDAPIO === "undefined") return;

    carregarCarrinho();

    const navPills = document.getElementById("cardapio-nav");

    CARDAPIO.forEach(function (categoria) {
        // pílula de navegação
        if (navPills) {
            const pill = document.createElement("a");
            pill.href = `#cat-${categoria.id}`;
            pill.className = "cat-pill";
            pill.textContent = categoria.nome;
            navPills.appendChild(pill);
        }

        const secao = document.createElement("section");
        secao.className = "cat-section";
        secao.id = `cat-${categoria.id}`;
        secao.innerHTML = `<h2 class="cat-titulo">${categoria.nome}</h2>`;

        const lista = document.createElement("div");
        lista.className = "cat-lista";

        categoria.itens.forEach(function (item) {
            const card = document.createElement("div");
            card.className = "menu-item2";
            card.dataset.busca = normalizar(item.nome + " " + (item.desc || ""));

            let linhasHtml = "";

            if (item.tamanhos) {
                item.tamanhos.forEach(function (t) {
                    const chave = chaveItem(categoria.id, item.nome, t.r);
                    linhasHtml += linhaTamanho(chave, t.r, t.p);
                });
            } else {
                const chave = chaveItem(categoria.id, item.nome, null);
                linhasHtml += linhaTamanho(chave, null, item.preco);
            }

            card.innerHTML = `
                <div class="menu-item2-info">
                    <p class="menu-item2-nome">${item.nome}</p>
                    ${item.desc ? `<p class="menu-item2-desc">${item.desc}</p>` : ""}
                </div>
                <div class="menu-item2-tamanhos">${linhasHtml}</div>
            `;
            lista.appendChild(card);
        });

        secao.appendChild(lista);
        container.appendChild(secao);
    });

    // depois de montar tudo, escreve as quantidades já salvas
    Object.keys(carrinho).forEach(function (chave) {
        atualizarQtdNaTela(chave, carrinho[chave].qtd);
    });

    atualizarResumoFlutuante();
    configurarBusca();
}

function linhaTamanho(chave, label, preco) {
    const chaveCss = CSS.escape(chave);
    return `
        <div class="tamanho-linha">
            ${label ? `<span class="tamanho-label">${label}</span>` : `<span class="tamanho-label">Unidade</span>`}
            <span class="tamanho-preco">R$ ${formatarReal(preco)}</span>
            <div class="stepper-mini">
                <button onclick="alterarQtd('${chave.replace(/'/g, "\\'")}', -1)" aria-label="Diminuir">−</button>
                <span class="qty" data-chave-qty="${chaveCss}">0</span>
                <button onclick="alterarQtd('${chave.replace(/'/g, "\\'")}', 1)" aria-label="Aumentar">+</button>
            </div>
        </div>
    `;
}

function atualizarQtdNaTela(chave, valor) {
    const el = document.querySelector(`[data-chave-qty="${CSS.escape(chave)}"]`);
    if (el) el.textContent = valor;
}

function alterarQtd(chave, delta) {
    const partes = chave.split("::");
    const categoriaId = partes[0];
    const nome = partes[1];
    const tamanhoLabel = partes[2] === "unico" ? null : partes[2];

    let preco = 0;
    const categoria = CARDAPIO.find(function (c) { return c.id === categoriaId; });
    if (categoria) {
        const item = categoria.itens.find(function (i) { return i.nome === nome; });
        if (item) {
            preco = item.tamanhos
                ? (item.tamanhos.find(function (t) { return t.r === tamanhoLabel; }) || {}).p || 0
                : item.preco;
        }
    }

    const atual = carrinho[chave] || { nome, tamanho: tamanhoLabel, precoUnit: preco, qtd: 0, categoria: categoriaId };
    atual.qtd = Math.max(0, atual.qtd + delta);

    if (atual.qtd === 0) {
        delete carrinho[chave];
        atualizarQtdNaTela(chave, 0);
    } else {
        carrinho[chave] = atual;
        atualizarQtdNaTela(chave, atual.qtd);
    }

    salvarCarrinho();
    atualizarResumoFlutuante();
}

function totalCarrinho() {
    return Object.values(carrinho).reduce(function (soma, item) {
        return soma + item.precoUnit * item.qtd;
    }, 0);
}

function contagemCarrinho() {
    return Object.values(carrinho).reduce(function (soma, item) { return soma + item.qtd; }, 0);
}

function atualizarResumoFlutuante() {
    const barra = document.getElementById("carrinho-flutuante");
    if (!barra) return;
    const qtd = contagemCarrinho();
    const total = totalCarrinho();
    document.getElementById("carrinho-contagem").textContent = qtd;
    document.getElementById("carrinho-total").textContent = "R$ " + formatarReal(total);
    barra.classList.toggle("vazio", qtd === 0);
}

// ---------------------------------------------------------------------
// Busca — filtra os cards pelo nome/descrição, ignorando acentos
// ---------------------------------------------------------------------
function configurarBusca() {
    const input = document.getElementById("busca-cardapio");
    if (!input) return;

    input.addEventListener("input", function () {
        const termo = normalizar(input.value.trim());
        const secoes = document.querySelectorAll(".cat-section");

        secoes.forEach(function (secao) {
            let algumVisivel = false;
            secao.querySelectorAll(".menu-item2").forEach(function (card) {
                const bate = termo === "" || card.dataset.busca.includes(termo);
                card.style.display = bate ? "" : "none";
                if (bate) algumVisivel = true;
            });
            secao.style.display = algumVisivel ? "" : "none";
        });
    });
}

// ---------------------------------------------------------------------
// Finalizar pedido — some pra contato.html com o resumo pronto
// ---------------------------------------------------------------------
function finalizarPedido() {
    const itens = Object.values(carrinho).filter(function (i) { return i.qtd > 0; });

    if (itens.length === 0) {
        alert("Seu carrinho está vazio — adicione alguma coisa antes de fazer o pedido.");
        return;
    }

    const pedido = {
        itens: itens.map(function (i) {
            return { nome: i.nome, tamanho: i.tamanho, qtd: i.qtd, precoUnit: i.precoUnit };
        }),
        total: totalCarrinho()
    };

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
        pedido.itens.length === 0
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
        body: JSON.stringify([{ itens: pedido.itens, total: pedido.total }])
    }).catch(function (erro) {
        console.warn("Não consegui salvar o pedido no banco (o WhatsApp continua funcionando normal):", erro);
    });
}

// ---------------------------------------------------------------------
// Resumo do pedido na página de Contato
// ---------------------------------------------------------------------
function renderizarResumoPedido() {
    const container = document.getElementById("resumo-pedido");
    if (!container) return;

    const pedidoSalvo = localStorage.getItem("pedido");
    if (!pedidoSalvo) return;

    const pedido = JSON.parse(pedidoSalvo);
    const itens = pedido.itens || pedido; // compatível com formato antigo, se existir

    itens.forEach(function (item) {
        const linha = document.createElement("p");
        const tamanho = item.tamanho ? ` (${item.tamanho})` : "";
        const subtotal = item.precoUnit ? ` — R$ ${formatarReal(item.precoUnit * item.qtd)}` : "";
        linha.textContent = `${item.qtd}x ${item.nome}${tamanho}${subtotal}`;
        container.appendChild(linha);
    });

    if (pedido.total) {
        const totalEl = document.createElement("p");
        totalEl.className = "resumo-total-linha";
        totalEl.textContent = `Total: R$ ${formatarReal(pedido.total)}`;
        container.appendChild(totalEl);
    }

    montarLinkWhatsappComPedido(pedido);
}

// Monta a mensagem do WhatsApp já com os itens do pedido, pra o cliente
// não precisar copiar e colar nada manualmente.
function montarLinkWhatsappComPedido(pedido) {
    const link = document.getElementById("link-whatsapp-pedido");
    if (!link) return;

    const itens = pedido.itens || pedido;
    if (!itens || itens.length === 0) return;

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    itens.forEach(function (item) {
        const tamanho = item.tamanho ? ` (${item.tamanho})` : "";
        mensagem += `${item.qtd}x ${item.nome}${tamanho}\n`;
    });
    if (pedido.total) {
        mensagem += `\nTotal: R$ ${formatarReal(pedido.total)}`;
    }

    const numero = "5517997795847";
    link.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

window.onload = function () {
    renderizarCardapio();
    renderizarResumoPedido();
};

// ---------------------------------------------------------------------
// Direção do slide entre as abas (Home / Cardápio / Avaliações / Contato)
// Guarda em sessionStorage se estamos indo "pra frente" ou "voltando" na
// ordem das abas, pra próxima página saber de que lado o conteúdo entra.
// ---------------------------------------------------------------------
(function () {
    const ordemAbas = ["index.html", "cardapio.html", "avaliacoes.html", "contato.html"];

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
