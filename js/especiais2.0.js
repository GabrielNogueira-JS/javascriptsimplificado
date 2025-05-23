document.addEventListener('DOMContentLoaded', () => {
  // Elementos principais da página
  const menuContainer   = document.getElementById('menu');
  const detailView      = document.getElementById('detail-view');
  const summaryView     = document.getElementById('summary-view');
  const confirmBtn      = document.getElementById('confirmar-pedido');
  const closeSummaryBtn = document.getElementById('close-summary');
  const finalizeBtn     = document.getElementById('botao-finalizar');

  // Array que guarda cada item adicionado
  const orderItems = [];

  const cardapio = [
    { name: "🍜 Lámen Ichiraku - Ramen do Naruto", ingredients: ["Macarrão", "Caldo de Porco", "Ovo", "Cebolinha", "Chashu"], price: 39.90, imagem: "../imagens/ramen.jpeg" },
    { name: "🍙 Bola de Arroz Onigiri - Missão Rápida", ingredients: ["Arroz Japonês", "Alga Nori", "Recheio Variado"], price: 9.50, imagem: "../imagens/onigiri.jpeg" },
    { name: "🍙 Onigiri da Hinata", ingredients: ["Arroz Japonês", "Alga Nori", "Salmão Grelhado", "Gergelim"], price: 17.50, imagem: "../imagens/oniguiri.jpeg" },
    { name: "🍢 Dango - Doce Favorito dos Ninjas", ingredients: ["Massa de Arroz", "Molho de Soja Doce"], price: 12.50, imagem: "../imagens/dango.jpeg" },
    { name: "🍛 Curry Japonês - Chakra Picante", ingredients: ["Carne", "Cenoura", "Batata", "Arroz", "Molho Curry"], price: 34.00, imagem: "../imagens/curry.jpg" },
    { name: "🐙 Takoyaki - Jutsu do Polvo Flamejante", ingredients: ["Massa", "Polvo", "Molho Takoyaki", "Cebolinha", "Katsuobushi"], price: 29.90, imagem: "../imagens/takoyaki.jpeg" },
    { name: "🦐 Tempurá - Defesa Perfeita do Byakugan", ingredients: ["Camarão", "Legumes", "Massa Crocante"], price: 28.50, imagem: "../imagens/tempura.jpeg" },
    { name: "🍢 Churrasquinho Yakitori - Espetos de Chakra", ingredients: ["Frango", "Molho Tarê"], price: 8.90, imagem: "../imagens/frng.jpeg" },
    { name: "🥩 Churrasquinho Uchiha - Espetos do Sasuke", ingredients: ["Fraudinha", "Molho Shoyu", "Maionese de Alho"], price: 12.90, imagem: "../imagens/espeto.jpg" },
    { name: "🐟 Sashimi - Técnica do Estilo Água", ingredients: ["Peixe Cru", "Shoyu", "Gengibre"], price: 32.00, imagem: "../imagens/sashimi.jpeg" },
    { name: "🍗 Karaage (Frango Frito Japonês) - Golpe Rápido de Taijutsu", ingredients: ["Frango", "Molho de Soja", "Gengibre", "Farinha de Batata"], price: 25.00, imagem: "../imagens/karage.jpeg" },
    { name: "🥞 Okonomiyaki - Jutsu Secreto de Osaka", ingredients: ["Massa", "Repolho", "Carne de Porco", "Molho Okonomiyaki"], price: 27.90, imagem: "../imagens/okono.jpeg" },
    { name: "🌱 Edamame (Soja Cozida) - Chakra Verde", ingredients: ["Soja", "Sal Grosso"], price: 10.75, imagem: "../imagens/edamame.jpeg" },
    { name: "🍟 Batata Frita - Jutsu das Lâminas Douradas", ingredients: ["Batata (500 gramas)", "Sal"], price: 25.50, imagem: "../imagens/btt.jpeg" },
    { name: "🍟 Batata Frita com Cheddar e Bacon- Jutsu das Lâminas Douradas Cremosas", ingredients: ["Batata (600 gramas)", "Sal"], price: 29.90, imagem: "../imagens/bttcb.jpg" },
    { name: "💧 Água Mineral - Fonte de Energia Natural", ingredients: ["Água Mineral (500ml)"], price: 5, imagem: "../imagens/agua.jpeg" },
    { name: "💦 Água com Gás - Técnica Borbulhante", ingredients: ["Água Gasificada (500ml)"], price: 6, imagem: "../imagens/aguacomgas.jpeg" },
    { name: "🥤 Coca-Cola - Chakra Explosivo", ingredients: ["Refrigerante de Cola (600ml Tradicional ou zero)"], price: 10, imagem: "../imagens/coca.jpeg" },
    { name: "🍊 Fanta Laranja - Modo Kurama", ingredients: ["Refrigerante de Laranja (600ml) Tradicional ou zero"], price: 7, imagem: "../imagens/fantalaranja.jpeg" },
    { name: "🍇 Fanta Uva - Genjutsu Roxo", ingredients: ["Refrigerante de Uva (600ml) Tradicional ou zero"], price: 7, imagem: "../imagens/fantauva.jpeg" },
    { name: "🌿 Kuat - Força do País do Chá", ingredients: ["Refrigerante de Guaraná (600ml) Tradicional ou zero"], price: 5, imagem: "../imagens/kuat.jpeg" },
    { name: "🍹 Suco de Laranja - Jutsu da Vitalidade", ingredients: ["Laranja", "Açúcar", "Água"], price: 8, imagem: "../imagens/laranja.jpeg" },
    { name: "🍇 Suco de Uva - Uvas da floresta Shinobi", ingredients: ["Uva", "Açúcar", "Água"], price: 8, imagem: "../imagens/uva.jpeg" },
    { name: "🍷 Vinho Tinto (1 Litro)- Sangue de Shinobi", ingredients: ["Uvas Cabernet", "Água", "Açucar Da Uva"], price: 49.90, imagem: "../imagens/vinho.jpeg" }
];

  // Renderiza cards do menu
  cardapio.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-left">
        <h3>${item.name}</h3>
        <p>${item.ingredients.join(", ")}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
      </div>
      <div class="card-right">
        <img src="${item.imagem}" alt="${item.name}">
      </div>
    `;

    // Ao clicar no card, abre o detalhe
    card.addEventListener('click', () => showDetail(item));
    menuContainer.appendChild(card);
  });

  // Abre a modal de detalhe de item
  function showDetail(item) {
    detailView.innerHTML = `
      <div class="box">
        <button id="close-detail">❌</button>
        <h2>${item.name}</h2>
        <img src="${item.imagem}" alt="${item.name}">
        <p>${item.descricao}</p>
        <p><strong>R$ ${item.price.toFixed(2)}</strong></p>
        <textarea id="obs-detail" placeholder="Adicionais ou remoções"></textarea>
        <div>
          <button id="add-item">Adicionar</button>
          <button id="remove-item">Remover</button>
        </div>
      </div>
    `;
    detailView.classList.remove('hidden');

    document.getElementById('close-detail').onclick = () => detailView.classList.add('hidden');
    document.getElementById('add-item').onclick = () => modifyOrder(item, 'add');
    document.getElementById('remove-item').onclick = () => modifyOrder(item, 'remove');
  }

  // Adiciona ou remove do pedido
  function modifyOrder(item, action) {
    const obs = document.getElementById('obs-detail').value.trim() || item.observacao;
    if (action === 'add') orderItems.push({ ...item, obs });
    else {
      const idx = orderItems.findIndex(i => i.name === item.name && i.obs === obs);
      if (idx > -1) orderItems.splice(idx, 1);
    }
    detailView.classList.add('hidden');
  }

  // Agrupa itens iguais e retorna array
  function groupItems() {
    const map = {};
    orderItems.forEach(i => {
      const key = `${i.name}|${i.obs}`;
      if (!map[key]) map[key] = { ...i, qty: 0 };
      map[key].qty++;
    });
    return Object.values(map);
  }

  // Monta e exibe o resumo do pedido
  function renderSummary() {
    const listEl = document.getElementById('lista-pedido');
    const totalEl = document.getElementById('total-pedido');
    listEl.innerHTML = '';

    let total = 0;
    groupItems().forEach((item, idx) => {
      total += item.price * item.qty;
      listEl.innerHTML += `
        <li>
          ${item.name} x${item.qty} - R$ ${(item.price * item.qty).toFixed(2)}
          <div>
            <button data-action="dec" data-index="${idx}">-</button>
            <button data-action="inc" data-index="${idx}">+</button>
          </div>
        </li>
      `;
    });

    totalEl.textContent = total.toFixed(2);
  }

  // Delegação de eventos para os botões de + e - no resumo
  document.getElementById('lista-pedido').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    const { action, index } = e.target.dataset;
    const items = groupItems();
    const item = items[index];

    if (action === 'inc') orderItems.push({ name: item.name, price: item.price, obs: item.obs });
    if (action === 'dec') {
      const idx = orderItems.findIndex(i => i.name === item.name && i.obs === item.obs);
      if (idx > -1) orderItems.splice(idx, 1);
    }
    renderSummary();
  });

  // Abre modal de resumo
  confirmBtn.onclick = () => {
    renderSummary();
    summaryView.classList.remove('hidden');
  };

  // Fecha modal de resumo
  closeSummaryBtn.onclick = () => summaryView.classList.add('hidden');

  // Finalizar pedido: imprime no console

  
});
document.getElementById('finalizar-pedido')
  .addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total-pedido').textContent);
    const pedidoId = String(Math.floor(Math.random() * 900) + 100); // ex: 123
    window.location.href = `pagamento.html?order=${pedidoId}&total=${total.toFixed(2)}`;
  });

