/* ══════════════════════════════════════════════════════════════════════
   MODELO / DADOS — dados e regras de negócio do protótipo em um só lugar.
   Valores ILUSTRATIVOS (tarifas, limites, nº de cartão/pedido/protocolo):
   confirmar com a área responsável antes do desenvolvimento.
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Dados = {
  /* recarga */
  recarga: {
    minima: 20,
    maxima: 1440,
    abreviacaoProduto: { 'Passagem Antecipada': 'P. A.', 'Vale Transporte': 'V. T.', 'Escolar': 'Escolar' }
  },

  /* taxas por forma de pagamento — PIX e Cartão da referência; Boleto ilustrativo */
  taxasPgto: { pix: 0, credito: 1.00, boleto: 2.50 },

  /* QR Code avulso */
  tarifaQrAvulsa: 5.30,

  /* pedidos (valores múltiplos da tarifa avulsa) */
  pedidos: {
    '27994157': { data: '11/06/2026 11:33', valor: 26.50, qtd: 5, situacao: 'Aguardando Confirmação', estado: 'aberto' },
    '26238426': { data: '10/03/2026 09:42', valor: 26.50, qtd: 5, situacao: 'Liberado', estado: 'pago' },
    '22855607': { data: '07/08/2025 16:51', valor: 5.30, qtd: 1, situacao: 'Liberado', estado: 'pago' },
    '27479345': { data: '15/05/2026 10:05', valor: 5.30, qtd: 1, situacao: 'Excluído', estado: 'cancelado' },
    '27254632': { data: '04/05/2026 16:26', valor: 26.50, qtd: 5, situacao: 'Excluído', estado: 'cancelado' },
    '26154683': { data: '05/03/2026 14:17', valor: 10.60, qtd: 2, situacao: 'Excluído', estado: 'cancelado' }
  },

  /* cartões do usuário */
  cartoes: {
    '51-9': { num: '98.03.000000051-9', status: 'ativo', visual: 'azul',
              tipos: 'TRI - VALE TRANSPORTE / TRI - PASSAGEM ANTECIPADA' },
    '49-1': { num: '98.03.000000049-1', status: 'cancelado', visual: 'escolar',
              tipos: 'TRI - PASSAGEM ESCOLAR / TRI - PASSAGEM ANTECIPADA' }
  },

  /* protocolos exibidos (ilustrativos) */
  protocolos: { cancelamento: '01727357778' }
};

/* estado de sessão do protótipo (controles de demonstração) */
App.Sessao = {
  possuiCartao: false   // afeta o desvio do banner "Solicite seu cartão"
};
