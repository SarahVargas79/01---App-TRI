/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / LOGIN — entrada e saída da sessão.
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Login = (function (Roteador) {

  Roteador.registrarTitulos({ login: 'Login' });

  function entrar() {
    Roteador.irPara('home');
  }

  function toggleSenha() {
    const i = document.getElementById('loginSenha');
    i.type = (i.type === 'password') ? 'text' : 'password';
  }

  /* desloga: fecha o menu, limpa a senha e volta ao login */
  function sair() {
    App.Home.fecharMenu();
    document.getElementById('loginSenha').value = '';
    Roteador.irPara('login');
  }

  return { entrar, toggleSenha, sair };
})(App.Roteador);
