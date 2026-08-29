// ===================================================================
// CARDÁPIO — Pizzaria do Gordo
// Dados de todos os produtos, organizados por categoria.
// Itens com "tamanhos" têm preço por tamanho (Brotinho/Grande).
// Itens com "preco" têm um preço único (sem variação de tamanho).
// ===================================================================

const CARDAPIO = [
    {
        id: "atum",
        nome: "Pizzas com Atum",
        itens: [
            { nome: "Atum", desc: "Atum, Cebola e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 54.00 }, { r: "Grande (8 fatias)", p: 66.00 }] },
            { nome: "Atum Especial", desc: "Atum, Cebola, Tomate e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 55.00 }, { r: "Grande (8 fatias)", p: 69.00 }] },
            { nome: "Bacalhau", desc: "Bacalhau Temperado, Ovos, Tomate, Cebola e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 68.00 }, { r: "Grande (8 fatias)", p: 105.00 }] },
            { nome: "Aliche", desc: "Mussarela, Tomate, Parmesão e Aliche", tamanhos: [{ r: "Brotinho (4 fatias)", p: 53.00 }, { r: "Grande (8 fatias)", p: 65.00 }] }
        ]
    },
    {
        id: "carne",
        nome: "Pizzas com Carne",
        itens: [
            { nome: "Filé", desc: "Filé Mignon, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 68.00 }, { r: "Grande (8 fatias)", p: 95.00 }] },
            { nome: "Filé ao Alho", desc: "Filé Mignon, Catupiry, Mussarela e Alho Frito", tamanhos: [{ r: "Brotinho (4 fatias)", p: 69.00 }, { r: "Grande (8 fatias)", p: 97.00 }] },
            { nome: "Filé ao Champignon", desc: "Filé Mignon, Catupiry, Champignon, Cebola e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 70.00 }, { r: "Grande (8 fatias)", p: 100.00 }] },
            { nome: "Filé com Rúcula", desc: "Filé Mignon, Catupiry e Mussarela coberta com Rúcula", tamanhos: [{ r: "Brotinho (4 fatias)", p: 70.00 }, { r: "Grande (8 fatias)", p: 99.00 }] },
            { nome: "Filé da Dani", desc: "Filé Mignon, Catupiry, Mussarela com Molho de Tomate e Parmesão", tamanhos: [{ r: "Brotinho (4 fatias)", p: 71.00 }, { r: "Grande (8 fatias)", p: 100.00 }] },
            { nome: "Strogonoff de Carne", desc: "Strogonoff de Carne, Champignon, Mussarela e Batata Palha", tamanhos: [{ r: "Brotinho (4 fatias)", p: 67.00 }, { r: "Grande (8 fatias)", p: 95.00 }] },
            { nome: "Filé com Gorgonzola", desc: "Filé, Cream Cheese, Mussarela e Gorgonzola", tamanhos: [{ r: "Brotinho (4 fatias)", p: 73.00 }, { r: "Grande (8 fatias)", p: 102.00 }] },
            { nome: "Nordestina", desc: "Carne Seca Temperada, Tomate, Cebola, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 75.00 }] },
            { nome: "Nordestina ao Alho", desc: "Carne Seca Temperada, Catupiry, Mussarela e Alho Frito", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 73.00 }] },
            { nome: "Quatro Carnes", desc: "Presunto, Lombo Canadense, Calabresa, Bacon, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 61.00 }, { r: "Grande (8 fatias)", p: 81.00 }] },
            { nome: "Costela", desc: "Costela, Mussarela, Pimenta Biquinho, Tomate e Cebola", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 75.00 }] }
        ]
    },
    {
        id: "calabresa",
        nome: "Pizzas com Calabresa",
        itens: [
            { nome: "Calabresa Especial", desc: "Calabresa, Cebola e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Catupiresa", desc: "Calabresa, Cebola, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 55.00 }, { r: "Grande (8 fatias)", p: 68.00 }] },
            { nome: "Novorizontina", desc: "Calabresa, Milho, Bacon, Ovos, Palmito e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 57.00 }, { r: "Grande (8 fatias)", p: 73.00 }] },
            { nome: "Baiana", desc: "Calabresa Moída, Cebola, Pimenta e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Toscana", desc: "Calabresa Moída, Cebola e Catupiry", tamanhos: [{ r: "Brotinho (4 fatias)", p: 51.00 }, { r: "Grande (8 fatias)", p: 61.00 }] },
            { nome: "Calabacon", desc: "Calabresa, Cebola, Mussarela e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 59.00 }, { r: "Grande (8 fatias)", p: 86.00 }] },
            { nome: "Do João Otávio", desc: "Calabresa, Bacon, Parmesão, Manjericão e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 54.00 }, { r: "Grande (8 fatias)", p: 67.00 }] }
        ]
    },
    {
        id: "presunto",
        nome: "Pizzas com Presunto",
        itens: [
            { nome: "Bauru", desc: "Presunto, Mussarela e Tomate", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Portuguesa do Gordo", desc: "Presunto, Palmito, Mussarela, Vinagrete, Ovos, Ervilha e Enroladinho", tamanhos: [{ r: "Brotinho (4 fatias)", p: 54.00 }, { r: "Grande (8 fatias)", p: 69.00 }] },
            { nome: "Portuguesa", desc: "Presunto, Ervilha, Ovos, Cebola e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Do Gato", desc: "Presunto, Palmito, Milho, Ovos, Tomate, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 57.00 }, { r: "Grande (8 fatias)", p: 77.00 }] },
            { nome: "Peperone", desc: "Mussarela, Peperone e Cebola", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 79.00 }] }
        ]
    },
    {
        id: "frango",
        nome: "Pizzas com Frango",
        itens: [
            { nome: "Francatu", desc: "Frango Desfiado, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Franqueijo", desc: "Frango Desfiado e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 56.00 }, { r: "Grande (8 fatias)", p: 71.00 }] },
            { nome: "Caipira", desc: "Frango Desfiado, Milho, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 58.00 }, { r: "Grande (8 fatias)", p: 74.00 }] },
            { nome: "Divina", desc: "Frango Desfiado, Cebola, Champignon, Catupiry e Tomate", tamanhos: [{ r: "Brotinho (4 fatias)", p: 56.00 }, { r: "Grande (8 fatias)", p: 71.00 }] },
            { nome: "Galeto", desc: "Frango Desfiado, Milho, Cebola, Catupiry e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 79.00 }] },
            { nome: "Franchcheddar", desc: "Frango Desfiado e Cheddar", tamanhos: [{ r: "Brotinho (4 fatias)", p: 55.00 }, { r: "Grande (8 fatias)", p: 69.00 }] },
            { nome: "Deliciosa", desc: "Frango Desfiado, Milho, Catupiry, Cebola, Tomate, Bacon e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 65.00 }, { r: "Grande (8 fatias)", p: 89.00 }] },
            { nome: "Franbrócolis", desc: "Frango Desfiado, Brócolis, Catupiry, Mussarela e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 65.00 }, { r: "Grande (8 fatias)", p: 90.00 }] },
            { nome: "Strogonoff de Frango", desc: "Strogonoff de Frango, Champignon, Mussarela e Batata Palha", tamanhos: [{ r: "Brotinho (4 fatias)", p: 53.00 }, { r: "Grande (8 fatias)", p: 67.00 }] }
        ]
    },
    {
        id: "lombo",
        nome: "Pizzas com Lombo",
        itens: [
            { nome: "Lombo", desc: "Lombo Canadense, Cebola e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Lombo II", desc: "Lombo Canadense, Cebola e Catupiry", tamanhos: [{ r: "Brotinho (4 fatias)", p: 51.00 }, { r: "Grande (8 fatias)", p: 62.00 }] },
            { nome: "Da Maju", desc: "Lombo Canadense, Palmito, Milho, Mussarela e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 76.00 }] },
            { nome: "Da Casa", desc: "Lombo Canadense, Cebola, Milho, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 58.00 }, { r: "Grande (8 fatias)", p: 72.00 }] },
            { nome: "Do Plínio", desc: "Lombo Canadense, Champignon, Palmito, Catupiry, Tomate e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 79.00 }] },
            { nome: "Espetaculosa", desc: "Lombo Canadense, Catupiry, Mussarela e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 60.00 }, { r: "Grande (8 fatias)", p: 79.00 }] },
            { nome: "Baronesa", desc: "Lombo Canadense, Cebola, Palmito, Catupiry e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 63.00 }, { r: "Grande (8 fatias)", p: 80.00 }] }
        ]
    },
    {
        id: "queijo",
        nome: "Pizzas com Queijo",
        itens: [
            { nome: "Bacon", desc: "Mussarela e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 59.00 }, { r: "Grande (8 fatias)", p: 75.00 }] },
            { nome: "Marguerita", desc: "Mussarela, Tomate e Folhas de Manjericão Frescas e Parmesão", tamanhos: [{ r: "Brotinho (4 fatias)", p: 52.00 }, { r: "Grande (8 fatias)", p: 62.00 }] },
            { nome: "Mussarela", desc: "Mussarela e Tomate", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Napolitana", desc: "Mussarela, Tomate e Parmesão", tamanhos: [{ r: "Brotinho (4 fatias)", p: 52.00 }, { r: "Grande (8 fatias)", p: 62.00 }] },
            { nome: "Palmito", desc: "Mussarela e Palmito", tamanhos: [{ r: "Brotinho (4 fatias)", p: 57.00 }, { r: "Grande (8 fatias)", p: 74.00 }] },
            { nome: "Palmito Especial", desc: "Mussarela, Palmito, Catupiry e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 64.00 }, { r: "Grande (8 fatias)", p: 87.00 }] },
            { nome: "2 Queijos", desc: "Mussarela e Catupiry", tamanhos: [{ r: "Brotinho (4 fatias)", p: 51.00 }, { r: "Grande (8 fatias)", p: 62.00 }] },
            { nome: "3 Queijos", desc: "Mussarela, Catupiry e Provolone", tamanhos: [{ r: "Brotinho (4 fatias)", p: 56.00 }, { r: "Grande (8 fatias)", p: 72.00 }] },
            { nome: "4 Queijos", desc: "Mussarela, Provolone, Gorgonzola e Catupiry", tamanhos: [{ r: "Brotinho (4 fatias)", p: 59.00 }, { r: "Grande (8 fatias)", p: 76.00 }] },
            { nome: "Gratinada", desc: "Mussarela, Catupiry e Parmesão", tamanhos: [{ r: "Brotinho (4 fatias)", p: 51.00 }, { r: "Grande (8 fatias)", p: 63.00 }] },
            { nome: "Milho", desc: "Milho e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 51.00 }, { r: "Grande (8 fatias)", p: 63.00 }] },
            { nome: "Milho Especial", desc: "Milho e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 64.00 }, { r: "Grande (8 fatias)", p: 87.00 }] }
        ]
    },
    {
        id: "vegetais",
        nome: "Pizzas com Vegetais",
        itens: [
            { nome: "Brócolis II", desc: "Brócolis, Catupiry, Bacon e Alho Frito", tamanhos: [{ r: "Brotinho (4 fatias)", p: 54.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Brócolis III", desc: "Brócolis, Mussarela, Bacon e Alho Frito", tamanhos: [{ r: "Brotinho (4 fatias)", p: 56.00 }, { r: "Grande (8 fatias)", p: 72.00 }] },
            { nome: "Vegetariana", desc: "Brócolis, Ervilha, Milho, Palmito e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 52.00 }, { r: "Grande (8 fatias)", p: 61.00 }] },
            { nome: "Rúcula c Tomate Seco", desc: "Rúcula, Tomate Seco e Mussarela", tamanhos: [{ r: "Brotinho (4 fatias)", p: 53.00 }, { r: "Grande (8 fatias)", p: 62.00 }] },
            { nome: "Escarola Bonita", desc: "Escarola, Bacon, Mussarela e Alho Frito", tamanhos: [{ r: "Brotinho (4 fatias)", p: 54.00 }, { r: "Grande (8 fatias)", p: 66.00 }] }
        ]
    },
    {
        id: "doces",
        nome: "Pizzas Doces",
        itens: [
            { nome: "Californiana", desc: "Mussarela, Pêssego, Figo, Abacaxi, Goiabada e Leite Condensado", tamanhos: [{ r: "Brotinho (4 fatias)", p: 62.00 }, { r: "Grande (8 fatias)", p: 71.00 }] },
            { nome: "Brigadeiro", desc: "Chocolate ao Leite Granulado", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Beijinho", desc: "Chocolate Branco e Coco", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Nutela com Ninho", desc: "Nutela e Leite Ninho", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Banana", desc: "Banana, Canela e Leite Condensado", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Prestígio", desc: "Chocolate ao leite e coco ralado", tamanhos: [{ r: "Brotinho (4 fatias)", p: 50.00 }, { r: "Grande (8 fatias)", p: 60.00 }] },
            { nome: "Queijadinha", desc: "Mussarela, coco ralado e leite condensado", tamanhos: [{ r: "Brotinho (4 fatias)", p: 62.00 }, { r: "Grande (8 fatias)", p: 71.00 }] },
            { nome: "Banacatu", desc: "Banana, Catupiry, Mussarela e Bacon", tamanhos: [{ r: "Brotinho (4 fatias)", p: 64.00 }, { r: "Grande (8 fatias)", p: 75.00 }] }
        ]
    },
    {
        id: "bordas",
        nome: "Bordas Recheadas",
        itens: [
            { nome: "Catupiry", preco: 15.00 },
            { nome: "Catupiry com Alho Crocante", preco: 16.00 },
            { nome: "Cheddar", preco: 17.00 },
            { nome: "Mussarela", preco: 18.00 },
            { nome: "Presunto e Mussarela", preco: 18.00 },
            { nome: "Calabresa com Catupiry", preco: 18.00 },
            { nome: "Frango com Catupiry", preco: 18.00 },
            { nome: "Chocolate ao Leite", preco: 15.00 },
            { nome: "Chocolate Branco", preco: 15.00 },
            { nome: "Catupiry com Cheddar", preco: 18.00 }
        ]
    },
    {
        id: "mini-pizza",
        nome: "Mini Pizza Tradicional",
        itens: [
            { nome: "Bauru", desc: "Presunto, Mussarela e Tomate", preco: 10.00 },
            { nome: "Calabresa", desc: "Calabresa, Mussarela e Cebola", preco: 10.00 },
            { nome: "Francatu", desc: "Frango Desfiado, Mussarela e Catupiry", preco: 12.00 },
            { nome: "Filé ao Alho", desc: "Filé Mignon, Catupiry, Mussarela e Alho Frito", preco: 22.00 },
            { nome: "Lombo", desc: "Lombo Canadense, Cebola e Mussarela", preco: 10.00 },
            { nome: "Milho", desc: "Milho e Mussarela", preco: 14.00 },
            { nome: "Mussarela", desc: "Mussarela e Tomate", preco: 10.00 },
            { nome: "Napolitana", desc: "Mussarela, Tomate e Parmesão", preco: 15.00 },
            { nome: "Marguerita", desc: "Mussarela, Tomate e Folhas de Manjericão Frescas e Parmesão", preco: 15.00 },
            { nome: "Atum", desc: "Atum, Cebola, Tomate e Mussarela", preco: 17.00 }
        ]
    },
    {
        id: "mini-pizza-doce",
        nome: "Mini Pizza Doce",
        itens: [
            { nome: "Brigadeiro", desc: "Chocolate ao Leite Granulado", preco: 10.00 },
            { nome: "Beijinho", desc: "Chocolate Branco e Coco", preco: 10.00 },
            { nome: "Banana", desc: "Banana, Canela e Leite Condensado", preco: 12.00 },
            { nome: "Nutela com Ninho", desc: "Nutela e Leite Ninho", preco: 12.00 }
        ]
    },
    {
        id: "calzone",
        nome: "Calzone Tradicional",
        itens: [
            { nome: "Brócolis", desc: "Mussarela, Brócolis, Bacon, Catupiry e Alho Crocante", preco: 65.00 },
            { nome: "Bauru", desc: "Presunto, Mussarela, Tomate e Catupiry", preco: 56.00 },
            { nome: "Calabresa", desc: "Calabresa, Mussarela, Catupiry e Cebola", preco: 57.00 },
            { nome: "Da Casa", desc: "Mussarela, Lombo, Milho, Cebola e Catupiry", preco: 62.00 },
            { nome: "Especial do Gordo", desc: "Presunto, Frango em Pedaço, Filé, Calabresa, Milho, Tomate, Ovo, Lombo Canadense, Bacon, Catupiry, Cheddar e Mussarela", preco: 105.00 },
            { nome: "Frango Tudo", desc: "Presunto, Calabresa, Milho, Tomate, Bacon, Ovo, Frango em Pedaço, Catupiry e Mussarela", preco: 70.00 },
            { nome: "Francatu", desc: "Frango em Pedaços, Mussarela e Catupiry", preco: 55.00 },
            { nome: "Filé Tudo", desc: "Presunto, Filé, Calabresa, Bacon, Ovo, Tomate, Milho, Catupiry e Mussarela", preco: 80.00 },
            { nome: "Filé", desc: "Filé Mignon, Mussarela e Catupiry", preco: 70.00 },
            { nome: "Filé ao Alho", desc: "Filé Mignon, Mussarela, Catupiry e Alho Crocante", preco: 71.00 },
            { nome: "Filé c/ Rúcula", desc: "Filé Mignon, Mussarela, Catupiry e Rúcula", preco: 72.00 },
            { nome: "Palmito", desc: "Palmito, Mussarela e Catupiry", preco: 65.00 },
            { nome: "Quatro Queijos", desc: "Mussarela, Catupiry, Parmesão e Cheddar", preco: 63.00 }
        ]
    },
    {
        id: "calzone-doce",
        nome: "Calzone Tradicional Doce",
        itens: [
            { nome: "Brigadeiro", desc: "Chocolate ao Leite Granulado", preco: 48.00 },
            { nome: "Beijinho", desc: "Chocolate Branco e Coco", preco: 48.00 },
            { nome: "Nutela com Ninho", desc: "Nutela e Leite Ninho", preco: 50.00 }
        ]
    },
    {
        id: "mini-calzone",
        nome: "Mini Calzone Tradicional",
        itens: [
            { nome: "Bauru", desc: "Presunto, Mussarela, Tomate e Catupiry", preco: 38.00 },
            { nome: "Calabresa", desc: "Calabresa, Mussarela, Catupiry e Cebola", preco: 39.00 },
            { nome: "Filé", desc: "Filé Mignon, Mussarela e Catupiry", preco: 43.00 },
            { nome: "Filé ao Alho", desc: "Filé Mignon, Mussarela, Catupiry e Alho Crocante", preco: 44.00 },
            { nome: "Filé c/ Rúcula", desc: "Filé Mignon, Mussarela, Catupiry e Rúcula", preco: 44.00 },
            { nome: "Francatu", desc: "Frango Desfiado, Mussarela e Catupiry", preco: 39.00 }
        ]
    },
    {
        id: "mini-calzone-doce",
        nome: "Mini Calzone Doce",
        itens: [
            { nome: "Brigadeiro", desc: "Chocolate ao Leite Granulado", preco: 37.00 },
            { nome: "Beijinho", desc: "Chocolate Branco e Coco", preco: 37.00 }
        ]
    },
    {
        id: "batata",
        nome: "Batata Recheada Tradicional",
        itens: [
            { nome: "Brócolis", desc: "Batata, Mussarela, Brócolis, Bacon e Catupiry", preco: 40.00 },
            { nome: "Brócolis ao Molho Branco", desc: "Batata, Mussarela, Brócolis, Molho Branco e Bacon", preco: 40.00 },
            { nome: "Bacon", desc: "Batata, Mussarela, Bacon e Catupiry", preco: 40.00 },
            { nome: "Calabresa", desc: "Batata, Mussarela, Calabresa, Cebola e Catupiry", preco: 38.00 },
            { nome: "Da Casa", desc: "Batata, Mussarela, Lombo Canadense, Cebola, Milho e Catupiry", preco: 36.00 },
            { nome: "Francatu", desc: "Batata, Mussarela, Frango em Pedaços e Catupiry", preco: 37.00 },
            { nome: "Filé", desc: "Batata, Mussarela, Filé Mignon e Catupiry", preco: 45.00 },
            { nome: "Filé ao Alho", desc: "Batata, Mussarela, Filé Mignon, Catupiry e Alho Crocante", preco: 46.00 },
            { nome: "Nordestina", desc: "Batata, Mussarela, Carne Seca e Catupiry", preco: 40.00 },
            { nome: "Palmito", desc: "Batata, Mussarela, Palmito e Catupiry", preco: 40.00 },
            { nome: "Pizza", desc: "Batata, Mussarela, Presunto, Tomate e Catupiry", preco: 39.00 },
            { nome: "Strogonoff de Frango", desc: "Batata, Mussarela, Strogonoff de Frango e Champignon", preco: 42.00 },
            { nome: "Strogonoff de Carne", desc: "Batata, Mussarela, Strogonoff de Carne e Champignon", preco: 46.00 },
            { nome: "Quatro Queijos", desc: "Batata, Mussarela, Catupiry, Provolone e Gorgonzola", preco: 42.00 }
        ]
    },
    {
        id: "pasteis",
        nome: "Pastéis",
        itens: [
            { nome: "Banana", desc: "Banana, canela, açúcar e leite condensado", preco: 12.00 },
            { nome: "Chocolate", desc: "Chocolate ao leite", preco: 12.00 },
            { nome: "Nutella com Ninho", desc: "Creme de Avelã e leite em pó", preco: 15.00 },
            { nome: "Beijinho", desc: "Chocolate branco e Coco ralado", preco: 12.00 },
            { nome: "Calabresa com Queijo", desc: "Calabresa e queijo", preco: 12.00 },
            { nome: "Franqueijo", desc: "Frango e queijo", preco: 12.00 },
            { nome: "Filé ao Alho", desc: "Filé mignon, catupiry, queijo e alho crocante", preco: 26.00 },
            { nome: "Filé", desc: "Filé mignon, queijo e catupiry", preco: 25.00 },
            { nome: "Palmito c/ Queijo", desc: "Palmito e Queijo", preco: 14.00 },
            { nome: "Carne c/ Queijo", desc: "Carne Moída e Queijo", preco: 14.00 },
            { nome: "Lombo Catupiry", desc: "Lombo Canadense e Catupiry", preco: 12.00 },
            { nome: "Carne", desc: "Carne Moída", preco: 8.00 },
            { nome: "Queijo", desc: "Mussarela", preco: 8.00 },
            { nome: "Pizza", desc: "Presunto, queijo, Tomate e Orégano", preco: 10.00 },
            { nome: "Frango Catupiry", desc: "Frango e Catupiry", preco: 12.00 },
            { nome: "Calabresa c/ Catupiry", desc: "Calabresa e Catupiry", preco: 12.00 }
        ]
    },
    {
        id: "bebidas",
        nome: "Bebidas",
        itens: [
            { nome: "Água Mineral sem Gás", preco: 5.00 },
            { nome: "Água Mineral com Gás", preco: 6.00 },
            { nome: "Coca-Cola Lata 350ml", preco: 7.00 },
            { nome: "Coca-Cola Zero Lata 350ml", preco: 7.00 },
            { nome: "Coca-Cola 1 Litro", preco: 12.00 },
            { nome: "Sprite Lata 350ml", preco: 7.00 },
            { nome: "Fanta Laranja Lata 350ml", preco: 7.00 },
            { nome: "Fanta Guaraná Lata 350ml", preco: 7.00 },
            { nome: "Fanta Uva Lata 350ml", preco: 7.00 },
            { nome: "Lemon Flash", preco: 7.00 },
            { nome: "Schweppes Citrus Lata 350ml", preco: 7.00 },
            { nome: "Schweppes Tônica Lata 350ml", preco: 7.00 },
            { nome: "Suco de Uva Lata 350ml", preco: 7.00 },
            { nome: "Suco de Pêssego Lata 350ml", preco: 7.00 },
            { nome: "Suco de Maracujá Lata 350ml", preco: 7.00 },
            { nome: "Suco de Manga Lata 350ml", preco: 7.00 },
            { nome: "Suco de Goiaba Lata 350ml", preco: 7.00 }
        ]
    },
    {
        id: "cervejas",
        nome: "Cervejas",
        itens: [
            { nome: "Skol Lata 350ml", preco: 6.00 },
            { nome: "Antarctica Lata 350ml", preco: 6.00 },
            { nome: "Heineken Long Neck", preco: 9.00 }
        ]
    },
    {
        id: "adicionais",
        nome: "Adicionais",
        itens: [
            { nome: "Calabresa", preco: 6.00 },
            { nome: "Palmito", preco: 6.00 },
            { nome: "Bacon", preco: 6.00 },
            { nome: "Parmesão", preco: 7.00 },
            { nome: "Goiabada", preco: 4.00 },
            { nome: "Banana", preco: 4.00 },
            { nome: "Ovo", preco: 4.00 },
            { nome: "Mussarela", preco: 7.00 },
            { nome: "Ervilha", preco: 4.00 },
            { nome: "Milho", preco: 4.00 },
            { nome: "Cheddar", preco: 8.00 },
            { nome: "Cebola", preco: 4.00 },
            { nome: "Catupiry", preco: 8.00 },
            { nome: "Rúcula", preco: 4.00 },
            { nome: "Aliche", preco: 8.00 },
            { nome: "Alho Frito", preco: 3.00 },
            { nome: "Brócolis", preco: 6.00 },
            { nome: "Tomate Seco", preco: 6.00 },
            { nome: "Tomate", preco: 3.00 },
            { nome: "Provolone", preco: 6.00 },
            { nome: "Lombinho", preco: 6.00 },
            { nome: "Presunto", preco: 6.00 },
            { nome: "Champignon", preco: 6.00 },
            { nome: "Gorgonzola", preco: 6.00 },
            { nome: "Batata Palha", preco: 8.00 }
        ]
    }
];

// Categorias que são pizzas "de verdade" (têm Brotinho/Grande) — usado
// pela área de "Misturar Sabores" pra montar a lista de sabores disponíveis.
const CATEGORIAS_PIZZA_IDS = [
    "atum", "carne", "calabresa", "presunto", "frango",
    "lombo", "queijo", "vegetais", "doces"
];
