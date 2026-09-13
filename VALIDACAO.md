# Validação — GoodWe ChargeGrid Intelligence

**GoodWe Challenge 2026 — FIAP | Sprint 3 | Equipe 7**

---

## 1. Objetivo

Este documento registra os critérios e casos de validação do protótipo funcional entregue na Sprint 3, abrangendo o **Dashboard Web** e o **Eletroposto 3D**.

A validação tem como propósito confirmar que as funcionalidades demonstradas funcionam conforme o escopo definido e deixar explícito o que está implementado, o que é simulado e o que pertence à arquitetura futura.

---

## 2. Critérios de interpretação

| Resultado | Significado |
|---|---|
| ✅ Válido | Comportamento observado conforme esperado |
| 🔶 Simulado | Comportamento demonstrado com dados/regras locais — sem integração física ou real |
| 🔲 Não validado | Fora do escopo desta Sprint |
| ❌ Falha | Comportamento não observado ou diferente do esperado |

> ⚠️ Esta validação é **funcional de conceito**, não uma homologação de instalação comercial ou certificação de produto.

---

## 3. Validação do Dashboard Web

### 3.1 Acesso e carregamento

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-01 | Acessar https://goodwe-grid-smart.lovable.app/ | Interface carrega sem erros | ✅ Válido |
| D-02 | Navegar entre as áreas do Dashboard | Transições sem erros de rota | ✅ Válido |
| D-03 | Dados atualizam sem recarregar a página | Atualização automática (~2 s) visível | 🔶 Simulado |

### 3.2 Painel Geral

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-04 | Visualizar demanda atual da rede | Indicador de demanda exibido | 🔶 Simulado |
| D-05 | Visualizar sessões ativas | Contador de sessões em andamento | 🔶 Simulado |
| D-06 | Visualizar totalizadores (kWh, receita) | Valores atualizados dinamicamente | 🔶 Simulado |

### 3.3 Balanceamento

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-07 | Visualizar potência distribuída entre carregadores | Gráfico/tabela de distribuição exibido | 🔶 Simulado |
| D-08 | Verificar relação entre demanda e limite da rede (200 kW) | Indicador de capacidade visível | 🔶 Simulado |

### 3.4 Estações

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-09 | Listar carregadores cadastrados | Lista de estações exibida com status | ✅ Válido |
| D-10 | Visualizar detalhes de um carregador | Potência, usuário, veículo, percentual, tarifa | ✅ Válido |
| D-11 | Iniciar sessão de recarga | Carregador muda para estado "Preparando/Carregando" | 🔶 Simulado |
| D-12 | Encerrar sessão de recarga | Sessão movida para histórico de concluídas | 🔶 Simulado |

### 3.5 Logs

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-13 | Visualizar eventos de log | Lista de eventos operacionais exibida | 🔶 Simulado |
| D-14 | Verificar nomenclatura dos eventos | BootNotification, Heartbeat, StartTransaction, StopTransaction, StatusNotification, MeterValues, Authorize | 🔶 Simulado |
| D-15 | Novos logs aparecem dinamicamente | Eventos adicionados sem recarregar | 🔶 Simulado |

> ⚠️ Os eventos de log são **gerados localmente** e não representam comunicação OCPP real com carregadores físicos.

### 3.6 IA & Previsão

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-16 | Visualizar área de previsão de demanda | Gráficos e insights exibidos | 🔶 Simulado |
| D-17 | Verificar ação de Peak Shaving | Redução de potência registrada nos logs | 🔶 Simulado |

> ⚠️ A área de IA/Previsão é **demonstrativa**. Não existe modelo de Machine Learning treinado e validado nesta versão.

### 3.7 Simulador "E Se..."

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-18 | Alterar número de carregadores | Resultado do cenário recalculado | ✅ Válido |
| D-19 | Alterar consumo base do prédio | Impacto na demanda simulada recalculado | ✅ Válido |
| D-20 | Alterar limite contratado da rede | Margem disponível recalculada | ✅ Válido |
| D-21 | Alterar geração solar | Contribuição renovável recalculada | ✅ Válido |
| D-22 | Visualizar comparação com/sem ChargeGrid | Diferença de demanda e estimativas exibidas | 🔶 Simulado |

> Os valores de economia e ROI são **estimativas matemáticas** da simulação, não medições de campo.

### 3.8 Faturamento

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| D-23 | Visualizar relatório de faturamento | Dados de receita simulada exibidos | 🔶 Simulado |
| D-24 | Verificar histórico de sessões concluídas | Sessões com kWh, custo e duração listados | 🔶 Simulado |

> ⚠️ Faturamento é **simulado**. Não existe processamento financeiro real.

---

## 4. Validação do Eletroposto 3D

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| E-01 | Abrir index_V8_1_SPRINT3.html via servidor HTTP | Ambiente 3D carregado no navegador | ✅ Válido |
| E-02 | Modelo ChargeGrid_Web.glb carregado | Eletroposto 3D visível na cena | ✅ Válido |
| E-03 | Visualizar elementos do cenário energético | Rede, solar, ESS, prédio, EV 01, EV 02, EV 03 visíveis | ✅ Válido |
| E-04 | Indicadores em tempo real visíveis | Tempo, energia entregue, custo, % renovável exibidos | 🔶 Simulado |

---

## 5. Validação do fluxo da sessão

| ID | Etapa | Resultado esperado | Status |
|---|---|---|---|
| F-01 | Identificação | Interface de identificação exibida | 🔶 Simulado |
| F-02 | Configuração | Opções de configuração (Economy/Fast) disponíveis | 🔶 Simulado |
| F-03 | Pagamento | Tela de pagamento exibida | 🔶 Simulado |
| F-04 | Liberação da trava | Trava liberada na simulação | 🔶 Simulado |
| F-05 | Retirada do conector | Conector disponível para uso | 🔶 Simulado |
| F-06 | Conexão ao EV 03 | Conexão ao veículo representada na simulação | 🔶 Simulado |
| F-07 | Carregamento | Sessão de carregamento iniciada; indicadores atualizando | 🔶 Simulado |
| F-08 | Distribuição energética | Potência distribuída entre fontes e EVs | 🔶 Simulado |
| F-09 | Encerramento | Sessão encerrada na simulação | 🔶 Simulado |
| F-10 | Devolução | Conector devolvido | 🔶 Simulado |
| F-11 | Travamento | Trava reativada na simulação | 🔶 Simulado |

> ⚠️ Todas as etapas são **simuladas**. Não existe hardware físico, pagamento real ou comunicação OCPP real.

---

## 6. Validação energética

| ID | Caso de teste | Valor de referência | Status |
|---|---|---|---|
| EN-01 | Limite da rede respeitado | 35 kW (3D) / 200 kW (Dashboard) | 🔶 Simulado |
| EN-02 | Consumo base do prédio aplicado | 32 kW (3D) / 120 kW (Dashboard) | 🔶 Simulado |
| EN-03 | Battery ESS participando do cenário | 60 kWh, SOC inicial 72% | 🔶 Simulado |
| EN-04 | EV 01 respeitando limite de potência | até 18 kW | 🔶 Simulado |
| EN-05 | EV 02 respeitando limite de potência | até 12 kW | 🔶 Simulado |
| EN-06 | EV 03 Economy respeitando limite | até 20 kW | 🔶 Simulado |
| EN-07 | EV 03 Fast respeitando limite | até 28 kW | 🔶 Simulado |
| EN-08 | Geração solar contribuindo para potência disponível | Percentual renovável exibido | 🔶 Simulado |

---

## 7. Validação do Load Balancing

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| LB-01 | Potência disponível calculada corretamente | Limite − consumo do prédio + solar + ESS | 🔶 Simulado |
| LB-02 | Potência distribuída entre EVs | Cada EV recebe fração da potência disponível | 🔶 Simulado |
| LB-03 | Nenhum EV ultrapassa seu limite individual | Potência alocada ≤ máximo do veículo | 🔶 Simulado |
| LB-04 | Distribuição recalculada dinamicamente | Ajuste ao longo da simulação visível | 🔶 Simulado |

---

## 8. Validação do Peak Shaving

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| PS-01 | Detecção de demanda elevada | Sistema identifica aproximação do limite | 🔶 Simulado |
| PS-02 | Redução da potência dos carregadores | Potência temporariamente reduzida | 🔶 Simulado |
| PS-03 | Evento registrado nos logs | Log de Peak Shaving gerado | 🔶 Simulado |
| PS-04 | Demanda retorna ao nível normal | Potência restaurada após redução | 🔶 Simulado |

---

## 9. Validação da atualização dinâmica

| ID | Caso de teste | Resultado esperado | Status |
|---|---|---|---|
| AD-01 | Dashboard atualiza sem ação do usuário | Dados renovados ~2 s | 🔶 Simulado |
| AD-02 | Percentual de carga dos EVs aumenta | Progresso visível ao longo do tempo | 🔶 Simulado |
| AD-03 | Logs novos aparecem dinamicamente | Fila de eventos atualizada | 🔶 Simulado |
| AD-04 | Simulação 3D avança em 60× | Sessão progride em velocidade acelerada | 🔶 Simulado |

---

## 10. Validação da conexão com a disciplina

| Conteúdo | Evidência no protótipo | Status |
|---|---|---|
| Lógica e tomada de decisão | Regras de distribuição de potência e controle de demanda | 🔶 Simulado |
| Automação / IoT | Atualizações automáticas e resposta a eventos da simulação | 🔶 Simulado |
| Gestão de estações e sessões | Dashboard com carregadores, sessões ativas e histórico | ✅ Implementado |
| Logs operacionais (OCPP) | Eventos com nomenclatura BootNotification, StartTransaction etc. | 🔶 Simulado |
| Load Balancing | Distribuição de potência entre EVs demonstrada | 🔶 Simulado |
| Peak Shaving | Redução de demanda em pico demonstrada | 🔶 Simulado |
| Geração solar | Contribuição renovável no cenário 3D e no simulador | 🔶 Simulado |
| Battery ESS | Armazenamento como buffer de demanda no cenário 3D | 🔶 Simulado |
| Sustentabilidade | Percentual de energia renovável exibido; uso eficiente da infraestrutura | 🔶 Simulado |
| Eficiência energética | Coordenação entre consumo, geração, armazenamento e recarga | 🔶 Simulado |

---

## 11. Escopo validado

O protótipo funcional entregue na Sprint 3 demonstra:

- Dashboard Web acessível e funcional com dados atualizados dinamicamente;
- Eletroposto 3D com modelo 3D carregado e fluxo de sessão completo;
- Gestão de estações, sessões ativas e histórico de sessões concluídas;
- Distribuição energética simulada entre rede, geração solar, Battery ESS e três veículos elétricos;
- Load Balancing com distribuição de potência entre EV 01, EV 02 e EV 03;
- Peak Shaving com redução temporária de potência e registro em log;
- Simulador "E Se..." com recálculo de cenários energéticos;
- Logs com nomenclatura inspirada em OCPP;
- Indicadores de tempo, energia, custo e percentual renovável;
- Fluxo completo da sessão no Eletroposto 3D (identificação → travamento).

---

## 12. Escopo não validado

Os itens abaixo estão **fora do escopo da Sprint 3** e pertencem à arquitetura futura planejada:

- Integração física com carregadores GoodWe;
- CSMS / OCPP real;
- Edge Gateway / Raspberry Pi físico;
- Pagamentos reais (PIX, cartão ou qualquer outro meio);
- Backend de produção e banco de dados persistente;
- Telemetria real de equipamentos;
- Machine Learning treinado e validado com dados históricos;
- Autenticação e autorização de produção;
- Testes de carga e desempenho em ambiente físico.

---

## 13. Limitações dos testes

- Todos os testes foram realizados com **dados simulados** — sem conexão com hardware físico ou serviços externos.
- A validação do Dashboard depende do acesso ao link publicado no Lovable — qualquer indisponibilidade do serviço impede a validação online.
- A validação do Eletroposto 3D requer servidor HTTP local — abertura direta do `.html` pode impedir o carregamento do modelo GLB.
- Os valores numéricos (potência, kWh, custo, ROI) são **demonstrativos** e não foram medidos em campo.
- Os logs OCPP são eventos locais e não representam comunicação real com equipamentos.

---

## 14. Interpretação

Esta validação representa uma **validação funcional de conceito**, não uma homologação de instalação comercial.

O objetivo da Sprint 3 é demonstrar que o conceito de gerenciamento inteligente de carga é viável e que as estratégias de Load Balancing, Peak Shaving, integração solar e Battery ESS podem ser representadas e testadas em um ambiente simulado antes de uma eventual implementação física.

Os protótipos entregues cumprem esse propósito dentro do escopo acadêmico da disciplina.

---

## 15. Síntese final

| Aspecto | Resultado |
|---|---|
| Dashboard Web funcional | ✅ |
| Eletroposto 3D funcional | ✅ |
| Fluxo da sessão demonstrado | ✅ |
| Load Balancing demonstrado | ✅ |
| Peak Shaving demonstrado | ✅ |
| Geração solar e Battery ESS no cenário | ✅ |
| Logs OCPP simulados | ✅ |
| Integração física com GoodWe | 🔲 Planejado |
| OCPP real | 🔲 Planejado |
| Pagamentos reais | 🔲 Planejado |
| Backend / banco de dados real | 🔲 Planejado |
| ML treinado e validado | 🔲 Planejado |

**Conclusão:** o protótipo da Sprint 3 demonstra de forma funcional o conceito de gerenciamento inteligente de recarga de veículos elétricos, dentro do escopo definido para esta fase do Challenge.
