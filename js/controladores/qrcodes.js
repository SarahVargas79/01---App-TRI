/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / QR CODES — lista (Disponíveis/Utilizados, proteção) e
   compra de passagem avulsa (viajar → tipo → quantidade → pagamento).
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.QrCodes = (function (Roteador, Modal, Dados, Formato) {

  Roteador.registrarTitulos({
    qrcodes: 'QR Codes TRI', qrViajar: 'Passagem Avulsa', qrTipo: 'Passagem Avulsa',
    qrQtd: 'Passagem Avulsa', qrPagamento: 'Passagem Avulsa'
  });

  /* botão flutuante de proteção só aparece na lista de QR Codes */
  Roteador.registrarAoMostrar(function (id) {
    document.getElementById('btnLock').style.display = (id === 'qrcodes') ? 'flex' : 'none';
  });

  let qtd = 0;

  function abrir() {
    mostrarTab('disponiveis');
    Roteador.navegar('qrcodes');
  }

  function mostrarTab(aba) {
    const disp = aba === 'disponiveis';
    document.getElementById('qrListaDisp').classList.toggle('oculto', !disp);
    document.getElementById('qrListaUtil').classList.toggle('oculto', disp);
    document.getElementById('qrTabDisp').classList.toggle('ativa', disp);
    document.getElementById('qrTabUtil').classList.toggle('ativa', !disp);
  }

  function alternarLock() {
    const card = document.getElementById('qrCardDisp');
    const protegido = card.classList.toggle('protegido');
    document.getElementById('lockIcon').innerHTML = protegido
      ? '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7-1.3"/>'
      : '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>';
  }

  function escolherQtd(n, btn) {
    qtd = n;
    document.querySelectorAll('#numGridQr .num-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    document.getElementById('qtdQrLabel').textContent = n;
    document.getElementById('totalQrLabel').textContent = Formato.brl(n * Dados.tarifaQrAvulsa);
    document.getElementById('btnAvancarQr').disabled = n === 0;
  }

  function irPagamento() {
    const base = qtd * Dados.tarifaQrAvulsa;
    document.getElementById('qtdQrPag').textContent = qtd;
    document.getElementById('totalQrPix').textContent = Formato.brl(base + Dados.taxasPgto.pix);
    document.getElementById('totalQrCredito').textContent = Formato.brl(base + Dados.taxasPgto.credito);
    document.getElementById('totalQrBoleto').textContent = Formato.brl(base + Dados.taxasPgto.boleto);
    Roteador.navegar('qrPagamento');
  }

  function pagar(metodo) {
    if (metodo === 'pix') {
      document.getElementById('valorPedido').textContent =
        Formato.brl(qtd * Dados.tarifaQrAvulsa + Dados.taxasPgto.pix);
      Roteador.navegar('recargaPedido');
      return;
    }
    const nome = metodo === 'credito' ? 'Cartão de Crédito' : 'Boleto';
    Modal.foraEscopo('Pagamento por ' + nome);
  }

  function reset() {
    qtd = 0;
    document.querySelectorAll('#numGridQr .num-btn').forEach(b => b.classList.remove('sel'));
    document.getElementById('qtdQrLabel').textContent = '0';
    document.getElementById('totalQrLabel').textContent = Formato.brl(0);
    document.getElementById('btnAvancarQr').disabled = true;
    mostrarTab('disponiveis');
  }

  return { abrir, mostrarTab, alternarLock, escolherQtd, irPagamento, pagar, reset };
})(App.Roteador, App.Modal, App.Dados, App.Formato);
