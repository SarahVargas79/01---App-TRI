/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / PEDIDOS — lista com abas (Em aberto/Pagos/Cancelados) e
   tela de detalhe. Dados dos pedidos vêm do modelo App.Dados.pedidos.
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Pedidos = (function (Roteador, Dados, Formato) {

  Roteador.registrarTitulos({ pedidos: 'Pedidos', pedidoDetalhe: 'Detalhe' });

  let valorPedidoAberto = 0;

  function abrir() {
    mostrarTab('aberto');
    Roteador.navegar('pedidos');
  }

  function mostrarTab(aba) {
    ['aberto', 'pagos', 'cancelados'].forEach(t => {
      document.getElementById('ped-lista-' + t).classList.toggle('oculto', t !== aba);
      document.getElementById('ped-tab-' + t).classList.toggle('ativa', t === aba);
    });
  }

  function abrirDetalhe(num) {
    const p = Dados.pedidos[num];
    document.getElementById('detNum').textContent = 'Pedido: ' + num;
    document.getElementById('detData').textContent = p.data;
    document.getElementById('detValor').textContent = Formato.brl(p.valor);
    document.getElementById('detSituacao').textContent = p.situacao;
    document.getElementById('detQtd').textContent =
      Formato.brl(p.valor) + ' (' + p.qtd + (p.qtd > 1 ? ' QRCODES)' : ' QRCODE)');
    document.getElementById('detTotal').textContent = Formato.brl(p.valor);
    /* só pedidos em aberto exibem as ações Pagar / Aguarde */
    document.getElementById('detAcoes').style.display = (p.estado === 'aberto') ? 'flex' : 'none';
    valorPedidoAberto = p.valor;
    Roteador.navegar('pedidoDetalhe');
  }

  function pagar() {
    document.getElementById('valorPedido').textContent = Formato.brl(valorPedidoAberto);
    Roteador.navegar('recargaPedido');
  }

  return { abrir, mostrarTab, abrirDetalhe, pagar };
})(App.Roteador, App.Dados, App.Formato);
