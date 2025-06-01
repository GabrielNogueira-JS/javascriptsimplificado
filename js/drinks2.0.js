document.addEventListener('DOMContentLoaded', () => {
  const menuContainer   = document.getElementById('menu');
  const detailView      = document.getElementById('detail-view');
  const summaryView     = document.getElementById('summary-view');
  const confirmBtn      = document.getElementById('confirmar-pedido');
  const closeSummaryBtn = document.getElementById('close-summary');
  const finalizeBtn     = document.getElementById('finalizar-pedido');

  let orderItems = JSON.parse(localStorage.getItem('pedido')) || [];

  const summaryBox = summaryView.querySelector('.box.summary');
  summaryBox.insertAdjacentHTML('beforeend', `
    <div class="cliente-dados" style="margin: 1em 0;">
      <input id="nome-cliente" type="text" 
             placeholder="Seu nome" 
             style="width: 100%; padding: .5em; margin-bottom: .5em;" 
             required />

      <textarea id="endereco-cliente" rows="5" 
                placeholder="Seu endereço" 
                style="width: 100%; padding: .5em; margin-bottom: .5em;" 
                required></textarea>

     <input id="telefone-cliente" type="tel" 
           placeholder="Seu telefone" 
           style="width: 100%; padding: .5em;" 
           required />
    </div>
  `);


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

  drinks.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-left">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <p>${item.observacao}</p>
        <p>R$ ${item.preco.toFixed(2)}</p>
      </div>
      <div class="card-right">
        <img src="${item.imagem}" alt="${item.nome}">
      </div>
    `;
    card.addEventListener('click', () => showDetail(item));
    menuContainer.appendChild(card);
  });

  function showDetail(item) {
    detailView.innerHTML = `
      <div class="box">
        <button id="close-detail">❌</button>
        <h2>${item.nome}</h2>
        <img src="${item.imagem}" alt="${item.nome}">
        <p>${item.descricao}</p>
        <p><strong>R$ ${item.preco.toFixed(2)}</strong></p>
        <p>${item.observacao}</p>
        <textarea id="obs-detail" rows="5" style="width: 100%;" placeholder="Retirar alguma Coisa?"></textarea>
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

  function modifyOrder(item, action) {
    const obs = document.getElementById('obs-detail').value.trim() || item.observacao;
    if (action === 'add') orderItems.push({ ...item, obs });
    else {
      const idx = orderItems.findIndex(i => i.nome === item.nome && i.obs === obs);
      if (idx > -1) orderItems.splice(idx, 1);
    }
    detailView.classList.add('hidden');
    renderSummary();
  }

  function groupItems() {
    const map = {};
    orderItems.forEach(i => {
      const key = `${i.nome}|${i.obs}`;
      if (!map[key]) map[key] = { ...i, qty: 0 };
      map[key].qty++;
    });
    return Object.values(map);
  }

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

    if (isNaN(total)) total = 0;
    totalEl.textContent = total.toFixed(2);
    localStorage.setItem('pedido', JSON.stringify(orderItems));
  }

  document.getElementById('lista-pedido').addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
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

  confirmBtn.onclick = () => {
    renderSummary();
    summaryView.classList.remove('hidden');
  };

  closeSummaryBtn.onclick = () => {
    summaryView.classList.add('hidden');
    renderSummary();
  };
  renderSummary();

  finalizeBtn.addEventListener('click', () => {
    const nome     = document.getElementById('nome-cliente').value.trim();
    const endereco = document.getElementById('endereco-cliente').value.trim();
    const telefone = document.getElementById('telefone-cliente').value.trim();

    const total = parseFloat(document.getElementById('total-pedido').textContent) || 0;

    if (!nome || !endereco || !telefone) {
      alert('Preencha todos os campos antes de finalizar o pedido.');
      return;
    }
    if (total === 0) {
      alert('Adicione um Chackra ou Sucumba!');
      return;
    }

    const pedidoId = Math.floor(Math.random() * 900) + 100;
    const nomeCliente = encodeURIComponent(nome);
    const enderecoCliente = encodeURIComponent(endereco);
    const telefoneCliente = encodeURIComponent(telefone);

    const OrderItens = encodeURIComponent(
      groupItems().map(item => {
        let texto = `${item.nome} x${item.qty}`;
        if (item.obs && item.obs !== item.observacao) {
          texto += ` (Obs: ${item.obs})`;
        }
        return texto;
      }).join('; ')
    );

    const params = `?order=${pedidoId}&total=${total.toFixed(2)}&nome=${nomeCliente}` +
                   `&endereco=${enderecoCliente}&telefone=${telefoneCliente}` +
                   `&itens=${OrderItens}`;

    window.location.href = `pagamento.html${params}`;

    orderItems = [];
    localStorage.removeItem('pedido');
    renderSummary();
    summaryView.classList.add('hidden');
  });
});