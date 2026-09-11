/* ══════════════════════════════════════════════════════════════════════
   APP — bootstrap e FACHADA global.
   Os onclick do HTML chamam somente as funções expostas aqui; cada uma
   delega para o controlador responsável. Para adicionar um módulo novo:
   criar js/controladores/<modulo>.js, incluí-lo no index.html e expor as
   ações dele neste bloco.
   ══════════════════════════════════════════════════════════════════════ */
(function (App) {
  const F = {
    /* núcleo */
    navegar: App.Roteador.navegar,
    voltar: App.Roteador.voltar,
    reiniciarPrototipo: App.Roteador.reiniciar,
    viewAtual: App.Roteador.viewAtual,
    fecharModal: App.Modal.fechar,
    modalForaEscopo: App.Modal.foraEscopo,

    /* login */
    entrar: App.Login.entrar,
    toggleSenha: App.Login.toggleSenha,
    sair: App.Login.sair,

    /* home + menu lateral */
    solicitarCartao: App.Home.solicitarCartao,
    abrirNotificacoes: App.Home.abrirNotificacoes,
    abrirPerfil: App.Home.abrirPerfil,
    abrirMenu: App.Home.abrirMenu,
    fecharMenuFundo: App.Home.fecharMenuFundo,
    itemMenu: App.Home.itemMenu,

    /* recarga */
    selecionarRecarga: App.Recarga.selecionar,
    escolherValor: App.Recarga.escolherValor,
    confirmarValorLivre: App.Recarga.confirmarValorLivre,
    pagar: App.Recarga.pagar,
    copiarChave: App.Recarga.copiarChave,
    retornarMenu: App.Recarga.retornarMenu,

    /* qr codes */
    abrirQrCodes: App.QrCodes.abrir,
    mostrarTabQr: App.QrCodes.mostrarTab,
    alternarLock: App.QrCodes.alternarLock,
    escolherQtdQr: App.QrCodes.escolherQtd,
    irPagamentoQr: App.QrCodes.irPagamento,
    pagarQr: App.QrCodes.pagar,

    /* pedidos */
    abrirPedidos: App.Pedidos.abrir,
    mostrarTabPedidos: App.Pedidos.mostrarTab,
    abrirDetalhe: App.Pedidos.abrirDetalhe,
    pagarPedido: App.Pedidos.pagar,

    /* cartões (gestão, extrato, cancelamento, 2ª via) */
    abrirCartoes: App.Cartoes.abrirGestao,
    abrirExtrato: App.Cartoes.abrirExtrato,
    selecionarCartao: App.Cartoes.selecionarCartao,
    cancelarCartao: App.Cartoes.cancelar,
    selecionarMotivo: App.Cartoes.selecionarMotivo,
    finalizarCancelamento: App.Cartoes.finalizarCancelamento,
    solicitar2via: App.Cartoes.solicitar2via,
    retirada2via: App.Cartoes.retirada2via,
    entrega2viaCasa: App.Cartoes.entrega2viaCasa,
    selecionarEndereco2via: App.Cartoes.selecionarEndereco2via,
    salvarEndereco2via: App.Cartoes.salvarEndereco2via,

    /* benefícios (escolar + TRI idoso) */
    perfilIndisponivel: App.Beneficios.perfilIndisponivel,
    tirarFoto: App.Beneficios.tirarFoto,
    anexarDoc: App.Beneficios.anexarDoc,
    removerDoc: App.Beneficios.removerDoc,
    mostrarMembros: App.Beneficios.mostrarMembros,
    abrirAdicionarMembro: App.Beneficios.abrirAdicionarMembro,
    escolherLocal: App.Beneficios.escolherLocal,
    escolherEntregaEmCasa: App.Beneficios.escolherEntregaEmCasa,
    concluirSolicitacao: App.Beneficios.concluirSolicitacao,
    verSituacao: App.Beneficios.verSituacao,
    acompanharSituacao: App.Beneficios.acompanharSituacao,
    iniciarIdoso: App.Beneficios.iniciarIdoso,
    capturarFrente: App.Beneficios.capturarFrente,
    capturarVerso: App.Beneficios.capturarVerso,
    abrirCameraFacial: App.Beneficios.abrirCameraFacial,
    fecharCameraFacial: App.Beneficios.fecharCameraFacial,
    capturarFacial: App.Beneficios.capturarFacial
  };
  Object.assign(window, F);

  /* ── bootstrap ── */

  /* QR Codes ilustrativos das telas de pedido/lista */
  const qrs = [
    ['qrFake', 42, 185],
    ['qrMiniDisp', 77, 76],
    ['qrMiniUtil', 91, 76],
    ['qrFakeVia', 55, 185],
    ['qr-fake-idoso', 55, 185]
  ];
  qrs.forEach(([id, semente, px]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = App.Formato.qrSvg(semente, px);
  });

  /* painel Escopo: mostrar/ocultar anotações */
  document.getElementById('toggle').addEventListener('change', function () {
    document.body.classList.toggle('clean', !this.checked);
  });

  /* controle de demonstração: usuário já possui cartão (afeta o banner) */
  document.getElementById('togglePossuiCartao').addEventListener('change', function () {
    App.Sessao.possuiCartao = this.checked;
  });

  /* estado inicial: chrome correto da tela ativa (login, sem appbar/navbar) */
  App.Roteador.atualizarChrome();
})(window.App);
