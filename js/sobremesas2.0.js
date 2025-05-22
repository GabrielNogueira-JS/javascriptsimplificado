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

  const menu = [
    {
      nome:      "🍰 Bolo de Chocolate – Chakra do Anoitecer",
      descricao: "Quatro fatias de bolo macio sabor chocolate com diamante negro, creme de leite, leite condensado e calda temperada.",
      observacao:"👤👤👤👤 Serve até quatro pessoas.",
      preco:     22.50,
      imagem:    "../imagens/bolochocolate.png.png"
    },
    {
      nome: "🍨 Taça Colegial – Equipe 7",
      descricao: "Duas bolas de sorvete sabor creme, cobertas com calda de morango e finalizadas com duas cerejas e confetes coloridos.",
      observacao: "👤👤Serve até duas pessoas.",
      preco: 15.90,
      imagem: "../imagens/tacacolegial.png.png"
    },
    {
      nome: "🍮 Pudim – Técnica Secreta do Clã Nara",
      descricao: "Pudim cremoso de doce de leite com calda de caramelo macio e textura aveludada.",
      observacao: "👤👤👤Serve até três pessoas.",
      preco: 12.50,
      imagem: "../imagens/pudim.png.png"
    },
    {
      nome: "🥤 Milk-Shake – Onda de Chakra Rosa",
      descricao: "Milk-shake cremoso de morango com essência natural e chantilly por cima.",
      observacao: "👤Serve uma pessoa.",
      preco: 18.00,
      imagem: "../imagens/milkshake.png"
    },
    {
      nome: "🧁 Cupcake – Estilo Sakura Blossom",
      descricao: "Cupcake de limão com cobertura de calda de morango e confetes coloridos.",
      observacao: "👤Serve uma pessoa.",
      preco: 10.90,
      imagem: "../imagens/cupcake.png"
    },
    {
      nome: "🥐 Croissant – Golpe Sombrio do Uchiha",
      descricao: "Croissant folhado recheado com chocolate ao leite derretido e pincelado com calda especial.",
      observacao: "👤Serve uma pessoa.",
      preco: 8.50,
      imagem: "../imagens/croissant.png"
    },
    {
      nome: "🦄 Taça Infantil Unicórnio – Invocação de Gamakichi",
      descricao: "Sorvete de morango com calda de amora, decoração de pasta americana em forma de unicórnio e MM's.",
      observacao: "👤👤Serve até duas crianças.",
      preco: 20.00,
      imagem: "../imagens/tacaunicornio.png.png"
    },
    {
      nome: "🍫 Petit Gateau – Jutsu do Dragão Negro",
      descricao: "Bolinhas de massa de chocolate quente com sorvete de creme ao lado e calda quente.",
      observacao: "👤Serve uma pessoa.",
      preco: 19.90,
      imagem: "../imagens/petitgateau.png.png"
    },
    {
      nome: "🍩 Sonho – Sonho do Tsukuyomi Infinito",
      descricao: "Sonho frito recheado com leite condensado e polvilhado com açúcar e canela.",
      observacao: "👤Serve uma pessoa.",
      preco: 7.00,
      imagem: "../imagens/doce.png.png"
    },
    {
      nome: "☕ Café – Chakra da Madrugada",
      descricao: "Café Jamaica Blue Mountain, adoçado na medida com leite semidesnatado.",
      observacao: "👤Serve uma pessoa.",
      preco: 7.50,
      imagem: "../imagens/cafe.png.png"
    },
    {
      nome:      "🍰 Bolo de Morango – Chakra do Amanhecer",
      descricao: "Bolo de morango macio com cobertura de morangos frescos...",
      observacao:"👤👤👤👤 Serve até quatro pessoas.",
      preco:     22.00,
      imagem:    "../imagens/bolomorango.png.png"
    }
  ];

  // Renderiza cards do menu
  menu.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-left">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <p class="observacao">${item.observacao}</p>
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

  // Abre modal de resumo
  confirmBtn.onclick = () => {
    renderSummary();
    summaryView.classList.remove('hidden');
  };

  // Fecha modal de resumo
  closeSummaryBtn.onclick = () => summaryView.classList.add('hidden');

  // Finalizar pedido: imprime no console
  
   
  
});
document.getElementById('botao-finalizar').onclick = () => {
  const total = parseFloat(document.getElementById('total-pedido').textContent);
  const pedidoId = String(Math.floor(Math.random() * 900) + 100); // ex: 123
  window.location.href = `pagamento.html?order=${pedidoId}&total=${total.toFixed(2)}`;
};


