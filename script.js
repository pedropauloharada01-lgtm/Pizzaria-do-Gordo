// ===================================================================
// Pizzaria do Gordo — carrinho de compras
// Agora orientado a dados (ver cardapio-dados.js): cada linha do
// carrinho é identificada por categoria + nome + tamanho, guarda o
// preço de verdade, e o pedido final já sai com o total calculado.
// ===================================================================

let carrinho = {}; // chave -> { nome, tamanho, precoUnit, qtd, categoria }
let historicoAdicoes = []; // pilha com a ordem em que os itens foram adicionados (pra "remover último")

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
    localStorage.setItem("historico-carrinho", JSON.stringify(historicoAdicoes));
}

function carregarCarrinho() {
    const dados = localStorage.getItem("carrinho");
    carrinho = dados ? JSON.parse(dados) : {};

    const historico = localStorage.getItem("historico-carrinho");
    historicoAdicoes = historico ? JSON.parse(historico) : [];
}

function registrarAdicao(chave) {
    historicoAdicoes.push(chave);
    if (historicoAdicoes.length > 200) historicoAdicoes.shift(); // não deixa crescer pra sempre
}

// Remove uma unidade do último item que foi adicionado ao carrinho
// (pula qualquer item que já tenha sido zerado por outro caminho).
function removerUltimoItem() {
    while (historicoAdicoes.length > 0) {
        const chave = historicoAdicoes.pop();
        if (carrinho[chave] && carrinho[chave].qtd > 0) {
            carrinho[chave].qtd -= 1;
            const zerou = carrinho[chave].qtd === 0;
            if (zerou) delete carrinho[chave];

            salvarCarrinho();
            atualizarQtdNaTela(chave, zerou ? 0 : carrinho[chave].qtd);
            atualizarResumoFlutuante();
            renderizarMinhasMisturas();
            return;
        }
    }
    alert("Não há nada pra remover — o carrinho já está vazio.");
}

// ---------------------------------------------------------------------
// Renderização do cardápio (só roda se a página tiver o container certo)
// Pizzas ficam separadas do resto: o cliente escolhe entre "sabores
// únicos" (o cardápio de pizza normal) ou "misturar sabores" (monta uma
// pizza com 2 a 4 sabores diferentes).
// ---------------------------------------------------------------------
function renderizarCardapio() {
    if (typeof CARDAPIO === "undefined") return;

    carregarCarrinho();

    const pizzaCategorias = CARDAPIO.filter(function (c) { return CATEGORIAS_PIZZA_IDS.includes(c.id); });
    const outrasCategorias = CARDAPIO.filter(function (c) { return !CATEGORIAS_PIZZA_IDS.includes(c.id); });

    renderizarCategorias(pizzaCategorias, "pizza-cardapio-container", "pizza-cardapio-nav");
    renderizarCategorias(outrasCategorias, "cardapio-container", null);

    Object.keys(carrinho).forEach(function (chave) {
        atualizarQtdNaTela(chave, carrinho[chave].qtd);
    });

    atualizarResumoFlutuante();
    configurarBusca("busca-pizza", "#pizza-cardapio-container");
    renderizarMinhasMisturas();
    montarAlimentoHub(outrasCategorias);
}

function renderizarCategorias(categorias, containerId, navId) {
    const container = document.getElementById(containerId);
    if (!container || typeof CARDAPIO === "undefined") return;

    const navPills = navId ? document.getElementById(navId) : null;

    categorias.forEach(function (categoria) {
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
}

// ---------------------------------------------------------------------
// Hub principal: escolher o tipo de alimento (pizza, mini-pizza, pastel,
// bebida etc). Pizza abre a aba própria (sabores únicos / misturar);
// os demais mostram só a categoria escolhida, uma de cada vez.
// ---------------------------------------------------------------------
function montarAlimentoHub(outrasCategorias) {
    const grid = document.getElementById("alimento-grid");
    if (!grid) return;

    let html = `
        <button type="button" class="alimento-botao" onclick="mostrarPizzaHub()">
            <span class="alimento-botao-titulo">🍕 Pizza</span>
            <span class="alimento-botao-desc">Sabor único ou misturar até 4 sabores</span>
        </button>
    `;

    outrasCategorias.forEach(function (categoria) {
        html += `
            <button type="button" class="alimento-botao" onclick="mostrarCategoriaUnica('${categoria.id}')">
                <span class="alimento-botao-titulo">${categoria.nome}</span>
                <span class="alimento-botao-desc">${categoria.itens.length} opç${categoria.itens.length === 1 ? "ão" : "ões"}</span>
            </button>
        `;
    });

    grid.innerHTML = html;
}

function esconderTudoNoCardapio() {
    ["alimento-hub", "pizza-hub", "modo-unicos", "modo-mistura", "categoria-unica"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.classList.add("modo-oculto");
    });
}

function voltarAlimentoHub() {
    esconderTudoNoCardapio();
    document.getElementById("alimento-hub").classList.remove("modo-oculto");
}

function mostrarPizzaHub() {
    esconderTudoNoCardapio();
    document.getElementById("pizza-hub").classList.remove("modo-oculto");
}

function mostrarCategoriaUnica(categoriaId) {
    esconderTudoNoCardapio();
    document.getElementById("categoria-unica").classList.remove("modo-oculto");
    document.querySelectorAll("#cardapio-container .cat-section").forEach(function (secao) {
        secao.style.display = (secao.id === `cat-${categoriaId}`) ? "" : "none";
    });
    window.scrollTo({ top: document.getElementById("categoria-unica").offsetTop - 90, behavior: "smooth" });
}

// ---------------------------------------------------------------------
// Aba de pizza: Sabores Únicos x Misturar Sabores
// ---------------------------------------------------------------------
function mostrarModoPizza(modo) {
    const hub = document.getElementById("pizza-hub");
    const modoUnicos = document.getElementById("modo-unicos");
    const modoMistura = document.getElementById("modo-mistura");

    hub.classList.add("modo-oculto");
    modoUnicos.classList.add("modo-oculto");
    modoMistura.classList.add("modo-oculto");

    if (modo === "unicos") modoUnicos.classList.remove("modo-oculto");
    if (modo === "mistura") {
        modoMistura.classList.remove("modo-oculto");
        montarConstrutorMistura();
    }
}

function voltarHubPizza() {
    document.getElementById("pizza-hub").classList.remove("modo-oculto");
    document.getElementById("modo-unicos").classList.add("modo-oculto");
    document.getElementById("modo-mistura").classList.add("modo-oculto");
}

// ---------------------------------------------------------------------
// Construtor de "Misturar Sabores" — monta uma pizza com 2 a 4 sabores.
// Regra de preço: cobra-se o valor do sabor mais caro (igual já funciona
// pro meio a meio no cardápio impresso). Regra de quantidade: brotinho
// permite até 2 sabores, grande permite até 4.
// ---------------------------------------------------------------------
let misturaTamanhoAtual = "Grande (8 fatias)";
let misturaSaboresSelecionados = [];
let misturaConstruida = false;

function obterSaboresPizza() {
    const sabores = [];
    CARDAPIO.filter(function (c) { return CATEGORIAS_PIZZA_IDS.includes(c.id); }).forEach(function (categoria) {
        categoria.itens.forEach(function (item) {
            sabores.push({ categoria: categoria.nome, nome: item.nome, desc: item.desc, tamanhos: item.tamanhos });
        });
    });
    return sabores;
}

function limiteSaboresPorTamanho(tamanho) {
    return tamanho.startsWith("Brotinho") ? 2 : 4;
}

function precoSaborNoTamanho(sabor, tamanho) {
    const t = sabor.tamanhos.find(function (x) { return x.r === tamanho; });
    return t ? t.p : 0;
}

function montarConstrutorMistura() {
    if (misturaConstruida) {
        atualizarPainelMistura();
        return;
    }
    misturaConstruida = true;

    const container = document.getElementById("mistura-container");
    const sabores = obterSaboresPizza();

    let listaHtml = "";
    sabores.forEach(function (sabor, i) {
        listaHtml += `
            <label class="sabor-linha" data-busca="${normalizar(sabor.nome + " " + (sabor.desc || ""))}" data-indice="${i}">
                <input type="checkbox" onchange="alternarSabor(${i})" id="sabor-check-${i}">
                <span class="sabor-nome">${sabor.nome}</span>
                <span class="sabor-preco" id="sabor-preco-${i}"></span>
            </label>
        `;
    });

    container.innerHTML = `
        <div class="mistura-topo">
            <div class="mistura-tamanhos">
                <button type="button" class="tamanho-toggle ativo" data-tamanho="Grande (8 fatias)" onclick="escolherTamanhoMistura('Grande (8 fatias)')">Grande (8 fatias) · até 4 sabores</button>
                <button type="button" class="tamanho-toggle" data-tamanho="Brotinho (4 fatias)" onclick="escolherTamanhoMistura('Brotinho (4 fatias)')">Brotinho (4 fatias) · até 2 sabores</button>
            </div>
            <input type="search" id="busca-sabores-mistura" placeholder="Buscar sabor pra adicionar na mistura...">
        </div>

        <div class="sabores-lista" id="sabores-lista">${listaHtml}</div>

        <div class="mistura-resumo" id="mistura-resumo">
            <p id="mistura-selecionados">Escolha pelo menos 2 sabores.</p>
            <p id="mistura-preco-final"></p>
            <button type="button" class="btn btn-primary" id="btn-add-mistura" onclick="confirmarAdicionarMistura()" disabled>Adicionar essa mistura ao pedido</button>
        </div>

        <h3 class="minhas-misturas-titulo">Suas misturas nesse pedido</h3>
        <div id="minhas-misturas"></div>
    `;

    document.getElementById("busca-sabores-mistura").addEventListener("input", function (e) {
        const termo = normalizar(e.target.value.trim());
        document.querySelectorAll(".sabor-linha").forEach(function (linha) {
            linha.style.display = (termo === "" || linha.dataset.busca.includes(termo)) ? "" : "none";
        });
    });

    atualizarPainelMistura();
    renderizarMinhasMisturas();
}

function escolherTamanhoMistura(tamanho) {
    misturaTamanhoAtual = tamanho;
    document.querySelectorAll(".tamanho-toggle").forEach(function (btn) {
        btn.classList.toggle("ativo", btn.dataset.tamanho === tamanho);
    });

    const limite = limiteSaboresPorTamanho(tamanho);
    if (misturaSaboresSelecionados.length > limite) {
        misturaSaboresSelecionados = misturaSaboresSelecionados.slice(0, limite);
        document.querySelectorAll(".sabor-linha input[type=checkbox]").forEach(function (cb, i) {
            cb.checked = misturaSaboresSelecionados.includes(i);
        });
    }
    atualizarPainelMistura();
}

function alternarSabor(indice) {
    const sabores = obterSaboresPizza();
    const limite = limiteSaboresPorTamanho(misturaTamanhoAtual);
    const jaEscolhido = misturaSaboresSelecionados.includes(indice);

    if (!jaEscolhido && misturaSaboresSelecionados.length >= limite) {
        document.getElementById(`sabor-check-${indice}`).checked = false;
        alert(`Esse tamanho permite no máximo ${limite} sabores. Desmarque algum antes de adicionar outro.`);
        return;
    }

    if (jaEscolhido) {
        misturaSaboresSelecionados = misturaSaboresSelecionados.filter(function (i) { return i !== indice; });
    } else {
        misturaSaboresSelecionados.push(indice);
    }
    atualizarPainelMistura();
}

function atualizarPainelMistura() {
    const sabores = obterSaboresPizza();
    const limite = limiteSaboresPorTamanho(misturaTamanhoAtual);

    sabores.forEach(function (sabor, i) {
        const precoEl = document.getElementById(`sabor-preco-${i}`);
        if (precoEl) precoEl.textContent = "R$ " + formatarReal(precoSaborNoTamanho(sabor, misturaTamanhoAtual));
        const linha = document.getElementById(`sabor-check-${i}`);
        if (linha) {
            const podeMarcar = misturaSaboresSelecionados.includes(i) || misturaSaboresSelecionados.length < limite;
            linha.closest(".sabor-linha").classList.toggle("desabilitado", !podeMarcar);
        }
    });

    const nomesSelecionados = misturaSaboresSelecionados.map(function (i) { return sabores[i].nome; });
    const resumoEl = document.getElementById("mistura-selecionados");
    const precoEl = document.getElementById("mistura-preco-final");
    const btnAdd = document.getElementById("btn-add-mistura");

    if (nomesSelecionados.length === 0) {
        resumoEl.textContent = `Escolha de 2 a ${limite} sabores.`;
        precoEl.textContent = "";
        btnAdd.disabled = true;
    } else {
        resumoEl.textContent = `${nomesSelecionados.length} de ${limite} sabores: ${nomesSelecionados.join(" / ")}`;
        if (nomesSelecionados.length >= 2) {
            const precoMax = Math.max.apply(null, misturaSaboresSelecionados.map(function (i) {
                return precoSaborNoTamanho(sabores[i], misturaTamanhoAtual);
            }));
            precoEl.textContent = `Preço da mistura (${misturaTamanhoAtual}): R$ ${formatarReal(precoMax)} — cobra-se o valor do sabor mais caro escolhido.`;
            btnAdd.disabled = false;
        } else {
            precoEl.textContent = "Falta escolher mais 1 sabor (mínimo 2).";
            btnAdd.disabled = true;
        }
    }
}

function confirmarAdicionarMistura() {
    const sabores = obterSaboresPizza();
    const nomesSelecionados = misturaSaboresSelecionados.map(function (i) { return sabores[i].nome; });
    if (nomesSelecionados.length < 2) return;

    const precoMax = Math.max.apply(null, misturaSaboresSelecionados.map(function (i) {
        return precoSaborNoTamanho(sabores[i], misturaTamanhoAtual);
    }));

    const nomeCombo = "Pizza mista: " + nomesSelecionados.join(" / ");
    const chave = chaveItem("mistura", nomeCombo, misturaTamanhoAtual);
    const atual = carrinho[chave] || { nome: nomeCombo, tamanho: misturaTamanhoAtual, precoUnit: precoMax, qtd: 0, categoria: "mistura" };
    atual.qtd += 1;
    carrinho[chave] = atual;
    registrarAdicao(chave);

    salvarCarrinho();
    atualizarResumoFlutuante();
    renderizarMinhasMisturas();

    // limpa a seleção pra montar a próxima mistura
    misturaSaboresSelecionados = [];
    document.querySelectorAll(".sabor-linha input[type=checkbox]").forEach(function (cb) { cb.checked = false; });
    atualizarPainelMistura();
}

function ajustarQtdMistura(chave, delta) {
    const atual = carrinho[chave];
    if (!atual) return;
    atual.qtd = Math.max(0, atual.qtd + delta);
    if (atual.qtd === 0) {
        delete carrinho[chave];
    } else {
        carrinho[chave] = atual;
        if (delta > 0) registrarAdicao(chave);
    }
    salvarCarrinho();
    atualizarResumoFlutuante();
    renderizarMinhasMisturas();
}

function renderizarMinhasMisturas() {
    const container = document.getElementById("minhas-misturas");
    if (!container) return;

    const misturas = Object.entries(carrinho).filter(function (entrada) { return entrada[1].categoria === "mistura"; });

    if (misturas.length === 0) {
        container.innerHTML = `<p class="minhas-misturas-vazio">Nenhuma mistura adicionada ainda.</p>`;
        return;
    }

    container.innerHTML = misturas.map(function (entrada) {
        const chave = entrada[0];
        const item = entrada[1];
        return `
            <div class="mistura-item">
                <div class="mistura-item-info">
                    <p>${item.nome}</p>
                    <span>${item.tamanho} · R$ ${formatarReal(item.precoUnit)} cada</span>
                </div>
                <div class="stepper-mini">
                    <button onclick="ajustarQtdMistura('${chave.replace(/'/g, "\\'")}', -1)" aria-label="Diminuir">−</button>
                    <span class="qty">${item.qtd}</span>
                    <button onclick="ajustarQtdMistura('${chave.replace(/'/g, "\\'")}', 1)" aria-label="Aumentar">+</button>
                </div>
            </div>
        `;
    }).join("");
}

function linhaTamanho(chave, label, preco) {
    return `
        <div class="tamanho-linha">
            ${label ? `<span class="tamanho-label">${label}</span>` : `<span class="tamanho-label">Unidade</span>`}
            <span class="tamanho-preco">R$ ${formatarReal(preco)}</span>
            <div class="stepper-mini">
                <button onclick="alterarQtd('${chave.replace(/'/g, "\\'")}', -1)" aria-label="Diminuir">−</button>
                <span class="qty" data-chave-qty="${chave}">0</span>
                <button onclick="alterarQtd('${chave.replace(/'/g, "\\'")}', 1)" aria-label="Aumentar">+</button>
            </div>
        </div>
    `;
}

// Compara em JS puro (em vez de montar um seletor CSS escapado) — evita
// bugs de escaping com caracteres como ":", "(" e espaço nas chaves.
function atualizarQtdNaTela(chave, valor) {
    document.querySelectorAll("[data-chave-qty]").forEach(function (el) {
        if (el.dataset.chaveQty === chave) el.textContent = valor;
    });
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
        if (delta > 0) registrarAdicao(chave);
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
function configurarBusca(inputId, containerSeletor) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener("input", function () {
        const termo = normalizar(input.value.trim());
        const secoes = document.querySelectorAll(`${containerSeletor} .cat-section`);

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
            return { nome: i.nome, tamanho: i.tamanho, qtd: i.qtd, precoUnit: i.precoUnit, categoria: i.categoria };
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
// Como cada item aparece escrito (resumo, WhatsApp, histórico, admin):
// "2x de mini-pizzas de atum" — separa o tipo de alimento do sabor.
// Bebidas/cervejas/adicionais não têm "sabor" separado, então usam o
// nome do produto direto.
// ---------------------------------------------------------------------
const TIPO_ALIMENTO = {
    atum: { s: "pizza", p: "pizzas" },
    carne: { s: "pizza", p: "pizzas" },
    calabresa: { s: "pizza", p: "pizzas" },
    presunto: { s: "pizza", p: "pizzas" },
    frango: { s: "pizza", p: "pizzas" },
    lombo: { s: "pizza", p: "pizzas" },
    queijo: { s: "pizza", p: "pizzas" },
    vegetais: { s: "pizza", p: "pizzas" },
    doces: { s: "pizza", p: "pizzas" },
    mistura: { s: "pizza mista", p: "pizzas mistas" },
    bordas: { s: "borda recheada", p: "bordas recheadas" },
    "mini-pizza": { s: "mini-pizza", p: "mini-pizzas" },
    "mini-pizza-doce": { s: "mini-pizza doce", p: "mini-pizzas doces" },
    calzone: { s: "calzone", p: "calzones" },
    "calzone-doce": { s: "calzone doce", p: "calzones doces" },
    "mini-calzone": { s: "mini calzone", p: "mini calzones" },
    "mini-calzone-doce": { s: "mini calzone doce", p: "mini calzones doces" },
    batata: { s: "batata recheada", p: "batatas recheadas" },
    pasteis: { s: "pastel", p: "pastéis" }
};

const CATEGORIAS_SEM_SABOR = ["bebidas", "cervejas", "adicionais"];

function descreverItemPedido(item) {
    const tamanho = item.tamanho ? ` (${item.tamanho})` : "";
    const tipo = TIPO_ALIMENTO[item.categoria];

    if (!tipo || CATEGORIAS_SEM_SABOR.includes(item.categoria)) {
        return `${item.qtd}x ${item.nome}${tamanho}`;
    }

    const alimento = item.qtd === 1 ? tipo.s : tipo.p;

    if (item.categoria === "mistura") {
        const sabores = item.nome.replace(/^Pizza mista:\s*/, "");
        return `${item.qtd}x de ${alimento} de ${sabores}${tamanho}`;
    }

    return `${item.qtd}x de ${alimento} de ${item.nome}${tamanho}`;
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
        const subtotal = item.precoUnit ? ` — R$ ${formatarReal(item.precoUnit * item.qtd)}` : "";
        linha.textContent = `${descreverItemPedido(item)}${subtotal}`;
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
        mensagem += `${descreverItemPedido(item)}\n`;
    });
    if (pedido.total) {
        mensagem += `\nTotal: R$ ${formatarReal(pedido.total)}`;
    }

    const numero = "5517997795847";
    link.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

// ---------------------------------------------------------------------
// Histórico de pedidos — quando o cliente clica em "Enviar pedido no
// WhatsApp", o pedido atual é arquivado num histórico separado e o
// carrinho é zerado, pra não ficar "boiando" numa próxima visita.
// ---------------------------------------------------------------------
const MAX_PEDIDOS_NO_HISTORICO = 20;

function configurarBotaoWhatsappPedido() {
    const link = document.getElementById("link-whatsapp-pedido");
    if (!link) return;

    link.addEventListener("click", function () {
        const pedidoSalvo = localStorage.getItem("pedido");
        if (!pedidoSalvo) return;
        const pedido = JSON.parse(pedidoSalvo);

        const historico = JSON.parse(localStorage.getItem("historico-pedidos") || "[]");
        historico.unshift({ data: new Date().toISOString(), itens: pedido.itens, total: pedido.total });
        if (historico.length > MAX_PEDIDOS_NO_HISTORICO) historico.length = MAX_PEDIDOS_NO_HISTORICO;
        localStorage.setItem("historico-pedidos", JSON.stringify(historico));

        // limpa o pedido atual e o carrinho — não deve sobrar nada pra
        // próxima vez que o cliente abrir o site
        localStorage.removeItem("pedido");
        localStorage.removeItem("carrinho");
        localStorage.removeItem("historico-carrinho");

        const resumoContainer = document.getElementById("resumo-pedido");
        if (resumoContainer) resumoContainer.innerHTML = "";

        renderizarHistoricoPedidos();
    });
}

function formatarPedidoTexto(pedido) {
    let texto = "";
    pedido.itens.forEach(function (item) {
        texto += `${descreverItemPedido(item)}\n`;
    });
    texto += `\nTotal: R$ ${formatarReal(pedido.total)}`;
    return texto;
}

function copiarTexto(texto, botao) {
    const restaurar = function (novoTexto) {
        const original = botao.textContent;
        botao.textContent = novoTexto;
        setTimeout(function () { botao.textContent = original; }, 1800);
    };

    if (!navigator.clipboard) {
        window.prompt("Copie o texto abaixo (Ctrl+C ou Cmd+C):", texto);
        return;
    }

    navigator.clipboard.writeText(texto)
        .then(function () { restaurar("Copiado!"); })
        .catch(function () { window.prompt("Copie o texto abaixo (Ctrl+C ou Cmd+C):", texto); });
}

function copiarPedidoHistorico(indice, botao) {
    const historico = JSON.parse(localStorage.getItem("historico-pedidos") || "[]");
    const pedido = historico[indice];
    if (!pedido) return;
    copiarTexto(formatarPedidoTexto(pedido), botao);
}

function copiarHistoricoCompleto(botao) {
    const historico = JSON.parse(localStorage.getItem("historico-pedidos") || "[]");
    if (historico.length === 0) return;

    const texto = historico.map(function (pedido) {
        const data = new Date(pedido.data).toLocaleString("pt-BR");
        return `Pedido de ${data}\n${formatarPedidoTexto(pedido)}`;
    }).join("\n\n-----\n\n");

    copiarTexto(texto, botao);
}

// Pega um pedido antigo do histórico e recoloca no carrinho, pra o
// cliente poder ajustar e enviar de novo sem digitar tudo outra vez.
function repetirPedido(indice) {
    const historico = JSON.parse(localStorage.getItem("historico-pedidos") || "[]");
    const pedido = historico[indice];
    if (!pedido) return;

    const novoCarrinho = {};
    const novoHistoricoAdicoes = [];

    pedido.itens.forEach(function (item) {
        const categoria = item.categoria || "mistura";
        const chave = chaveItem(categoria, item.nome, item.tamanho);
        novoCarrinho[chave] = {
            nome: item.nome,
            tamanho: item.tamanho,
            precoUnit: item.precoUnit,
            qtd: item.qtd,
            categoria: categoria
        };
        for (let i = 0; i < item.qtd; i++) novoHistoricoAdicoes.push(chave);
    });

    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    localStorage.setItem("historico-carrinho", JSON.stringify(novoHistoricoAdicoes));
    window.location.href = "cardapio.html";
}

function renderizarHistoricoPedidos() {
    const container = document.getElementById("historico-pedidos-lista");
    if (!container) return;

    const historico = JSON.parse(localStorage.getItem("historico-pedidos") || "[]");
    const botaoCopiarTudo = document.getElementById("btn-copiar-historico");

    if (historico.length === 0) {
        container.innerHTML = `<p class="historico-vazio">Nenhum pedido enviado ainda por este navegador.</p>`;
        if (botaoCopiarTudo) botaoCopiarTudo.style.display = "none";
        return;
    }

    if (botaoCopiarTudo) botaoCopiarTudo.style.display = "";

    container.innerHTML = historico.map(function (pedido, indice) {
        const data = new Date(pedido.data).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
        const itensHtml = pedido.itens.map(function (item) {
            return `<span>${descreverItemPedido(item)}</span>`;
        }).join("");

        return `
            <div class="historico-item">
                <div class="historico-item-topo">
                    <span class="historico-data">${data}</span>
                    <span class="historico-total">R$ ${formatarReal(pedido.total)}</span>
                </div>
                <div class="historico-item-lista">${itensHtml}</div>
                <div class="historico-item-acoes">
                    <button type="button" onclick="copiarPedidoHistorico(${indice}, this)">Copiar pedido</button>
                    <button type="button" class="secundario" onclick="repetirPedido(${indice})">Repetir pedido</button>
                </div>
            </div>
        `;
    }).join("");
}

window.onload = function () {
    renderizarCardapio();
    renderizarResumoPedido();
    configurarBotaoWhatsappPedido();
    renderizarHistoricoPedidos();
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
