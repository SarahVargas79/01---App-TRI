/* ══════════════════════════════════════════════════════════════════════
   NÚCLEO / ROTEADOR — navegação entre views e chrome do app.
   Responsabilidade única: pilha de navegação, troca de view, appbars/navbar.
   Aberto para extensão: controladores REGISTRAM seus títulos, resets e
   hooks de exibição — o roteador não conhece nenhum módulo.
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Roteador = (function () {
  const pilha = ['login'];
  const titulos = {};      // view → título da appbar (registrado pelos controladores)
  const resets = [];       // callbacks executados no reinício do protótipo
  const aoMostrarHooks = [];

  function registrarTitulos(mapa) { Object.assign(titulos, mapa); }
  function registrarReset(fn) { resets.push(fn); }
  function registrarAoMostrar(fn) { aoMostrarHooks.push(fn); }

  function viewAtual() { return pilha[pilha.length - 1]; }

  function atualizarChrome() {
  const v = viewAtual();
  const ehHome = v === 'home';
  const ehLogin = v === 'login';
  document.getElementById('appbarHome').style.display = ehHome ? 'flex' : 'none';
  document.getElementById('appbarFluxo').style.display = (!ehHome && !ehLogin) ? 'flex' : 'none';
  document.getElementById('navbar').style.display = ehHome ? 'flex' : 'none';
  if (!ehHome && !ehLogin) {
    document.getElementById('tituloFluxo').textContent = titulos[v] || 'APP TRI';
  }
}

  function mostrarView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + id).classList.add('active');
    document.querySelector('.content').scrollTo({ top: 0 });
    aoMostrarHooks.forEach(fn => fn(id));
    atualizarChrome();
  }

  function navegar(id) {
    if (viewAtual() !== id) pilha.push(id);
    mostrarView(id);
  }

  function voltar() {
    if (pilha.length <= 1) return;
    pilha.pop();
    mostrarView(viewAtual());
  }

  /* zera a pilha e vai direto para uma view (login/home) */
  function irPara(id) {
    pilha.splice(0, pilha.length, id);
    mostrarView(id);
  }

  /* reinicia o protótipo: executa os resets registrados e volta à Home */
  function reiniciar() {
    resets.forEach(fn => fn());
    irPara('home');
  }

  return {
    registrarTitulos, registrarReset, registrarAoMostrar,
    viewAtual, atualizarChrome, navegar, voltar, irPara, reiniciar
  };
})();


