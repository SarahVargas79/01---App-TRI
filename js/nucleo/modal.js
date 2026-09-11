/* ══════════════════════════════════════════════════════════════════════
   NÚCLEO / MODAL — serviço único de diálogos.
   Os controladores dependem desta abstração (informar/confirmar), nunca
   dos elementos do DOM do modal diretamente (inversão de dependência).
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Modal = (function () {
  const fundo = () => document.getElementById('modalFundo');
  const titulo = () => document.getElementById('modalTitulo');
  const texto = () => document.getElementById('modalTexto');
  const botao = () => document.getElementById('modalBotao');
  const botaoSec = () => document.getElementById('modalBotaoSec');

  function abrir(t, x) {
    titulo().textContent = t;
    texto().textContent = x;
    fundo().classList.add('ativo');
  }

  /* fecha e restaura o estado padrão dos botões */
  function fechar() {
    fundo().classList.remove('ativo');
    botao().textContent = 'Entendi';
    botao().onclick = fechar;
    botaoSec().classList.add('oculto');
  }

  /* modal informativo com 1 botão. opcoes: { rotulo, aoFechar } */
  function informar(t, x, opcoes) {
    const o = opcoes || {};
    abrir(t, x);
    botao().textContent = o.rotulo || 'Entendi';
    botao().onclick = () => { fechar(); if (o.aoFechar) o.aoFechar(); };
  }

  /* modal de confirmação com 2 botões.
     opcoes: { sim, nao, aoConfirmar, aoCancelar } */
  function confirmar(t, x, opcoes) {
    const o = opcoes || {};
    abrir(t, x);
    botao().textContent = o.sim || 'Sim';
    botaoSec().classList.remove('oculto');
    botaoSec().textContent = o.nao || 'Não';
    botaoSec().onclick = () => { fechar(); if (o.aoCancelar) o.aoCancelar(); };
    botao().onclick = () => { fechar(); if (o.aoConfirmar) o.aoConfirmar(); };
  }

  /* aviso padrão para telas fora do escopo do protótipo */
  function foraEscopo(nome) {
    informar(nome, 'Tela fora do escopo deste protótipo. O foco desta versão é a nova Home (v1.1) e o fluxo do benefício escolar.');
  }

  return { informar, confirmar, foraEscopo, fechar };
})();
