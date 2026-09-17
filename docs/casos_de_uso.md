# Casos de Uso — GoodWe ChargeGrid Intelligence

**GoodWe Challenge 2026 — FIAP | Sprint 3 | Equipe 7**

Este documento descreve os casos de uso do produto ChargeGrid, cobrindo a interface **Dashboard Web** (implementada e publicada) e a interface **Mobile** (conceitual/planejada, representando a jornada do usuário final na estação de recarga — hoje demonstrada de forma equivalente pelo **Eletroposto 3D**).

> ⚠️ Todos os fluxos descritos são **simulados** ou **conceituais**. Não existe backend de produção, aplicativo mobile publicado, pagamento real ou integração física com equipamentos.

---

## Dashboard Web

### UC-01 — Visualizar Painel Geral

- **Ator:** Operador / Gestor
- **Pré-condição:** Dashboard acessível via navegador
- **Fluxo principal:** Operador acessa o Dashboard → sistema exibe demanda atual, sessões ativas e totalizadores consolidados
- **Fluxo alternativo:** Se os dados simulados ainda não carregaram, o painel exibe estado de carregamento até a primeira atualização do LiveDataProvider
- **Resultado esperado:** Visão consolidada da operação atualizada automaticamente a cada ~2 segundos

### UC-02 — Visualizar Balanceamento

- **Ator:** Operador
- **Pré-condição:** Existem carregadores cadastrados no cenário simulado
- **Fluxo principal:** Operador acessa a área de Balanceamento → sistema exibe a distribuição de potência entre estações e o limite da rede (200 kW)
- **Fluxo alternativo:** Se a demanda simulada superar o limite, o indicador de capacidade sinaliza alerta visual
- **Resultado esperado:** Distribuição de potência entre carregadores exibida de forma clara, respeitando o limite simulado

### UC-03 — Consultar Estações

- **Ator:** Operador
- **Pré-condição:** Lista de carregadores cadastrada no cenário
- **Fluxo principal:** Operador acessa a área de Estações → sistema lista carregadores com status, potência e sessão em andamento
- **Fluxo alternativo:** Operador seleciona um carregador específico → sistema exibe detalhes (usuário, veículo, percentual de carga, tarifa)
- **Resultado esperado:** Lista e detalhes das estações exibidos corretamente, refletindo o estado simulado

### UC-04 — Consultar Logs

- **Ator:** Operador
- **Pré-condição:** Sessões simuladas geraram eventos
- **Fluxo principal:** Operador acessa a área de Logs → sistema exibe eventos com nomenclatura inspirada em OCPP (BootNotification, StartTransaction, MeterValues, StopTransaction, etc.)
- **Fluxo alternativo:** Novo evento é gerado durante a visualização → log é inserido dinamicamente sem recarregar a página
- **Resultado esperado:** Histórico de eventos operacionais visível e atualizado em tempo real (simulado)

### UC-05 — Consultar área de IA & Previsão

- **Ator:** Operador / Gestor
- **Pré-condição:** Dashboard carregado com dados simulados
- **Fluxo principal:** Operador acessa a área de IA & Previsão → sistema exibe gráficos e indicativos de previsão de demanda
- **Fluxo alternativo:** Peak Shaving é acionado durante o período observado → evento correspondente aparece nos logs
- **Resultado esperado:** Área demonstrativa exibida claramente identificada como simulação — sem modelo de Machine Learning treinado

### UC-06 — Executar Simulador "E Se..."

- **Ator:** Operador / Gestor
- **Pré-condição:** Simulador acessível no Dashboard
- **Fluxo principal:** Operador altera parâmetros (nº de carregadores, consumo base, limite da rede, geração solar) → sistema recalcula o cenário resultante
- **Fluxo alternativo:** Operador ativa a comparação "com/sem ChargeGrid" → sistema exibe a diferença estimada de demanda e economia
- **Resultado esperado:** Cenário recalculado corretamente a cada alteração de parâmetro, com resultados exibidos como estimativas

### UC-07 — Consultar Faturamento

- **Ator:** Gestor financeiro
- **Pré-condição:** Sessões simuladas foram concluídas
- **Fluxo principal:** Gestor acessa a área de Faturamento → sistema exibe relatório de receita simulada e histórico de sessões concluídas
- **Fluxo alternativo:** Nenhuma sessão concluída no período → relatório exibido com totais zerados
- **Resultado esperado:** Relatório de faturamento simulado exibido com kWh, custo e duração por sessão

### UC-08 — Gerenciar Usuários & Frotas

- **Ator:** Gestor / Operador
- **Pré-condição:** Cadastro de usuários e frotas disponível no protótipo
- **Fluxo principal:** Gestor acessa a área de Usuários & Frotas → sistema exibe lista de usuários/veículos cadastrados
- **Fluxo alternativo:** Não há dados cadastrados → área exibida vazia, sem erro
- **Resultado esperado:** Visualização do cadastro de usuários e frotas, nível de protótipo

### UC-09 — Observar Peak Shaving em ação

- **Ator:** Operador
- **Pré-condição:** Demanda simulada se aproxima ou supera o limite da rede/potência disponível
- **Fluxo principal:** Sistema detecta demanda elevada → aciona Peak Shaving → reduz temporariamente a potência dos carregadores → registra evento no log
- **Fluxo alternativo:** Demanda retorna ao normal → potência dos carregadores é restaurada e evento de normalização é registrado
- **Resultado esperado:** Redução temporária de potência visível no Balanceamento e evento correspondente nos Logs

---

## Mobile (conceitual — jornada do usuário final)

> Não existe aplicativo mobile publicado nesta Sprint. Os casos de uso abaixo descrevem a jornada do usuário final planejada para uma futura interface mobile e são demonstrados de forma equivalente pelo **Eletroposto 3D** (ver [diagramas/fluxograma_sessao.md](diagramas/fluxograma_sessao.md)).

### UC-10 — Localizar eletroposto no mapa

- **Ator:** Motorista / Usuário final
- **Pré-condição:** Usuário possui o aplicativo (conceitual) instalado
- **Fluxo principal:** Usuário abre o mapa → aplicativo exibe eletropostos próximos com status (disponível/ocupado)
- **Fluxo alternativo:** Nenhum eletroposto disponível na região → aplicativo sugere ampliar o raio de busca
- **Resultado esperado:** Mapa exibido com eletropostos e status atualizado (equivalente conceitual à tela inicial do Eletroposto 3D)

### UC-11 — Consultar detalhes do carregador

- **Ator:** Motorista / Usuário final
- **Pré-condição:** Usuário selecionou um eletroposto no mapa
- **Fluxo principal:** Usuário toca no eletroposto → aplicativo exibe potência disponível, tipo de conector e tarifa
- **Fluxo alternativo:** Carregador está ocupado → aplicativo exibe tempo estimado de espera
- **Resultado esperado:** Detalhes do carregador exibidos antes da configuração da sessão

### UC-12 — Configurar sessão de recarga

- **Ator:** Motorista / Usuário final
- **Pré-condição:** Carregador disponível e selecionado
- **Fluxo principal:** Usuário escolhe o modo de recarga (Economy ou Fast) → confirma → aplicativo simula o pagamento e libera a trava
- **Fluxo alternativo:** Usuário cancela a configuração antes de confirmar → sessão não é iniciada
- **Resultado esperado:** Sessão configurada e trava liberada, equivalente às etapas "Configuração → Pagamento → Liberação da trava" do fluxograma

### UC-13 — Acompanhar sessão em andamento

- **Ator:** Motorista / Usuário final
- **Pré-condição:** Sessão de recarga iniciada
- **Fluxo principal:** Usuário acompanha em tempo real energia entregue, tempo de sessão, custo acumulado e percentual renovável
- **Fluxo alternativo:** Peak Shaving é acionado durante a sessão → aplicativo informa redução temporária de potência
- **Resultado esperado:** Indicadores da sessão atualizados dinamicamente até o encerramento

### UC-14 — Encerrar sessão

- **Ator:** Motorista / Usuário final
- **Pré-condição:** Sessão de recarga em andamento
- **Fluxo principal:** Usuário solicita encerramento → aplicativo finaliza a sessão, devolve o conector e trava o eletroposto
- **Fluxo alternativo:** Veículo atinge 100% de carga antes da solicitação → sessão é encerrada automaticamente
- **Resultado esperado:** Sessão encerrada, conector devolvido e trava reativada (etapas finais do fluxograma)

### UC-15 — Consultar histórico de sessões

- **Ator:** Motorista / Usuário final
- **Pré-condição:** Usuário concluiu ao menos uma sessão
- **Fluxo principal:** Usuário acessa o histórico → aplicativo lista sessões anteriores com data, energia consumida e custo
- **Fluxo alternativo:** Nenhuma sessão anterior → histórico exibido vazio
- **Resultado esperado:** Histórico de sessões exibido corretamente, equivalente ao registro de faturamento do Dashboard (UC-07)

---

Ver também: [diagramas/diagrama_blocos.md](diagramas/diagrama_blocos.md), [diagramas/fluxograma_sessao.md](diagramas/fluxograma_sessao.md), [../ARQUITETURA.md](../ARQUITETURA.md), [../VALIDACAO.md](../VALIDACAO.md).
