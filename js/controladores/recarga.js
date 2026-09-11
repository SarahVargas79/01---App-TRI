/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / RECARGA — tipo → valor → pagamento → pedido PIX.
   Regras (mínimo/máximo/taxas) vêm do modelo App.Dados.
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Recarga = (function (Roteador, Modal, Dados, Formato) {

  Roteador.registrarTitulos({
    recargaTipo: 'Recarga', recargaValor: 'Recarga',
    recargaPagamento: 'Recarga', recargaPedido: 'Pedido'
  });

  let tipo = null;
  let valor = 0;

  function selecionar(t) {
    tipo = t;
    valor = 0;
    document.getElementById('produtoLabel').textContent =
      'Produto ' + (Dados.recarga.abreviacaoProduto[t] || t);
    document.getElementById('valorLivre').value = '';
    Roteador.navegar('recargaValor');
  }

  function escolherValor(v) {
    valor = v;
    irPagamento();
  }

  function confirmarValorLivre() {
    const texto = document.getElementById('valorLivre').value.replace(/[R$\s.]/g, '').replace(',', '.');
    const v = parseFloat(texto);
    if (!v || isNaN(v)) {
      Modal.informar('Valor inválido', 'Informe o valor da recarga ou escolha uma das opções.');
      return;
    }
    if (v < Dados.recarga.minima || v > Dados.recarga.maxima) {
      Modal.informar('Valor fora do limite', 'A recarga deve ser de no mínimo R$ 20,00 e no máximo R$ 1.440,00.');
      return;
    }
    valor = v;
    irPagamento();
  }

  function irPagamento() {
    document.getElementById('produtoLabelPag').textContent =
      'Produto ' + (Dados.recarga.abreviacaoProduto[tipo] || tipo);
    document.getElementById('totalPix').textContent = Formato.brl(valor + Dados.taxasPgto.pix);
    document.getElementById('totalCredito').textContent = Formato.brl(valor + Dados.taxasPgto.credito);
    document.getElementById('totalBoleto').textContent = Formato.brl(valor + Dados.taxasPgto.boleto);
    Roteador.navegar('recargaPagamento');
  }

  function pagar(metodo) {
    if (metodo === 'pix') {
      document.getElementById('valorPedido').textContent = Formato.brl(valor + Dados.taxasPgto.pix);
      Roteador.navegar('recargaPedido');
      return;
    }
    /* Cartão de Crédito e Boleto: telas específicas ainda a replicar */
    const nome = metodo === 'credito' ? 'Cartão de Crédito' : 'Boleto';
    Modal.foraEscopo('Pagamento por ' + nome);
  }

  function copiarChave() {
    const btn = document.getElementById('btnCopiarChave');
    if (btn) {
      btn.textContent = 'Chave copiada ✓';
      setTimeout(() => {
        btn.textContent = 'Copiar chave';
      }, 1500);
    }
  }

  /* "Retornar ao menu" do pedido PIX: zera recarga + QR e volta à Home */
  function retornarMenu() {
    tipo = null;
    valor = 0;
    document.getElementById('valorLivre').value = '';
    App.QrCodes.reset();
    Roteador.irPara('home');
  }

  return { selecionar, escolherValor, confirmarValorLivre, pagar, copiarChave, retornarMenu };
})(App.Roteador, App.Modal, App.Dados, App.Formato);
