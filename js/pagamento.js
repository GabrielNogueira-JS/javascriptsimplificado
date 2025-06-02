// Função para formatar valor para o padrão PIX (ex: 45.90 -> "45.90")
function formatarValorPIX(valor) {
  let num = Number(valor);
  if (isNaN(num) || num <= 0) return "0.00";
  return num.toFixed(2);
}

// Captura parâmetros da URL
const params = new URLSearchParams(location.search);
const pedidoId = params.get('order') || '00';
const totalRaw = params.get('total') || '0.00';
const nome = params.get('nome') || 'Cliente';
const telefone = params.get('telefone') || 'Não informado';
const endereco = params.get('endereco') || 'Não informado';



// Formata o valor para padrão PIX
const total = formatarValorPIX(totalRaw);

// Preenche os dados na página
document.getElementById('pedido-id').textContent = '#' + pedidoId;
document.getElementById('valor').textContent = total;
document.getElementById('nome').textContent = nome;
document.getElementById('telefone').textContent = telefone;
document.getElementById('endereco').textContent = endereco;


document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-itens');
  // Tenta encontrar os itens do pedido em diferentes chaves
  const chaves = [
    'pedido_cardapio',            
    'pedido_sobremesas',         
    'pedido_drinks',             
    'pedido_especial'          
  ];
  let itens = [];
  for (const chave of chaves) {
    const dados = localStorage.getItem(chave);
    if (dados) {
      try {
        const arr = JSON.parse(dados);
        if (Array.isArray(arr) && arr.length > 0) {
          itens = arr;
          break;
        }
      } catch {}
    }
  }

  // Exibe os itens na lista
  if (itens.length && lista) {
    itens.forEach(item => {
      let texto = `${item.nome || item.name} x${item.qty || 1}`;
      if (item.obs && item.obs !== item.observacao) {
        texto += ` (Obs: ${item.obs})`;
      }
      const li = document.createElement('li');
      li.textContent = texto;
      lista.appendChild(li);
    });
  } else if (lista) {
    lista.innerHTML = '<li>Nenhum item no pedido.</li>';
  }
});