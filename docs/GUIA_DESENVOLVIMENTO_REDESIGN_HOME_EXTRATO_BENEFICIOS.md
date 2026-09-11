# APP TRI - Redesign da Home do Usuário, Extrato e Benefícios

## 1. Objetivo

Implementar o novo desenho visual e a nova organização de navegação do APP TRI somente para:

- Home do usuário autenticado;
- módulo Extrato, contemplando saldo e últimos usos;
- módulo Benefícios, contemplando o Benefício Escolar.

Os demais módulos e fluxos acessados pela Home devem continuar utilizando as telas, regras de negócio e rotas já existentes no aplicativo. O redesign não deve recriar nem substituir esses fluxos.

## 2. Escopo

### 2.1 Incluído no escopo

- Nova Home apresentada após a autenticação do usuário.
- Cabeçalho, banners, cards de ações rápidas, dica e barra de navegação exibidos na Home.
- Integração dos componentes da Home com as rotas já existentes.
- Novo fluxo visual de Extrato:
  - seleção contextual de cartão ativo;
  - saldo disponível;
  - detalhamento do saldo por tipo de crédito;
  - últimos usos e créditos adicionados.
- Novo fluxo visual de Benefícios:
  - entrada do módulo;
  - solicitação do Benefício Escolar;
  - acompanhamento da solicitação do Benefício Escolar.
- Tratamento dos estados de carregamento, ausência de dados, erro e tentativa novamente nas telas redesenhadas.

### 2.2 Fora do escopo

- Redesign ou alteração funcional dos fluxos existentes de:
  - Login, cadastro e recuperação de senha;
  - Recarga;
  - QR Code;
  - Pedidos;
  - gestão de Cartões;
  - solicitação de Cartão;
  - Tri GPS;
  - Notificações/Avisos;
  - Perfil;
  - menu lateral e seus demais itens;
  - alteração de contato ou endereço;
  - segunda via de cartão;
  - pagamento.
- Alteração das regras de negócio já existentes nos módulos fora do escopo.
- Criação dos benefícios Passe Antecipado e Idoso.
- Uso das telas demonstrativas de Recarga, QR Code, Pedidos, Cartões e Notificações existentes no protótipo HTML como novas implementações.

## 3. Referências

- `design_system/design_system.json`: fonte oficial dos tokens e textos da Home v1.1.
- `design_system/dart/`: tokens Flutter de cores, tipografia, espaçamento e tema.
- `design_system/dart/tela_inicial.dart`: referência visual da Home.
- `design_system/prototipo/tela_inicial_v1_1.html`: referência navegável para Home, Extrato e Benefício Escolar.
- `design_system/spec/especificacao_tela_inicial_TRI_2026_v1.1.docx`: especificação visual vigente.
- `DECISOES.md`: decisões funcionais e de conteúdo aprovadas.

Os dados, números de cartão, valores, datas, FIBs, situações e nomes exibidos no protótipo são ilustrativos e não devem ser fixados na implementação.

## 4. Fluxo Geral

1. O usuário conclui o login pelo fluxo já existente.
2. O aplicativo apresenta a nova Home.
3. A Home direciona:
   - para as novas telas quando o usuário selecionar Extrato ou Benefícios;
   - para as rotas atuais quando selecionar qualquer outro módulo.
4. Ao sair de um fluxo existente e retornar à Home, a nova Home deve continuar sendo apresentada.
5. O botão voltar deve respeitar a pilha de navegação e não criar cópias das telas legadas dentro do novo módulo.

## 5. Requisitos Funcionais

### 5.1 Home do Usuário

**RF-01.** A nova Home deve ser apresentada como tela inicial do usuário autenticado.

**RF-02.** A Home deve utilizar os componentes, assets e tokens definidos no design system v1.1, evitando valores visuais duplicados ou fixados fora dos tokens.

**RF-03.** O cabeçalho deve apresentar:

- logo TRI;
- acesso às notificações pelo ícone de sino;
- saudação conforme o comportamento vigente do aplicativo;
- nome do usuário autenticado;
- avatar ou iniciais do usuário;
- acesso ao Perfil/menu já existente ao tocar no avatar.

**RF-04.** O ícone de notificações deve abrir a rota de Notificações/Avisos já existente, sem redesenhar o módulo.

**RF-05.** A Home deve exibir o banner de cartão com o título exato:

> "Você ainda não tem um cartão TRI?"

O botão deve exibir:

> "Solicite agora seu cartão"

**RF-06.** O banner de cartão deve direcionar para os fluxos existentes:

- usuário sem cartão elegível: abrir a rota atual de solicitação de cartão;
- usuário que já possui cartão: abrir a rota atual de gestão de cartões.

**RF-07.** A Home deve exibir o banner do Tri GPS com os textos:

> "Acompanhe seu ônibus em tempo real."

> "Acesse o Tri GPS"

O botão deve utilizar o comportamento ou rota já existente do Tri GPS.

**RF-08.** A seção "Ações rápidas" deve exibir seis cards, conforme a ordem e os textos abaixo:

| Card | Descrição | Destino |
|---|---|---|
| Recarga | "Adicione créditos ao seu cartão." | Rota existente de Recarga |
| QR Code | "Compre e use QR Codes avulsos." | Rota existente de QR Code |
| Pedidos | "Acompanhe seus pedidos de recarga." | Rota existente de Pedidos |
| Cartões | "Gerencie seus cartões, ativos ou cancelados." | Rota existente de gestão de Cartões |
| Últimos usos e Saldo | "Consulte os extratos do seu cartão." | Novo módulo Extrato |
| Benefícios | "Solicite o benefício escolar." | Novo módulo Benefícios |

**RF-09.** Os cards Recarga, QR Code, Pedidos e Cartões devem apenas chamar as rotas já existentes. Nenhuma tela interna desses módulos deve ser substituída pelo protótipo desta melhoria.

**RF-10.** A Home deve exibir a dica com o texto:

> "Fez uma recarga? Os créditos são carregados no validador pelo sinal 4G do coletivo e podem levar cerca de 30 min para ficar disponíveis após a confirmação do pagamento."

E a observação:

> "*O tempo pode variar conforme a disponibilidade de sinal no veículo."

**RF-11.** A barra inferior exibida na Home deve manter os acessos definidos no layout para Início, QR Code, Avisos/Notificações e Perfil. Somente Início corresponde à nova Home; os demais itens devem abrir suas rotas existentes.

### 5.2 Extrato

**RF-12.** O módulo Extrato deve ser acessível pelo card "Últimos usos e Saldo" da Home e pelos acessos existentes de Saldo e Últimos Usos.

**RF-13.** Antes de exibir o Extrato, o usuário deve selecionar um cartão em uma lista contextual que apresente somente cartões ativos.

**RF-14.** A seleção contextual do Extrato não deve alterar o comportamento da rota existente de gestão de Cartões, que pode continuar exibindo cartões ativos e cancelados conforme suas regras atuais.

**RF-15.** Após a seleção do cartão, a tela do Extrato deve apresentar no topo:

- identificação mascarada ou formatada do cartão;
- saldo disponível;
- detalhamento do saldo por tipo de crédito disponível para o cartão;
- data e hora da última atualização.

**RF-16.** Abaixo do saldo, a tela deve apresentar os últimos usos e créditos retornados pela fonte de dados atual.

**RF-17.** Cada lançamento deve apresentar, quando disponível:

- descrição do uso, linha ou origem do crédito;
- data e hora;
- tipo de tarifa ou crédito;
- valor.

**RF-18.** Os lançamentos devem ser exibidos do mais recente para o mais antigo.

**RF-19.** Débitos devem ser identificados visualmente como saída e créditos adicionados devem ser identificados visualmente como entrada, sem depender apenas da cor para comunicar o tipo.

**RF-20.** Os valores devem utilizar o formato monetário brasileiro e as datas devem utilizar o padrão vigente do aplicativo.

**RF-21.** Quando o usuário não possuir cartão ativo, o módulo deve apresentar estado vazio com orientação clara e acesso à rota existente aplicável para solicitar ou gerenciar cartões.

**RF-22.** Quando não existirem lançamentos para o cartão selecionado, a tela deve manter a exibição do saldo disponível e apresentar estado vazio na seção de últimos usos.

**RF-23.** Quando a consulta de saldo ou lançamentos falhar, a tela deve informar a indisponibilidade e oferecer a ação "Tentar novamente".

### 5.3 Benefícios

**RF-24.** O card Benefícios da Home deve abrir o novo módulo Benefícios.

**RF-25.** Nesta fase, somente o perfil Escolar deve estar visível e disponível. Passe Antecipado e Idoso não devem ser exibidos.

**RF-26.** A entrada do Benefício Escolar deve oferecer as ações:

- "Solicitar Benefício Escolar";
- "Acompanhar Solicitação".

**RF-27.** O fluxo de solicitação deve preservar as regras de negócio e integrações do fluxo Escolar atual, aplicando o novo padrão visual às informações iniciais da EPTC e às cinco etapas:

1. captura de foto;
2. pré-cadastro e documentos;
3. seleção do local de entrega ou modalidade disponível;
4. revisão dos dados;
5. confirmação do envio e apresentação da FIB.

**RF-28.** A etapa de informações deve apresentar os prazos, documentos aceitos, observações e links vigentes fornecidos pelo fluxo atual ou pela fonte oficial configurada.

**RF-29.** A captura de foto deve solicitar as permissões necessárias e impedir o avanço até que uma foto válida tenha sido registrada, conforme as validações existentes.

**RF-30.** O pré-cadastro deve:

- carregar os dados existentes do usuário;
- permitir edição somente nos campos autorizados pelas regras atuais;
- utilizar as rotas já existentes para alteração de contato e endereço, quando aplicável;
- exigir os campos e documentos definidos pelo fluxo Escolar atual;
- permitir anexar, substituir e remover documentos antes do envio.

**RF-31.** A seleção de entrega deve exibir somente locais e modalidades disponíveis retornados pela fonte atual. Prazos e taxas não devem ser fixados com base nos valores ilustrativos do protótipo.

**RF-32.** A revisão deve apresentar os dados informados, documentos e opção de entrega antes do envio definitivo.

**RF-33.** Ao concluir a solicitação com sucesso, a tela deve apresentar a FIB retornada pelo serviço e orientar o acompanhamento pelo caminho:

> "Benefícios" > "Acompanhar Solicitação"

**RF-34.** A ação "Acompanhar Solicitação" deve consultar a situação real do Benefício Escolar e apresentar os dados disponíveis, incluindo FIB, última atualização, validade, percentual de isenção e ações aplicáveis.

**RF-35.** Os controles demonstrativos de troca manual de situação existentes no protótipo não devem existir na aplicação.

**RF-36.** As ações decorrentes da situação, como solicitar segunda via ou realizar pagamento, devem direcionar para as respectivas rotas já existentes.

**RF-37.** Todos os estados retornados pelo serviço atual devem possuir tratamento visual e textual. A melhoria não deve limitar o módulo apenas aos exemplos "Em análise" e "Aprovado" do protótipo.

**RF-38.** Em caso de falha no carregamento, envio ou acompanhamento, o módulo deve preservar os dados preenchidos quando tecnicamente possível, informar o problema e permitir nova tentativa segura.

## 6. Regras de Negócio

**RN-01.** O redesign altera a apresentação e a navegação de entrada, mas não modifica as regras dos fluxos legados.

**RN-02.** Os módulos fora do escopo devem ser acessados pelas rotas existentes do aplicativo.

**RN-03.** O módulo Extrato deve listar somente cartões ativos durante a seleção contextual.

**RN-04.** Cartões cancelados permanecem disponíveis apenas onde as regras atuais de gestão de Cartões permitirem.

**RN-05.** Saldo, composição do saldo e lançamentos devem ser obtidos das fontes reais. Valores ilustrativos do protótipo não podem chegar à aplicação.

**RN-06.** Somente o Benefício Escolar está disponível nesta fase.

**RN-07.** A solicitação e o acompanhamento do Benefício Escolar devem reutilizar serviços, validações e regras já existentes sempre que disponíveis.

**RN-08.** A aplicação não deve permitir envio duplicado de uma solicitação durante processamento ou repetição de requisição.

**RN-09.** Ao voltar entre etapas do Benefício Escolar, os dados já preenchidos devem ser mantidos enquanto a solicitação não for concluída ou descartada.

**RN-10.** Textos, prazos, taxas, locais de atendimento e regras legais do Benefício Escolar devem vir da fonte vigente ou ser validados antes da publicação.

## 7. Dados e Integrações

### 7.1 Reaproveitamento obrigatório

- Autenticação e dados do usuário logado.
- Rotas existentes dos módulos fora do escopo.
- Consulta de cartões do usuário.
- Consulta de saldo e últimos usos.
- Serviços atuais do Benefício Escolar.
- Upload de foto e documentos.
- Consulta de situação da solicitação.
- Rotas existentes de segunda via, pagamento, alteração de contato e alteração de endereço.

### 7.2 Contratos esperados para o Extrato

A implementação deve mapear, conforme os contratos atuais:

- identificador e número formatado do cartão;
- situação do cartão;
- saldo total;
- componentes do saldo por tipo de crédito;
- data e hora de atualização;
- lista de lançamentos;
- tipo do lançamento;
- descrição, data, hora e valor do lançamento.

### 7.3 Contratos esperados para Benefícios

A implementação deve mapear, conforme os contratos atuais:

- elegibilidade do usuário;
- dados cadastrais;
- campos obrigatórios;
- documentos obrigatórios e seus estados;
- opções de entrega;
- solicitação enviada e FIB;
- situação e última atualização;
- validade, isenção e ações disponíveis.

## 8. Alterações de Interface

### 8.1 Diretrizes gerais

- Utilizar o tema e os tokens disponíveis em `design_system/dart/`.
- Utilizar os assets disponíveis em `design_system/assets/`.
- Não fixar cores, tipografias e espaçamentos já representados no design system.
- Manter responsividade para os tamanhos de tela suportados atualmente pelo aplicativo.
- Respeitar áreas seguras, tamanho mínimo de toque, contraste, leitura por tecnologia assistiva e escala de fonte.

### 8.2 Estados obrigatórios

As três frentes redesenhadas devem tratar:

- carregamento;
- conteúdo carregado;
- ausência de dados;
- erro;
- tentativa novamente;
- indisponibilidade de ação;
- processamento de envio.

## 9. Requisitos Não Funcionais

**RNF-01.** A implementação deve seguir a arquitetura e o gerenciamento de estado já utilizados pelo aplicativo Flutter.

**RNF-02.** A Home não deve carregar dados internos dos módulos legados apenas para realizar o roteamento.

**RNF-03.** Consultas de Extrato e Benefícios devem evitar chamadas duplicadas durante carregamento, atualização ou envio.

**RNF-04.** Dados pessoais, documentos, fotos, FIB e números completos de cartão não devem ser registrados em logs.

**RNF-05.** Falhas técnicas devem ser registradas conforme o mecanismo atual de observabilidade, sem exposição de dados sensíveis.

**RNF-06.** A solicitação de permissões de câmera e arquivos deve seguir os padrões das plataformas suportadas e explicar ao usuário a finalidade do acesso.

**RNF-07.** O redesign não deve causar regressão nas rotas existentes abertas pela Home.

## 10. Critérios de Aceite

- A nova Home é exibida após o login.
- Somente Home, Extrato e Benefícios apresentam o novo desenho previsto nesta entrega.
- Todos os demais acessos da Home abrem seus fluxos existentes.
- O card do Extrato utiliza o texto aprovado "Últimos usos e Saldo".
- O Extrato utiliza cartões e dados reais, listando somente cartões ativos na seleção.
- Benefícios exibe somente o perfil Escolar.
- Solicitação e acompanhamento do Benefício Escolar funcionam com dados e estados reais.
- Nenhum dado ilustrativo do protótipo é exibido como informação real.
- Estados de carregamento, vazio e erro são tratados.
- As rotas legadas continuam funcionais após a entrega.

## 11. Cenários de Teste

**CT-01. Nova Home após login**  
Dado um usuário autenticado, ao concluir o login, validar que a nova Home é exibida com cabeçalho, banners, seis cards, dica e barra inferior.

**CT-02. Conteúdo aprovado da Home**  
Validar títulos, descrições, dica, observação e assets conforme o design system v1.1.

**CT-03. Roteamento dos cards legados**  
Selecionar Recarga, QR Code, Pedidos e Cartões e validar que cada card abre sua rota existente, sem apresentar telas demonstrativas do protótipo.

**CT-04. Roteamento dos demais acessos legados**  
Validar sino, avatar, Tri GPS, QR Code, Avisos/Notificações e Perfil da barra inferior.

**CT-05. Banner de cartão para usuário sem cartão**  
Validar que o botão abre a rota existente de solicitação de cartão.

**CT-06. Banner de cartão para usuário com cartão**  
Validar que o botão abre a rota existente de gestão de Cartões.

**CT-07. Entrada do Extrato**  
Selecionar "Últimos usos e Saldo" e validar que o usuário visualiza somente seus cartões ativos para seleção.

**CT-08. Cartão cancelado no Extrato**  
Validar que cartões cancelados não são exibidos na seleção contextual do Extrato.

**CT-09. Exibição do saldo e últimos usos**  
Selecionar um cartão ativo e validar saldo, composição, atualização e lançamentos retornados pelo serviço.

**CT-10. Ordenação e identificação dos lançamentos**  
Validar ordem decrescente, formatação e diferenciação entre débitos e créditos.

**CT-11. Extrato sem lançamentos**  
Validar que o saldo permanece visível e que a seção de últimos usos apresenta estado vazio.

**CT-12. Usuário sem cartão ativo**  
Validar estado vazio e direcionamento para a rota existente aplicável.

**CT-13. Falha na consulta do Extrato**  
Simular falha e validar mensagem, ausência de dados fictícios e ação "Tentar novamente".

**CT-14. Entrada de Benefícios**  
Abrir Benefícios e validar que somente Escolar está visível.

**CT-15. Início da solicitação Escolar**  
Selecionar "Solicitar Benefício Escolar" e validar informações da EPTC e sequência das etapas.

**CT-16. Validação de foto e documentos**  
Validar que não é possível avançar sem foto e documentos obrigatórios aceitos pelas regras atuais.

**CT-17. Preservação dos dados entre etapas**  
Preencher dados, avançar, voltar e validar que as informações foram preservadas.

**CT-18. Revisão e envio da solicitação**  
Validar dados revisados, bloqueio de envio duplicado e apresentação da FIB real após sucesso.

**CT-19. Acompanhamento da solicitação**  
Validar a apresentação de diferentes situações reais e respectivas ações disponíveis.

**CT-20. Ações externas do Benefício Escolar**  
Validar que alteração de contato/endereço, segunda via e pagamento abrem as rotas existentes.

**CT-21. Falha no envio do Benefício Escolar**  
Simular falha, validar mensagem clara, preservação dos dados possível e nova tentativa sem duplicidade.

**CT-22. Regressão dos fluxos existentes**  
Executar navegação pelos acessos legados da Home e validar que seus comportamentos permanecem inalterados.

## 12. Suposições Registradas

- O termo "Extrato" identifica o módulo, mas o card da Home deve utilizar o texto aprovado "Últimos usos e Saldo", conforme `DECISOES.md` e `design_system/design_system.json`.
- O redesign de Benefícios contempla o fluxo completo do Benefício Escolar e seu acompanhamento.
- As regras e integrações atuais de Extrato e Benefício Escolar serão reaproveitadas; ajustes de contrato devem ser tratados somente quando necessários para apresentar o novo layout.
- Os nomes técnicos das rotas serão definidos conforme o projeto Flutter existente.
- Telas e valores demonstrativos do protótipo servem apenas como referência visual e de navegação.
