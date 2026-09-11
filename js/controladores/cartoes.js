/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / CARTÕES — Meus cartões (contexto gestão/extrato), detalhe,
   fluxo de cancelamento (motivo → atenção → confirmação) e solicitação de
   2ª via (retirada/entrega → aviso → protocolo → pagamento PIX).

   Regras de negócio principais:
   • Extrato passa por "Meus cartões" listando SÓ cartões ativos.
   • Botão amarelo "Cancelar / Solicitar 2ª via": cancela primeiro e vai
     DIRETO à 2ª via (sem perguntar) — cartão cancelado pula o cancelamento.
   • Botão vermelho "Cancelar cartão": só cancela; a 2ª via é oferecida
     como opção ao final.
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Cartoes = (function (Roteador, Modal, Dados) {

  Roteador.registrarTitulos({
    cartoes: 'Meus cartões', cartaoDetalhe: 'Meus cartões',
    cancelarCartao: 'Cancelar cartão', cancelamentoConfirmacao: 'Confirmação',
    viaRetirada: 'Solicitar Cartão', viaEndereco: 'Solicitar Cartão',
    viaCadastroEndereco: 'Cadastro', viaAviso: 'Solicitar Cartão',
    viaSucesso: 'Solicitar Cartão', viaPagamento: 'Pagamento',
    extrato: 'Extrato'
  });

  let cartaoAtual = null;
  let contexto = 'gestao';               // 'gestao' | 'extrato'
  let cancelamentoComSegundaVia = false; // true quando veio do botão amarelo
  let motivoCancelamento = '';

  /* no Extrato, exibir apenas os cartões ativos */
  function aplicarContexto() {
    document.getElementById('cartoesAcompanhamento').hidden = contexto === 'extrato';
    document.getElementById('cartoesOrientacao').textContent = contexto === 'extrato'
      ? 'Selecione um cartão ativo para consultar o extrato.'
      : 'Acompanhe a chegada e gerencie seus cartões.';
    document.getElementById('cartoesListaTitulo').textContent = contexto === 'extrato' ? 'Cartões ativos' : 'Seus cartões';
    document.getElementById('cartoesListaDescricao').textContent = contexto === 'extrato'
      ? 'Escolha o cartão para consultar saldo e movimentações.'
      : 'Consulte os cartões ativos, cancelados ou com pagamento pendente.';
    document.querySelectorAll('#view-cartoes .cancelado-item, #view-cartoes .cartao-item:has(.aguardando)').forEach(el => {
      el.style.display = (contexto === 'extrato') ? 'none' : '';
    });
  }

  function abrirGestao() { contexto = 'gestao'; aplicarContexto(); Roteador.navegar('cartoes'); }
  function abrirExtrato() { contexto = 'extrato'; aplicarContexto(); Roteador.navegar('cartoes'); }

  function selecionarCartao(id) {
    if (contexto === 'extrato') { Roteador.navegar('extrato'); return; }
    abrirCartao(id);
  }

  function abrirCartao(id) {
    const c = Dados.cartoes[id];
    cartaoAtual = id;
    document.getElementById('detCartaoVisual').className = 'cartao-visual ' + c.visual;
    document.getElementById('detCartaoVisual').style.marginTop = '6px';
    document.getElementById('detFoto').style.display = (c.visual === 'escolar') ? 'flex' : 'none';
    document.getElementById('detLegenda').textContent =
      (c.visual === 'escolar') ? 'Passagem Escolar' : 'Transporte Integrado';
    const badge = document.getElementById('detCartaoBadge');
    badge.textContent = (c.status === 'ativo') ? 'ATIVO' : 'CANCELADO';
    badge.className = 'cartao-badge ' + c.status;
    document.getElementById('detCartaoNum').textContent = c.num;
    document.getElementById('detCartaoTipos').textContent = c.tipos;
    /* ações: cartão ativo permite cancelar; cancelado só solicita 2ª via */
    const ativo = c.status === 'ativo';
    document.getElementById('btn2viaLabel').textContent =
      ativo ? 'Cancelar / Solicitar 2ª via de cartão' : 'Solicitar 2ª via do cartão';
    document.getElementById('btnCancelarCartao').style.display = ativo ? 'flex' : 'none';
    Roteador.navegar('cartaoDetalhe');
  }

  /* ── cancelamento (motivo → atenção → confirmação) ── */

  function cancelar() {
    cancelamentoComSegundaVia = false; // botão vermelho: 2ª via é opcional ao final
    Roteador.navegar('cancelarCartao');
  }

  function selecionarMotivo(motivo) {
    motivoCancelamento = motivo;
    Modal.confirmar('Atenção',
      'O cancelamento é um procedimento irreversível e ocorrerá em até 30 minutos nos ônibus de Porto Alegre. Nas estações, o cancelamento ocorre em até 24h.',
      { sim: 'Confirmar', nao: 'Cancelar', aoConfirmar: confirmarCancelamento });
  }

  function confirmarCancelamento() {
    document.getElementById('protocoloCancelamento').textContent = Dados.protocolos.cancelamento;
    Roteador.navegar('cancelamentoConfirmacao');
  }

  function finalizarCancelamento() {
    /* botão amarelo: o usuário já quer a nova via — vai direto, sem perguntar */
    if (cancelamentoComSegundaVia) { iniciar2via(); return; }
    /* botão vermelho: oferece a 2ª via */
    Modal.confirmar('Solicitar 2ª via', 'Você gostaria de solicitar a 2ª via do cartão?', {
      aoConfirmar: iniciar2via,
      aoCancelar: Roteador.reiniciar
    });
  }

  /* ── 2ª via (juntada ao cancelamento) ── */

  function solicitar2via() {
    if (Dados.cartoes[cartaoAtual].status === 'ativo') {
      cancelamentoComSegundaVia = true;
      Roteador.navegar('cancelarCartao');
    } else {
      iniciar2via(); // já cancelado: não há o que cancelar
    }
  }

  function iniciar2via() {
    document.getElementById('viaEnderecoEntrega').classList.add('oculto');
    Roteador.navegar('viaRetirada');
  }

  function retirada2via(endereco) {
    Modal.confirmar('Retirada do cartão',
      'Você optou por retirar o cartão no endereço: ' + endereco +
      '. O novo cartão terá um custo de R$ 11,90. Deseja prosseguir?',
      { aoConfirmar: () => Roteador.navegar('viaAviso') });
  }

  function entrega2viaCasa() {
    Modal.confirmar('Receber em casa',
      'O envio do cartão terá uma cobrança no valor de R$ 11,90 pago exclusivamente por PIX. Você deseja prosseguir?',
      { aoConfirmar: () => Roteador.navegar('viaEndereco') });
  }

  function selecionarEndereco2via(endereco) {
    Modal.confirmar('Endereço selecionado',
      'Você selecionou o endereço: ' + endereco + '.',
      { sim: 'Confirmar', nao: 'Cancelar', aoConfirmar: () => Roteador.navegar('viaAviso') });
  }

  function salvarEndereco2via() {
    Modal.informar('Cadastro de Endereço', 'Cadastro realizado com sucesso!', {
      rotulo: 'OK',
      aoFechar: () => {
        document.getElementById('viaEnderecoEntrega').classList.remove('oculto');
        Roteador.voltar(); // volta à seleção, agora com o endereço de entrega cadastrado
      }
    });
  }

  return {
    abrirGestao, abrirExtrato, selecionarCartao, abrirCartao,
    cancelar, selecionarMotivo, finalizarCancelamento,
    solicitar2via, iniciar2via, retirada2via, entrega2viaCasa,
    selecionarEndereco2via, salvarEndereco2via
  };
})(App.Roteador, App.Modal, App.Dados);
