document.addEventListener('DOMContentLoaded', () => {
  const menuContainer    = document.getElementById('menu');
  const detailView       = document.getElementById('detail-view');
  const summaryView      = document.getElementById('summary-view');
  const confirmBtn       = document.getElementById('confirmar-pedido');
  const closeSummaryBtn  = document.getElementById('close-summary');
  const finalizeBtn      = document.getElementById('botao-finalizar');

  let orderItems = JSON.parse(localStorage.getItem('pedido')) || [];
//adiciona parte de um html numa parte já escrita em cima/dentro do summaryView,modal de itens
  const summaryBox = summaryView.querySelector('.box.summary');
  summaryBox.insertAdjacentHTML('beforeend', `
    <div class="cliente" style="margin: 1em 0;">
      <input id="nome" type="text" placeholder="Seu nome" style="width: 100%; padding: .5em; margin-bottom: .5em;" />
      <textarea id="endereco" rows="5" placeholder="Seu endereço" style="width: 100%; padding: .5em; margin-bottom: .5em;"></textarea>
      <input id="telefone" type="tel" placeholder="Seu telefone" style="width: 100%; padding: .5em;" />
    </div>
  `);

  const menu = [
    { nome: "🍰 Bolo de Chocolate – Chakra do Anoitecer", descricao: "Quatro fatias de bolo macio sabor chocolate com diamante negro, creme de leite, leite condensado e calda temperada.", observacao:"👤👤👤👤 Serve até quatro pessoas.", preco: 22.50, imagem: "../imagens/bolochocolate.png.png" },
    { nome: "🍨 Taça Colegial – Equipe 7", descricao: "Duas bolas de sorvete sabor creme, cobertas com calda de morango e finalizadas com duas cerejas e confetes coloridos.", observacao: "👤👤Serve até duas pessoas.", preco: 15.90, imagem: "../imagens/tacacolegial.png.png" },
    { nome: "🍮 Pudim – Técnica Secreta do Clã Nara", descricao: "Pudim cremoso de doce de leite com calda de caramelo macio e textura aveludada.", observacao: "👤👤👤Serve até três pessoas.", preco: 12.50, imagem: "../imagens/pudim.png.png" },
    { nome: "🥤 Milk-Shake – Onda de Chakra Rosa", descricao: "Milk-shake cremoso de morango com essência natural e chantilly por cima.", observacao: "👤Serve uma pessoa.", preco: 18.00, imagem: "../imagens/milkshake.png" },
    { nome: "🧁 Cupcake – Estilo Sakura Blossom", descricao: "Cupcake de limão com cobertura de calda de morango e confetes coloridos.", observacao: "👤Serve uma pessoa.", preco: 10.90, imagem: "../imagens/cupcake.png" },
    { nome: "🥐 Croissant – Golpe Sombrio do Uchiha", descricao: "Croissant folhado recheado com chocolate ao leite derretido e pincelado com calda especial.", observacao: "👤Serve uma pessoa.", preco: 8.50, imagem: "../imagens/croissant.png" },
    { nome: "🦄 Taça Infantil Unicórnio – Invocação de Gamakichi", descricao: "Sorvete de morango com calda de amora, decoração de pasta americana em forma de unicórnio e MM's.", observacao: "👤👤Serve até duas crianças.", preco: 20.00, imagem: "../imagens/tacaunicornio.png.png" },
    { nome: "🍫 Petit Gateau – Jutsu do Dragão Negro", descricao: "Bolinhas de massa de chocolate quente com sorvete de creme ao lado e calda quente.", observacao: "👤Serve uma pessoa.", preco: 19.90, imagem: "../imagens/petitgateau.png.png" },
    { nome: "🍩 Sonho – Sonho do Tsukuyomi Infinito", descricao: "Sonho frito recheado com leite condensado e polvilhado com açúcar e canela.", observacao: "👤Serve uma pessoa.", preco: 7.00, imagem: "../imagens/doce.png.png" },
    { nome: "☕ Café – Chakra da Madrugada", descricao: "Café Jamaica Blue Mountain, adoçado na medida com leite semidesnatado.", observacao: "👤Serve uma pessoa.", preco: 7.50, imagem: "../imagens/cafe.png.png" },
    { nome: "🍰 Bolo de Morango – Chakra do Amanhecer", descricao: "Bolo de morango macio com cobertura de morangos frescos...", observacao:"👤👤👤👤 Serve até quatro pessoas.", preco: 22.00, imagem: "../imagens/bolomorango.png.png" }
  ];

  menu.forEach(item => {
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
    card.addEventListener('click', () => showDetail(item));
    menuContainer.appendChild(card);
  });
//.innerhtml: adiciona parte do html no container
  function showDetail(item) {
    detailView.innerHTML = `
      <div class="box">
        <button id="close-detail">❌</button>
        <h2>${item.nome}</h2>
        <img src="${item.imagem}" alt="${item.nome}">
        <p>${item.descricao}</p>
        <p class="observacao">${item.observacao}</p>
        <p><strong>R$ ${item.preco.toFixed(2)}</strong></p>
        <textarea id="obs-detail" rows="5" style="width:100%;" placeholder="Observação (ex: retirar algo)"></textarea>
        <div style="margin-top: .5em;">
          <button id="add-item">Adicionar</button>
          <button id="remove-item">Remover</button>
        </div>
      </div>
    `;
    detailView.classList.remove('hidden'); //desativa o hidden do css
    document.getElementById('close-detail').onclick = () => detailView.classList.add('hidden'); //clicar no X fecha o modal
    document.getElementById('add-item').onclick    = () => modifyOrder(item, 'add'); //modifica,order = lista
    document.getElementById('remove-item').onclick = () => modifyOrder(item, 'remove');
  }
//findIndex procura o item e muda ele de acordo com o botão
//... pega as caracteristicas anteriores e adiciona/mescla com o novo
  function modifyOrder(item, action) {
    const obs = document.getElementById('obs-detail').value.trim() || item.observacao;
    if (action === 'add') {
      orderItems.push({ ...item, obs });
    } else {
      const idx = orderItems.findIndex(i => i.nome === item.nome && i.obs === obs);
      if (idx > -1) orderItems.splice(idx, 1);
    }
    detailView.classList.add('hidden');
    renderSummary();
  }
// Agrupa os itens por nome e observação, contando a quantidade de cada um
  // e retorna um array com os itens agrupados evitar duplicacao
  //map literalmente um mapa 
  //const key = `${i.nome}|${i.obs}`;   junta osdois,o nome e a observacao
  //map[key] = { ...i, qty: 0 };         se nao existir,cria um novo com quantidade 0
  //map[key].qty++; essa chave se for um item


//const map cria um mapa,  
// orderItems.forEach(i => {
     //const key = `${i.nome}|${i.obs}`; = em uma key,chave,tem o item e a desc junta para nao ter repeticao duplicada

     //   if (!map[key]) map[key] = { ...i, qty: 0 };
     //map[key].qty++;
   //);   se o item so tem um so,ele junta ou aumenta somente um e depois retorna
//.values(map);  retorna os valores do mapa,ou seja,os itens agrupados


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
    const listEl  = document.getElementById('lista-pedido');
    const totalEl = document.getElementById('total-pedido');
    listEl.innerHTML = ''; //comeca vazio
    let total = 0;

    groupItems().forEach((item, idx) => {
      const preco = Number(item.preco) || 0;  // Garante que  é um número
      const qty = Number(item.qty) || 0;
      total += preco * qty;
      // Adiciona coisa de html sem tirar oq esta la
      listEl.innerHTML += `
        <li>
          ${item.nome} x${qty} - R$ ${(preco * qty).toFixed(2)}
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
    if (e.target.tagName !== 'BUTTON') return; //se nao for btn click nao tem/roda
    const action = e.target.dataset.action;
    const index  = parseInt(e.target.dataset.index);
    const grouped = groupItems();
    const item = grouped[index];

    if (action === 'dec') { //Procura o item e decrementa ele em tudo,nome,desc e obs
      const idx = orderItems.findIndex(i => i.nome === item.nome && i.obs === item.obs);
      if (idx > -1) {
        orderItems.splice(idx, 1); //so remove se tiver um item pelo menos
      }
    } else if (action === 'inc') { //adiciona o item como um todo,agrupando
      orderItems.push({ ...item });
    }
    renderSummary();  //exibe a lista atualizada
  });

  confirmBtn.addEventListener('click', () => {
    summaryView.classList.remove('hidden');
    renderSummary();
  });

  closeSummaryBtn.addEventListener('click', () => {
    summaryView.classList.add('hidden');
  });

  finalizeBtn.addEventListener('click', () => {
    const nome     = document.getElementById('nome-cliente').value.trim(); //.trim remove espaço aleatorio
    const endereco = document.getElementById('endereco-cliente').value.trim(); //.trim remove espaço aleatorio
    const telefone = document.getElementById('telefone-cliente').value.trim();  //.trim remove espaço aleatorio

    if (!nome || !endereco || !telefone) {
      alert('Preencha nome, endereço e telefone antes de finalizar o pedido.');
      return;
    }

    //transforma em decimal pelo parsefloat
    //encodeURIComponent deixa tudo mais simples e seguro para passar na URL
    const total = parseFloat(document.getElementById('total-pedido').textContent) || 0;
    const pedidoId = Math.floor(Math.random() * 900) + 100;
    const nomeCliente = encodeURIComponent(nome);
    const enderecoCliente = encodeURIComponent(endereco);
    const telefoneCliente = encodeURIComponent(telefone);

    const params = `?order=${pedidoId}&total=${total.toFixed(2)}&nome=${nomeCliente}` +
                   `&endereco=${enderecoCliente}&telefone=${telefoneCliente}`;

    window.location.href = `pagamento.html${params}`;

    orderItems = [];
    localStorage.removeItem('pedido');
    renderSummary();
    summaryView.classList.add('hidden');
  });

  renderSummary();
});

