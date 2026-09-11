# Roadmap - APP TRI

## Melhorias planejadas

| Prioridade | Item | Origem | Status | Observacoes |
|---|---|---|---|---|
| Alta | Implementar redesign da Home, Extrato e Beneficios | Definicao de escopo jun/2026 | A enviar ao dev | Somente Home, Extrato e Beneficio Escolar recebem redesign nesta fase. Demais acessos da Home devem apontar para os fluxos ja existentes. Guia: GUIA_DESENVOLVIMENTO_REDESIGN_HOME_EXTRATO_BENEFICIOS.md |
| Media | Revisar e-mail automatico "Cartao TRI - Cancelamento de Pedido" | Caso reportado pela Comunicacao (usuaria entendeu que o cartao foi cancelado) | Pendente encaminhamento | Especificar o tipo de pedido no assunto e no corpo do e-mail; fora do escopo da tela |
| Media | ~~Liberar perfil Idoso na selecao de perfil~~ | Definicao jun/2026 | Resolvido (18/06/2026) | TRI Idoso liberado na solicitacao de beneficio: documento (RG/CNH) + biometria facial com liveness + protocolo |
| Media | Liberar perfil Passe Antecipado na selecao de perfil | Definicao jun/2026 | Fase futura | Permanece oculto no prototipo (markup com selo "em breve") |
| Media | Alinhar prototipo Flutter ao HTML | Backlog jun/2026 | Pendente | Login azul, fluxo 2a via (cancelamento antes, sem modal no botao amarelo), fluxo TRI Idoso (documento + biometria liveness) e campos da Ghabryella no Escolar/Beneficios (grupo familiar, novos perfis, novos uploads) ainda so existem no HTML |
| Media | Definir fluxos dos perfis Isencao, Acompanhante e Vou a Escola | Mapeamento Ghabryella jul/2026 | Pendente | Cards visiveis na selecao de perfil abrindo aviso "sera liberado em breve"; telas dos fluxos ainda nao construidas |
| Baixa | ~~Confirmar texto final do card Beneficios~~ | Referencia aprovada estava truncada | Resolvido (11/06/2026) | Texto definido: "Solicite o beneficio escolar." — somente escolar nesta fase |

## Debitos e riscos conhecidos

- Nomenclatura "pedidos" e usada tanto para recarga quanto para solicitacao de cartao em comunicacoes automaticas (e-mail), o que confunde usuarios - revisar a regua de comunicacao alem da tela.
