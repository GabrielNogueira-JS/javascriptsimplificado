document.addEventListener('DOMContentLoaded', () => {
  // Elementos principais
  const menuContainer   = document.getElementById('menu');
  const detailView      = document.getElementById('detail-view');
  const summaryView     = document.getElementById('summary-view');
  const confirmBtn      = document.getElementById('confirmar-pedido');
  const closeSummaryBtn = document.getElementById('close-summary');
  const finalizeBtn     = document.getElementById('finalizar-pedido');

  let orderItems = JSON.parse(localStorage.getItem('pedido')) || [];

  const cardapio = [
    { name: "🥓X-Bacon",     ingredients: ["Pão", "Bacon", "Queijo", "Hambúrguer", "Maionese"], price: 15.90, imagem: "../imagens/bacon.png" },
    { name: "🥒X-Salada",    ingredients: ["Pão", "Queijo", "Hambúrguer", "Alface", "Tomate"], price: 13.50, imagem: "../imagens/salada.png" },
    { name: "🍱X-Tudo",      ingredients: ["Pão", "Hambúrguer", "Queijo", "Presunto", "Bacon", "Ovo", "Alface", "Tomate"], price: 18.00, imagem: "../imagens/xtudo.png" },
    { name: "🐔X-Frango",    ingredients: ["Pão", "Frango desfiado", "Queijo", "Alface", "Tomate"], price: 14.50, imagem: "../imagens/frango.png" },
    { name: "🫑X-Calabresa", ingredients: ["Pão", "Calabresa", "Queijo", "Tomate"], price: 16.00, imagem: "../imagens/calabresa.png" },
    { name: "🍳X-Egg",       ingredients: ["Pão", "Ovo", "Queijo", "Hambúrguer"], price: 14.00, imagem: "../imagens/egg.png" },
    { name: "🍖X-Picanha",   ingredients: ["Pão", "Picanha", "Queijo", "Alface", "Tomate"], price: 19.90, imagem: "../imagens/picanha.png" },
    { name: "🌱X-Vegano",    ingredients: ["Pão integral", "Hambúrguer de soja", "Queijo vegano", "Alface", "Tomate"], price: 17.50, imagem: "../imagens/vegano.png" },
  ];

  // Renderiza o cardápio
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
    card.addEventListener('click', () => showDetail(item));
    menuContainer.appendChild(card);
  });

  // Detalhe do item
  function showDetail(item) {
    detailView.innerHTML = `
      <div class="box">
        <button id="close-detail">❌</button>
        <h2>${item.name}</h2>
        <img src="${item.imagem}" alt="${item.name}">
        <p>${item.ingredients.join(", ")}</p>
        <p><strong>R$ ${item.price.toFixed(2)}</strong></p>
        <textarea id="obs-detail" rows="5" placeholder="Adicionais ou remoções"></textarea>
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

  // Adiciona ou remove itens
  function modifyOrder(item, action) {
    const obs = document.getElementById('obs-detail').value.trim();
    const observacao = obs || ""; // impede undefined
    if (action === 'add') {
      orderItems.push({ ...item, obs: observacao });
    } else {
      const idx = orderItems.findIndex(i => i.name === item.name && i.obs === observacao);
      if (idx > -1) orderItems.splice(idx, 1);
    }
    detailView.classList.add('hidden');
    renderSummary();
  }

  // Agrupa itens iguais
  function groupItems() {
    const map = {};
    orderItems.forEach(i => {
      const key = `${i.name}|${i.obs}`;
      if (!map[key]) map[key] = { ...i, qty: 0 };
      map[key].qty++;
    });
    return Object.values(map);
  }

  // Renderiza o resumo
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
    localStorage.setItem('pedido', JSON.stringify(orderItems));
  }

  // Botões de incrementar/decrementar
  document.getElementById('lista-pedido').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    const { action, index } = e.target.dataset;
    const items = groupItems();
    const item = items[index];

    if (!item) return;

    if (action === 'inc') {
      orderItems.push({ name: item.name, price: item.price, obs: item.obs });
    } else if (action === 'dec') {
      const idx = orderItems.findIndex(i => i.name === item.name && i.obs === item.obs);
      if (idx > -1) orderItems.splice(idx, 1);
    }

    renderSummary();
  });

  // Abre resumo
  confirmBtn.onclick = () => {
    renderSummary();
    summaryView.classList.remove('hidden');
  };

  // Fecha resumo
  closeSummaryBtn.onclick = () => {
    summaryView.classList.add('hidden');
  };

  // Finaliza pedido
  finalizeBtn?.addEventListener('click', () => {
    const total = parseFloat(document.getElementById('total-pedido').textContent);
    const pedidoId = String(Math.floor(Math.random() * 900) + 130);
    window.location.href = `pagamento.html?order=${pedidoId}&total=${total.toFixed(2)}`;
  });

  // Carrega pedido salvo
  renderSummary();
  console.log("Pedido carregado:", orderItems);
});
