/* ══════════════════════════════════════════════════════════════════════
   CONTROLADOR / BENEFÍCIOS — seleção de perfil e os dois fluxos:
   • Escolar (informações EPTC → foto → pré-cadastro → entrega → revisão
     → FIB → situação com estados de demonstração)
   • TRI Idoso (documento RG/CNH → biometria facial com liveness →
     validação → protocolo)
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Beneficios = (function (Roteador, Modal) {

  let streamFacial = null;
  let entregaEmCasaIdoso = false;

  Roteador.registrarTitulos({
    perfis: 'Solicitar Benefício',
    escolar: 'Escolar', informacoes: 'Escolar', foto: 'Escolar', cadastro: 'Escolar',
    membro: 'Escolar', grupoFamiliar: 'Escolar',
    entrega: 'Escolar', revisao: 'Escolar', sucesso: 'Escolar', situacao: 'Escolar',

      /* TRI Idoso */
    idoso: 'Idoso',
    idosoEnviar: 'Idoso',
    idosoFrente: 'Idoso',
    idosoVerso: 'Idoso',
    idosoFacial: 'Idoso',
    idosoSucesso: 'Idoso',
    situacaoIdoso: 'Idoso',
    idosoBiometria: 'Idoso',
    acompanharIdoso: 'Idoso',
    idosoFalha: 'Idoso',
    idosoEntrega: 'Idoso',
    idosoSucessoFinal: 'Idoso',
    idosoAlterarEntrega: 'Idoso',
    idosoPagamento: 'Idoso',
    cartaoPcd: 'Meus cartões',
  });

  /* ── seleção de perfil ── */
  function perfilIndisponivel(nome) {
    Modal.informar('Perfil indisponível', 'O perfil ' + nome + ' será liberado em breve.');
  }

  /* ══ ESCOLAR ══════════════════════════════════════════════════════════ */
  let entregaEmCasa = false;
  let estadoSituacao = 'analise';

  /* etapa 1: foto */
  function tirarFoto() {
    document.getElementById('fotoCirculo').classList.add('capturada');
    document.getElementById('fotoPlaceholder').textContent = '🙂';
    document.getElementById('btnContinuarFoto').disabled = false;
  }

  /* etapa 2: documentos */
  function anexarDoc(id) {
    const box = document.getElementById(id);
    box.classList.add('anexado');
    box.querySelector('span').textContent = '✓ Documento anexado';
  }

  function removerDoc(ev, id) {
    ev.stopPropagation();
    const box = document.getElementById(id);
    box.classList.remove('anexado');
    box.querySelector('span').textContent = 'Selecionar';
  }

  /* etapa 2: grupo familiar — "Mora sozinho(a)? Não" habilita a inclusão de membros */
  function mostrarMembros(exibir) {
    document.getElementById('btnMembro').disabled = !exibir;
  }

  function abrirAdicionarMembro() {
    Roteador.navegar('membro');
  }

  /* etapa 3: local de entrega */
  function escolherLocal(nome, endereco) {
    entregaEmCasa = false;
    document.getElementById('rotuloLocalSelecionado').textContent = 'Local de retirada selecionado';
    document.getElementById('localNome').textContent = nome;
    document.getElementById('localEndereco').textContent = endereco;
    Roteador.navegar('revisao');
  }

  function escolherEntregaEmCasa() {
    Modal.confirmar('Atenção',
      'O envio do cartão terá uma cobrança no valor de R$ 11,90. Deseja prosseguir?', {
        aoConfirmar: () => {
          entregaEmCasa = true;
          document.getElementById('rotuloLocalSelecionado').textContent = 'Entrega selecionada';
          document.getElementById('localNome').textContent = 'RECEBER EM CASA';
          document.getElementById('localEndereco').textContent = 'RUA PAPA IV, 161 - SARANDI, PORTO ALEGRE';
          Roteador.navegar('revisao');
        }
      });
  }

  /* etapa 5 → acompanhamento */
  function concluirSolicitacao() {
    if (entregaEmCasa) {
      Modal.informar('IMPORTANTE!',
          'Após a aprovação do benefício escolar, você deverá acessar a tela de acompanhamento do benefício para realizar o pagamento da taxa de entrega.',
          { aoFechar: abrirSituacao });
      return;
    }
    abrirSituacao();
  }

  /* situação do benefício (chips de demonstração alternam os estados) */
  function verSituacao(estado) {
    estadoSituacao = estado;
    document.getElementById('sitAnalise').classList.toggle('oculto', estado !== 'analise');
    document.getElementById('sitAprovadoRetirada').classList.toggle('oculto', estado !== 'aprovadoRetirada');
    document.getElementById('sitAprovadoEntrega').classList.toggle('oculto', estado !== 'aprovadoEntrega');
    document.getElementById('chipAnalise').classList.toggle('ativo', estado === 'analise');
    document.getElementById('chipRetirada').classList.toggle('ativo', estado === 'aprovadoRetirada');
    document.getElementById('chipEntrega').classList.toggle('ativo', estado === 'aprovadoEntrega');
  }

  function abrirSituacao() {
    verSituacao('analise');
    Roteador.navegar('situacao');
  }

  /* "Acompanhar Solicitação" (entrada do Escolar): mantém o estado atual */
  function acompanharSituacao() {
    verSituacao(estadoSituacao);
    Roteador.navegar('situacao');
  }

  function resetEscolar() {
    entregaEmCasa = false;
    document.getElementById('fotoCirculo').classList.remove('capturada');
    document.getElementById('fotoPlaceholder').textContent = '👤';
    document.getElementById('btnContinuarFoto').disabled = true;
    ['doc1', 'doc2', 'doc3', 'doc4', 'doc5', 'rendaMembro'].forEach(id => {
      const box = document.getElementById(id);
      box.classList.remove('anexado');
      box.querySelector('span').textContent = 'Selecionar';
    });
    document.querySelectorAll('input[name="moraSozinho"]').forEach(r => { r.checked = false; });
    document.getElementById('btnMembro').disabled = true;
    verSituacao('analise');
  }

  /* ══ TRI IDOSO (documento + biometria com liveness) ═══════════════════ */
  /* ══ TRI IDOSO (novo fluxo - enviar documento → frente → verso → sucesso) ══ */

function iniciarIdoso() {
  resetIdoso();
  Roteador.navegar('idoso');  // ← mudar para idosoEnviar
}

  function capturarVerso() {
    const badge = document.getElementById('badgeVerso');
    const btnCapturar = document.getElementById('btnCapturarVerso');
    const btnContinuar = document.getElementById('btnContinuarSucesso');
    const btnTirarNovamente = document.getElementById('btnTirarNovamenteVerso');

    setTimeout(() => {
      if (badge) {
        badge.classList.add('visivel');
      }
      if (btnCapturar) {
        btnCapturar.style.display = 'none';
        const label = btnCapturar.parentElement?.querySelector('span');
        if (label) label.style.display = 'none';
      }
      if (btnContinuar) {
        btnContinuar.classList.remove('oculto');
      }
      if (btnTirarNovamente) {
        btnTirarNovamente.classList.remove('oculto');
      }
    }, 200);
  }

  async function abrirCameraFacial() {
    const overlay = document.getElementById('cameraFacialOverlay');
    const video = document.getElementById('cameraFacialVideo');
    const erro = document.getElementById('cameraFacialErro');
    const disparo = document.getElementById('cameraFacialDisparo');

    overlay.classList.add('aberta');
    overlay.setAttribute('aria-hidden', 'false');
    erro.textContent = '';
    erro.classList.remove('visivel');
    disparo.disabled = true;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não disponível neste navegador.');
      }
      streamFacial = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false
      });
      video.srcObject = streamFacial;
      await video.play();
      disparo.disabled = false;
    } catch (erroCamera) {
      erro.textContent = erroCamera.name === 'NotAllowedError'
        ? 'Permissão da câmera negada. Autorize o acesso nas configurações do navegador.'
        : 'Não foi possível abrir a câmera neste dispositivo.';
      erro.classList.add('visivel');
    }
  }

  function fecharCameraFacial() {
    const overlay = document.getElementById('cameraFacialOverlay');
    const video = document.getElementById('cameraFacialVideo');
    if (streamFacial) {
      streamFacial.getTracks().forEach(track => track.stop());
      streamFacial = null;
    }
    if (video) video.srcObject = null;
    if (overlay) {
      overlay.classList.remove('aberta');
      overlay.setAttribute('aria-hidden', 'true');
    }
  }

  function capturarFacial() {
    const capturar = document.getElementById('novoBtnCapturarFacial');
    const feedback = document.getElementById('novoFacialFeedback');
    const continuar = document.getElementById('novoBtnContinuarFacial');

    // SE NÃO TIVER CÂMERA, USA UMA IMAGEM DE EXEMPLO
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // USA IMAGEM DE EXEMPLO (SUBSTITUA PELO CAMINHO DA SUA IMAGEM)
      const fotoExemplo = '../assets/images/foto-exemplo.png'; // ou uma URL de placeholder
      capturar.style.backgroundImage = `url(${fotoExemplo})`;
      capturar.style.backgroundSize = 'cover';
      capturar.style.backgroundPosition = 'center';

      // ESCONDE O AVATAR
      const avatar = capturar.querySelector('.avatar-icone');
      if (avatar) avatar.style.display = 'none';

      capturar.classList.add('capturada', 'com-foto');
      if (feedback) feedback.classList.add('visivel');
      if (continuar) continuar.disabled = false;
      fecharCameraFacial();
      return;
    }

    // SE TIVER CÂMERA, USA A CÂMERA
    const video = document.getElementById('cameraFacialVideo');
    const canvas = document.getElementById('cameraFacialCanvas');

    if (!video || !video.videoWidth || !streamFacial) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    const fotoURL = canvas.toDataURL('image/jpeg', 0.9);
    capturar.style.backgroundImage = `url(${fotoURL})`;
    capturar.style.backgroundSize = 'cover';
    capturar.style.backgroundPosition = 'center';

    const avatar = capturar.querySelector('.avatar-icone');
    if (avatar) avatar.style.display = 'none';

    capturar.classList.add('capturada', 'com-foto');
    if (feedback) feedback.classList.add('visivel');
    if (continuar) continuar.disabled = false;
    fecharCameraFacial();
  }

  function resetIdoso() {
    // Reset tela FRENTE
    const camFrente = document.getElementById('cameraFrente');
    if (camFrente) camFrente.classList.remove('capturada');

    const btnFrente = document.getElementById('btnCapturarFrente');
    if (btnFrente) {
      btnFrente.style.display = 'flex';
      const label = btnFrente.parentElement?.querySelector('span');
      if (label) label.style.display = '';
    }

    // Reset botão CONTINUAR frente
    const btnContinuarVerso = document.getElementById('btnContinuarVerso');
    if (btnContinuarVerso) {
      btnContinuarVerso.classList.add('oculto');
    }

    // Reset BADGE FRENTE
    const badgeFrente = document.getElementById('badgeFrente');
    if (badgeFrente) badgeFrente.classList.remove('visivel');

    // Reset tela VERSO
    const camVerso = document.getElementById('cameraVerso');
    if (camVerso) camVerso.classList.remove('capturada');

    const btnCapturarVerso = document.getElementById('btnCapturarVerso');
    if (btnCapturarVerso) {
      btnCapturarVerso.style.display = 'flex';
      const label = btnCapturarVerso.parentElement?.querySelector('span');
      if (label) label.style.display = '';
    }

    const btnSucesso = document.getElementById('btnContinuarSucesso');
    if (btnSucesso) btnSucesso.classList.add('oculto');

    // Reset BADGE VERSO
    const badgeVerso = document.getElementById('badgeVerso');
    if (badgeVerso) badgeVerso.classList.remove('visivel');

    // Reset tela FACIAL - CORRIGIDO!
    const btnCapturarFacial = document.getElementById('novoBtnCapturarFacial'); // ← "const" corrigido
    if (btnCapturarFacial) {
      btnCapturarFacial.classList.remove('capturada', 'com-foto');
      btnCapturarFacial.style.backgroundImage = '';
      const avatar = btnCapturarFacial.querySelector('.avatar-icone');
      if (avatar) avatar.style.display = '';
    }

    const feedbackFacial = document.getElementById('novoFacialFeedback');
    if (feedbackFacial) feedbackFacial.classList.remove('visivel');

    const btnContinuarFacial = document.getElementById('novoBtnContinuarFacial');
    if (btnContinuarFacial) btnContinuarFacial.disabled = true;

    fecharCameraFacial();
  }

  function capturarFrente() {
    const badge = document.getElementById('badgeFrente');
    const btnCapturar = document.getElementById('btnCapturarFrente');
    const btnContinuar = document.getElementById('btnContinuarVerso');
    const btnTirarNovamente = document.getElementById('btnTirarNovamenteFrente');

    setTimeout(() => {
      if (badge) {
        badge.classList.add('visivel');
      }
      if (btnCapturar) {
        btnCapturar.style.display = 'none';
        const label = btnCapturar.parentElement?.querySelector('span');
        if (label) label.style.display = 'none';
      }
      if (btnContinuar) {
        btnContinuar.classList.remove('oculto');
      }
      if (btnTirarNovamente) {
        btnTirarNovamente.classList.remove('oculto');
      }
    }, 200);
  }

/* registra o reset dos dois fluxos no reinício do protótipo */
Roteador.registrarReset(function () {
  resetEscolar();
  resetIdoso();
});

  /* ══ TRI IDOSO - Situação do benefício ═══════════════════════════════════ */
  let estadoSituacaoIdoso = 'analise';

  function verSituacaoIdoso(estado) {
    estadoSituacaoIdoso = estado;
    document.getElementById('sitIdosoAnalise').classList.toggle('oculto', estado !== 'analise');
    document.getElementById('sitIdosoAprovadoRetirada').classList.toggle('oculto', estado !== 'aprovadoRetirada');
    document.getElementById('sitIdosoAprovadoEntrega').classList.toggle('oculto', estado !== 'aprovadoEntrega');
    document.getElementById('chipIdosoAnalise').classList.toggle('ativo', estado === 'analise');
    document.getElementById('chipIdosoRetirada').classList.toggle('ativo', estado === 'aprovadoRetirada');
    document.getElementById('chipIdosoEntrega').classList.toggle('ativo', estado === 'aprovadoEntrega');
  }

  function acompanharSituacaoIdoso() {
    navegar('acompanharIdoso');
  }

  // ═══════════════════════════════════════════════════════════════════════
//  BIOMETRIA FACIAL - PASSOS
// ═══════════════════════════════════════════════════════════════════════

  let biometriaInterval = null;
  let passoAtual = 0;
  let biometriaEmAndamento = false;

  const passosBiometria = [
    { id: 1, texto: 'Centralize o rosto na moldura' },
    { id: 2, texto: 'Vire o rosto para a esquerda' },
    { id: 3, texto: 'Vire o rosto para a direita' },
    { id: 4, texto: 'Vire o rosto para cima' },
    { id: 5, texto: 'Vire o rosto para baixo' }
  ];

  function iniciarBiometria() {
      Roteador.navegar('idosoBiometria');
  }

    function capturarBiometria() {
        const btnCapturar = document.getElementById('btnCapturarBiometria');
        const btnContinuar = document.getElementById('btnContinuarBiometria');
        const label = btnCapturar ? btnCapturar.parentElement.querySelector('span') : null;

        setTimeout(() => {
            if (btnCapturar) {
                btnCapturar.style.display = 'none';
                if (label) label.style.display = 'none';
            }
            if (btnContinuar) {
                btnContinuar.classList.remove('oculto');
            }
        }, 200);
    }

  function executarProximoPasso() {
    if (passoAtual >= passosBiometria.length) {
      const status = document.getElementById('statusBiometria');
      if (status) {
        status.textContent = '';
        status.style.color = '#4CA500';
      }

      const instrucao = document.getElementById('instrucaoBiometria');
      if (instrucao) {
        instrucao.textContent = 'Concluído!';
        instrucao.style.color = '#FFFFFF';
        instrucao.style.background = '#4CA500';
        instrucao.style.border = '2px solid #4CA500';
      }

      biometriaEmAndamento = false;

      setTimeout(() => {
        Roteador.navegar('idosoFalha');
      }, 1500);

      return; // <-- ESSE RETURN É IMPORTANTE
    }

    const passo = passosBiometria[passoAtual];
    const instrucao = document.getElementById('instrucaoBiometria');
    const status = document.getElementById('statusBiometria');
    const bolinha = document.getElementById(`passo${passo.id}`);
    const texto = document.getElementById(`texto${passo.id}`);

    if (instrucao) {
      instrucao.textContent = passo.texto;
      instrucao.style.color = '#FFFFFF';
      instrucao.style.background = '#707880';
      instrucao.style.border = '2px solid #707880';
    }

    if (status) {
      status.textContent = `Passo ${passoAtual + 1} de ${passosBiometria.length}`;
      status.style.color = 'rgba(255,255,255,0.6)';
    }

    if (bolinha) bolinha.style.background = '#F5A623';
    if (texto) texto.style.color = '#F5A623';

    setTimeout(() => {
      if (instrucao) {
        instrucao.style.border = '2px solid #4CA500';
        void instrucao.offsetHeight;
      }

      if (bolinha) bolinha.style.background = '#4CA500';
      if (texto) texto.style.color = '#4CA500';

      if (status) {
        status.textContent = `Passo ${passoAtual + 1} de ${passosBiometria.length}`;
        status.style.color = '#4CA500';
      }

      setTimeout(() => {
        passoAtual++;
        executarProximoPasso();
      }, 1000);

    }, 2000);
  }

  function resetarBiometria() {
    if (biometriaInterval) {
      clearTimeout(biometriaInterval);
      biometriaInterval = null;
    }

    biometriaEmAndamento = false;
    passoAtual = 0;

    for (let i = 1; i <= 5; i++) {
      const bolinha = document.getElementById(`passo${i}`);
      const texto = document.getElementById(`texto${i}`);
      if (bolinha) bolinha.style.background = '#707880';
      if (texto) texto.style.color = '#707880';
    }

    const instrucao = document.getElementById('instrucaoBiometria');
    if (instrucao) {
      instrucao.textContent = 'Centralize o rosto na moldura';
      instrucao.style.color = '#707880';
    }

    const status = document.getElementById('statusBiometria');
    if (status) {
      status.textContent = 'Aguardando início...';
      status.style.color = '#707880';
    }
  }

  function carregarBiometria() {
    resetarBiometria();
  }

  function escolherLocalIdoso(nome, endereco) {
    Modal.confirmar(
        'Atenção',
        'Você selecionou o ' + nome + ' para retirada do seu cartão TRI Idoso.\n\n\n' +
        'Confirma a retirada neste local?',
        {
          aoConfirmar: () => {
            entregaEmCasaIdoso = false;
            Roteador.navegar('idosoSucessoFinal');
          }
        }
    );
  }

  function escolherEntregaCasaIdoso() {
    Modal.confirmar('Receber em casa',
        'O envio do cartão terá uma cobrança no valor de R$ 11,90. Deseja prosseguir?', {
          aoConfirmar: () => {
            entregaEmCasaIdoso = true;
            Roteador.navegar('idosoSucessoFinal');
          }
        });
  }

  function tirarNovamenteFrente() {
    // Reseta a tela frente
    const badge = document.getElementById('badgeFrente');
    const btnCapturar = document.getElementById('btnCapturarFrente');
    const btnContinuar = document.getElementById('btnContinuarVerso');
    const btnTirarNovamente = document.getElementById('btnTirarNovamenteFrente');
    const label = btnCapturar?.parentElement?.querySelector('span');

    // Mostra o botão de capturar novamente
    if (btnCapturar) {
      btnCapturar.style.display = 'flex';
      if (label) label.style.display = '';
    }

    // Esconde o badge
    if (badge) badge.classList.remove('visivel');

    // Esconde os botões
    if (btnContinuar) btnContinuar.classList.add('oculto');
    if (btnTirarNovamente) btnTirarNovamente.classList.add('oculto');
  }

  function tirarNovamenteVerso() {
    // Reseta a tela verso
    const badge = document.getElementById('badgeVerso');
    const btnCapturar = document.getElementById('btnCapturarVerso');
    const btnContinuar = document.getElementById('btnContinuarSucesso');
    const btnTirarNovamente = document.getElementById('btnTirarNovamenteVerso');
    const label = btnCapturar?.parentElement?.querySelector('span');

    // Mostra o botão de capturar novamente
    if (btnCapturar) {
      btnCapturar.style.display = 'flex';
      if (label) label.style.display = '';
    }

    // Esconde o badge
    if (badge) badge.classList.remove('visivel');

    // Esconde os botões
    if (btnContinuar) btnContinuar.classList.add('oculto');
    if (btnTirarNovamente) btnTirarNovamente.classList.add('oculto');
  }

  function capturarBiometria() {
    const btnCapturar = document.getElementById('btnCapturarBiometria');
    const btnContinuar = document.getElementById('btnContinuarBiometria');
    const btnTirarNovamente = document.getElementById('btnTirarNovamenteBiometria');
    const label = btnCapturar ? btnCapturar.parentElement.querySelector('span') : null;

    setTimeout(() => {
      if (btnCapturar) {
        btnCapturar.style.display = 'none';
        if (label) label.style.display = 'none';
      }
      if (btnContinuar) {
        btnContinuar.classList.remove('oculto');
      }
      if (btnTirarNovamente) {
        btnTirarNovamente.classList.remove('oculto');
      }
    }, 200);
  }

  function tirarNovamenteBiometria() {
    const btnCapturar = document.getElementById('btnCapturarBiometria');
    const btnContinuar = document.getElementById('btnContinuarBiometria');
    const btnTirarNovamente = document.getElementById('btnTirarNovamenteBiometria');
    const label = btnCapturar ? btnCapturar.parentElement.querySelector('span') : null;

    // Mostra o botão de capturar novamente
    if (btnCapturar) {
      btnCapturar.style.display = 'flex';
      if (label) label.style.display = '';
    }

    // Esconde os botões
    if (btnContinuar) btnContinuar.classList.add('oculto');
    if (btnTirarNovamente) btnTirarNovamente.classList.add('oculto');
  }

  function finalizarPedidoIdoso() {
    reiniciarPrototipo();
  }

  function abrirSelecaoEntrega() {
    // Abre a tela de seleção de local de entrega
    Roteador.navegar('idosoEntrega');
  }

  function alterarLocalIdoso(nome, endereco) {
    Modal.confirmar(
        'Atenção',
        'Você selecionou o ' + nome + ' para retirada do seu cartão TRI Idoso.\n\n\n' +
        'Confirma a alteração para este local?',
        {
          aoConfirmar: () => {
            entregaEmCasaIdoso = false;
            // Define o estado como aprovado com retirada
            verSituacaoIdoso('aprovadoRetirada');
            // Navega para a tela de acompanhamento
            Roteador.navegar('acompanharIdoso');
          }
        }
    );
  }

  function alterarEntregaCasaIdoso() {
    Modal.confirmar('Receber em casa',
        'O envio do cartão terá uma cobrança no valor de R$ 11,90. Deseja prosseguir?', {
          aoConfirmar: () => {
            entregaEmCasaIdoso = true;
            // Navega para a tela de seleção de endereço
            Roteador.navegar('viaEndereco');
          }
        });
  }

    return {
        perfilIndisponivel,
        /* escolar */
        tirarFoto, anexarDoc, removerDoc, mostrarMembros, abrirAdicionarMembro,
        escolherLocal, escolherEntregaEmCasa,
        concluirSolicitacao, verSituacao, acompanharSituacao,
        /* idoso */
        iniciarIdoso: iniciarIdoso,
        capturarFrente: capturarFrente,
        capturarVerso: capturarVerso,
        abrirCameraFacial: abrirCameraFacial,
        fecharCameraFacial: fecharCameraFacial,
        capturarFacial: capturarFacial,
        verSituacaoIdoso: verSituacaoIdoso,
        acompanharSituacaoIdoso: acompanharSituacaoIdoso,
        iniciarBiometria: iniciarBiometria,
        resetarBiometria: resetarBiometria,
        carregarBiometria: carregarBiometria,
        capturarBiometria: capturarBiometria,
        escolherLocalIdoso: escolherLocalIdoso,
        escolherEntregaCasaIdoso: escolherEntregaCasaIdoso,
        tirarNovamenteFrente: tirarNovamenteFrente,
        tirarNovamenteVerso: tirarNovamenteVerso,
        capturarBiometria: capturarBiometria,
        tirarNovamenteBiometria: tirarNovamenteBiometria,
        finalizarPedidoIdoso: finalizarPedidoIdoso,
        alterarLocalIdoso: alterarLocalIdoso,
        alterarEntregaCasaIdoso: alterarEntregaCasaIdoso,

    };
})(App.Roteador, App.Modal);

window.acompanharSituacaoIdoso = App.Beneficios.acompanharSituacaoIdoso;
window.verSituacaoIdoso = App.Beneficios.verSituacaoIdoso;
window.iniciarIdoso = App.Beneficios.iniciarIdoso;
window.capturarFrente = App.Beneficios.capturarFrente;
window.capturarVerso = App.Beneficios.capturarVerso;
window.capturarFacial = App.Beneficios.capturarFacial;
window.abrirCameraFacial = App.Beneficios.abrirCameraFacial;
window.fecharCameraFacial = App.Beneficios.fecharCameraFacial;
window.iniciarBiometria = App.Beneficios.iniciarBiometria;
window.resetarBiometria = App.Beneficios.resetarBiometria;
window.carregarBiometria = App.Beneficios.carregarBiometria;
window.capturarBiometria = App.Beneficios.capturarBiometria;
window.escolherLocalIdoso = App.Beneficios.escolherLocalIdoso;
window.escolherEntregaCasaIdoso = App.Beneficios.escolherEntregaCasaIdoso;
window.tirarNovamenteFrente = App.Beneficios.tirarNovamenteFrente;
window.tirarNovamenteVerso = App.Beneficios.tirarNovamenteVerso;
window.tirarNovamenteBiometria = App.Beneficios.tirarNovamenteBiometria;
window.finalizarPedidoIdoso = App.Beneficios.finalizarPedidoIdoso;
window.alterarLocalIdoso = App.Beneficios.alterarLocalIdoso;
window.alterarEntregaCasaIdoso = App.Beneficios.alterarEntregaCasaIdoso;