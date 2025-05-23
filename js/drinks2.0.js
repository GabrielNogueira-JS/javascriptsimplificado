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

  const drinks = [
    { nome: "🍍 Piña Colada", descricao: "Rum, leite de coco e suco de abacaxi gelado.", observacao: "👤 Serve uma pessoa.", preco: 20.00, imagem: "../imagens/pinacolada.png.png" },
    { nome: "🍸 Margarita", descricao: "Tequila, licor de laranja e suco de limão.", observacao: "👤 Serve uma pessoa.", preco: 22.00, imagem: "../imagens/margarita.png.jpeg" },
    { nome: "🌿 Mojito", descricao: "Rum branco, hortelã, açúcar, limão e água com gás.", observacao: "👤 Serve uma pessoa.", preco: 18.50, imagem: "../imagens/mojito.png.jpeg" },
    { nome: "🍋 Caipirinha", descricao: "Cachaça, açúcar e limão fresco.", observacao: "👤 Serve uma pessoa.", preco: 15.00, imagem: "../imagens/caipirosca.png" },
    { nome: "🍹 Daiquiri", descricao: "Rum branco, suco de limão e açúcar.", observacao: "👤 Serve uma pessoa.", preco: 19.00, imagem: "../imagens/daiquiri.png.jpeg" },
    { nome: "🌅 Tequila Sunrise", descricao: "Tequila, suco de laranja e groselha.", observacao: "👤 Serve uma pessoa.", preco: 21.00, imagem: "../imagens/tequila.png" },
    { nome: "🍊 Negroni", descricao: "Gin, vermute rosso e campari.", observacao: "👤 Serve uma pessoa.", preco: 25.00, imagem: "../imagens/negroni.png" },
    { nome: "🍅 Bloody Mary", descricao: "Vodka, suco de tomate, molho inglês, pimenta e suco de limão.", observacao: "👤 Serve uma pessoa.", preco: 23.00, imagem: "../imagens/bm.jpeg" },
    { nome: "🌴 Mai Tai", descricao: "Rum, licor de laranja, suco de limão e xarope de amêndoa.", observacao: "👤 Serve uma pessoa.", preco: 24.00, imagem: "../imagens/maitai.png" }
];


  // Renderiza cards do menu
  drinks.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-left">
        <h3>${item.nome}</h3>
        <p>${item.ingredients.join(", ")}</p>
        <p>R$ ${item.preco.toFixed(2)}</p>
      </div>
      <div class="card-right">
        <img src="${item.imagem}" alt="${item.nome}">
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
        <h2>${item.nome}</h2>
        <img src="${item.imagem}" alt="${item.nome}">
        <p>${item.descricao}</p>
        <p><strong>R$ ${item.preco.toFixed(2)}</strong></p>
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
      const idx = orderItems.findIndex(i => i.nome === item.nome && i.obs === obs);
      if (idx > -1) orderItems.splice(idx, 1);
    }
    detailView.classList.add('hidden');
  }

  // Agrupa itens iguais e retorna array
  function groupItems() {
    const map = {};
    orderItems.forEach(i => {
      const key = `${i.nome}|${i.obs}`;
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
      total += item.preco * item.qty;
      listEl.innerHTML += `
        <li>
          ${item.nome} x${item.qty} - R$ ${(item.preco * item.qty).toFixed(2)}
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
    if (e.target.tagnome !== 'BUTTON') return;
    const { action, index } = e.target.dataset;
    const items = groupItems();
    const item = items[index];

    if (action === 'inc') orderItems.push({ nome: item.nome, preco: item.preco, obs: item.obs });
    if (action === 'dec') {
      const idx = orderItems.findIndex(i => i.nome === item.nome && i.obs === item.obs);
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

