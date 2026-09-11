/* Cenários demonstrativos. Substituir por pedidos e eventos da integração logística. */
App.EntregaCartoes = (() => {
  const pedidos = {
    entrega: { titulo: 'Seu cartão está a caminho', status: 'Em trânsito', tipo: 'Entrega no endereço',
      produto: 'TRI • Passagem antecipada', pedido: 'TRI-2026-0142',
      local: 'Endereço de entrega', endereco: 'Av. Protásio Alves, 3886', complemento: 'Petrópolis · Porto Alegre / RS',
      previsao: 'Previsão de entrega', data: 'Até 14 de setembro',
      detalhe: 'O cartão está com a transportadora. Acompanhe as próximas movimentações por aqui.',
      etapas: ['Solicitado', 'Preparado', 'Em trânsito', 'Entregue'], atual: 2,
      eventos: [['10 set · 09:40', 'Cartão em trânsito', 'Saiu do centro de distribuição de Porto Alegre.'], ['09 set · 16:20', 'Entregue à transportadora', 'O cartão foi coletado para envio.'], ['08 set · 11:00', 'Cartão preparado', 'Emissão concluída e pedido separado.'], ['07 set · 14:32', 'Solicitação confirmada', 'Pedido recebido.']] },
    retirada: { titulo: 'Seu cartão já pode ser retirado', status: 'Disponível para retirada', tipo: 'Retirada na loja',
      produto: 'TRI • Passagem escolar', pedido: 'TRI-2026-0143',
      local: 'Loja de retirada · Posto Triângulo', endereco: 'Av. Assis Brasil, 4320', complemento: 'Sarandi · Porto Alegre / RS',
      previsao: 'Disponível desde', data: '10 de setembro',
      detalhe: 'Seu cartão está aguardando você no local escolhido.',
      etapas: ['Solicitado', 'Preparado', 'Na loja', 'Retirado'], atual: 2,
      eventos: [['10 set · 10:15', 'Disponível para retirada', 'Cartão recebido no Posto Triângulo.'], ['09 set · 15:30', 'Enviado à loja', 'O cartão saiu para o local escolhido.'], ['08 set · 11:00', 'Cartão preparado', 'Emissão concluída.'], ['07 set · 14:32', 'Solicitação confirmada', 'Pedido recebido.']] }
  };
  const endereco = p => `<div class="entrega-endereco"><span class="entrega-pin" aria-hidden="true">⌖</span><div><span class="entrega-label">${p.local}</span><address><strong>${p.endereco}</strong><br>${p.complemento}</address></div></div>`;
  const etapas = p => `<ol class="entrega-etapas" aria-label="Etapas do pedido">${p.etapas.map((e,i) => `<li class="${i <= p.atual ? 'concluida' : ''}" ${i === p.atual ? 'aria-current="step"' : ''}><span aria-hidden="true">${i < p.atual ? '✓' : i+1}</span>${e}</li>`).join('')}</ol>`;
  const cartao = tipo => `<div class="entrega-mini ${tipo}" aria-hidden="true"><b>tri</b><span>transporte integrado</span><small>${tipo === 'retirada' ? 'ESCOLAR' : 'PASSAGEM ANTECIPADA'}</small></div>`;
  function renderizar() {
    document.getElementById('cartoesAcompanhamento').innerHTML = `<details class="carteira-expansivel" open><summary class="carteira-grupo-titulo"><span class="carteira-grupo-rotulo">ENTREGA E RETIRADA</span><h3>Em acompanhamento</h3><p>Acompanhe a chegada ou veja onde retirar seu novo cartão.</p><span class="entrega-demo">Simulação</span><span class="carteira-alternar"><span class="carteira-recolher">Recolher lista</span><span class="carteira-expandir">Expandir lista</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></span></summary>${Object.entries(pedidos).map(([id,p]) => `<article class="entrega-card"><div class="entrega-card-top">${cartao(id)}<div><span class="entrega-label">${p.tipo}</span><strong>${p.produto}</strong><span class="entrega-status">${p.status}</span></div></div><h3>${p.titulo}</h3><p class="entrega-previsao">${p.previsao} <strong>${p.data}</strong></p><button type="button" class="entrega-botao" onclick="App.EntregaCartoes.abrir('${id}')">${id === 'entrega' ? 'Acompanhar rastreio' : 'Ver detalhes de retirada'} <span aria-hidden="true">→</span></button></article>`).join('')}</details>`;
  }
  function abrir(id) {
    const p = pedidos[id];
    if (!p) return;
    document.getElementById('view-rastreioCartao').innerHTML = `<div class="entrega-section-head"><span class="entrega-label">Pedido ${p.pedido}</span><span class="entrega-demo">Simulação</span></div><article class="entrega-card entrega-detalhe"><span class="entrega-status">${p.status}</span><h2>${p.titulo}</h2><p>${p.detalhe}</p><div class="entrega-prazo"><span>${p.previsao}</span><strong>${p.data}</strong></div>${etapas(p)}${endereco(p)}${id === 'retirada' ? `<p class="entrega-aviso">Antes de ir, confirme o horário de atendimento e os documentos necessários com a loja.</p><a class="entrega-botao" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.endereco + ', ' + p.complemento)}" target="_blank" rel="noopener noreferrer">Ver localização no mapa <span aria-hidden="true">↗</span></a>` : '<p class="entrega-aviso">A previsão pode mudar conforme o transporte. As movimentações aparecem quando informadas pela transportadora.</p>'}</article><section class="entrega-historico"><h3>${id === 'entrega' ? 'Histórico de rastreio' : 'Andamento da solicitação'}</h3><p class="entrega-label">Última movimentação: ${p.eventos[0][0]}</p><ol>${p.eventos.map(([data,titulo,desc],i) => `<li ${i === 0 ? 'aria-current="step"' : ''}><time>${data}</time><strong>${titulo}</strong><p>${desc}</p></li>`).join('')}</ol></section><p class="entrega-simulacao">Cenário demonstrativo: endereços, datas e movimentações de exemplo, sem consulta em tempo real.</p>`;
    App.Roteador.registrarTitulos({rastreioCartao: id === 'entrega' ? 'Acompanhar rastreio' : 'Ver detalhes de retirada'});
    App.Roteador.navegar('rastreioCartao');
    document.getElementById('view-rastreioCartao').focus({preventScroll:true});
  }
  App.Roteador.registrarTitulos({rastreioCartao: 'Acompanhar cartão'});
  document.querySelectorAll('#view-cartoes .cartao-item').forEach(el => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
  });
  renderizar();
  return { abrir };
})();
