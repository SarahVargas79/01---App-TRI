/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / HOME — banner "Solicite seu cartão", menu lateral e
   atalhos simples (Notificações, Perfil, tela Solicitar Cartão).
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Home = (function (Roteador, Modal, Sessao) {

  Roteador.registrarTitulos({
    solicitarCartao: 'Solicitar Cartão',
    notificacoes: 'Notificações',
    perfil: 'Perfil'
  });

  /* banner "Solicite seu cartão": se o usuário já possui cartão, vai ao
     menu de cartões; senão, tela Solicitar Cartão */
  function solicitarCartao() {
    if (Sessao.possuiCartao) { App.Cartoes.abrirGestao(); return; }
    Roteador.navegar('solicitarCartao');
  }

  function abrirNotificacoes() { Roteador.navegar('notificacoes'); }
  function abrirPerfil() { Roteador.navegar('perfil'); }

  /* ── menu lateral (réplica do app atual — à direita) ── */
  function abrirMenu() { document.getElementById('menuFundo').classList.add('ativo'); }
  function fecharMenu() { document.getElementById('menuFundo').classList.remove('ativo'); }
  function fecharMenuFundo(ev) {
    if (ev.target === document.getElementById('menuFundo')) fecharMenu();
  }

  function itemMenu(opcao) {
    fecharMenu();
    if (opcao === 'inicio') return;
    if (opcao === 'escolar') { Roteador.navegar('escolar'); return; }
    if (opcao === 'Compra de Créditos e QRCodes') { Roteador.navegar('recargaTipo'); return; }
    if (opcao === 'Consultar Pedidos') { App.Pedidos.abrir(); return; }
    if (opcao === 'Cancelar Cartão') { App.Cartoes.abrirGestao(); return; }
    if (opcao === 'Saldo' || opcao === 'Últimos Usos') { App.Cartoes.abrirExtrato(); return; }
    Modal.foraEscopo(opcao);
  }

  return {
    solicitarCartao, abrirNotificacoes, abrirPerfil,
    abrirMenu, fecharMenu, fecharMenuFundo, itemMenu
  };
})(App.Roteador, App.Modal, App.Sessao);
