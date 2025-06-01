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

/*
  Monta o payload PIX seguindo o padrão BRCode simplificado:
  Exemplo:
  000201 -> Payload Format Indicator
  2658... -> GUI do PIX (fixo para PIX)
  52040000 -> Merchant Category Code (0000 para não informado)
  5303986 -> Moeda (986 = BRL)
  54 + valor -> Valor
  58 + BR -> País
  59 + Nome -> Nome do recebedor
  60 + Cidade -> Cidade do recebedor
  62 + infos adicionais (ex: chave, info extra)
  63 + CRC16 (calculado automaticamente pela biblioteca QRCode.js, então omitimos aqui)
*/

// Dados fixos
const chavePIX = '+551199999999'; // Substitua pela sua chave PIX real
const nomeRecebedor = 'Ninja Doce LTDA';
const cidadeRecebedor = 'SAO PAULO';

// Construção do payload
const payloadPIX =
  `000201` +                                      // Payload Format Indicator
  `2658` +                                       // GUI do PIX
  `14BR.GOV.BCB.PIX` +                           // Identificador do PIX
  `01` + String(chavePIX.length).padStart(2, '0') + chavePIX + // Chave PIX
  `52040000` +                                   // Merchant Category Code
  `5303986` +                                    // Moeda (986 = BRL)
  `54` + String(total.replace('.', '')).padStart(10, '0') +    // Valor (decimal removido, 10 dígitos, ex: 0000004590)
  `58` + String('BR'.length).padStart(2, '0') + 'BR' +        // País
  `59` + String(nomeRecebedor.length).padStart(2, '0') + nomeRecebedor + // Nome
  `60` + String(cidadeRecebedor.length).padStart(2, '0') + cidadeRecebedor + // Cidade
  `62070503***` +                                 // Info adicional (fixa, placeholder)
  `6304`;                                         // CRC (placeholder, QRCode.js calcula sozinho)

// Gera QR Code
QRCode.toCanvas(document.getElementById('qrcode'), payloadPIX, { width: 256 }, function(error) {
  if (error) console.error(error);
});

document.addEventListener('DOMContentLoaded', () => {
  // Tenta ler os itens do pedido de todas as possíveis chaves
  const chaves = [
    'orderItensPagamento',
    'pedido_sobremesas',
    'pedido_cardapio',
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
  const lista = document.getElementById('lista-itens');
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