# GoodWe ChargeGrid Intelligence

Solução de gerenciamento inteligente de recarga de veículos elétricos desenvolvida para o **GoodWe Challenge 2026** — FIAP, Sprint 3.

O ChargeGrid é um **único produto** com duas interfaces complementares: um **Dashboard Web** de gestão e monitoramento e um **Eletroposto 3D** de demonstração da operação simulada de uma sessão de recarga.

---

## Artefatos principais da Sprint 3

### Eletroposto 3D

Demonstração da operação física/simulada do eletroposto e do fluxo completo de uma sessão de recarga.

| Arquivo | Descrição |
|---|---|
| `index_V8_1_SPRINT3.html` | Interface 3D principal |
| `ChargeGrid_Web.glb` | Modelo 3D do eletroposto |

### Dashboard Web

Interface de gestão, monitoramento e visualização da operação.

🔗 **[https://goodwe-grid-smart.lovable.app/](https://goodwe-grid-smart.lovable.app/)**

### Documentação técnica

| Arquivo | Conteúdo |
|---|---|
| [ARQUITETURA.md](ARQUITETURA.md) | Arquitetura, componentes, lógica energética e visão futura |
| [VALIDACAO.md](VALIDACAO.md) | Casos de validação, escopo validado e limitações |

---

## 1. Equipe

**Equipe 7 — Turma 1CCPX**

| Nome | RM |
|---|---|
| Gabriel Barbosa Furin | 572941 |
| Gabriel de Almeida Santos | 569395 |
| Herbert Soares de Jesus | 571507 |
| Lucas Kiodi Moraca | 571004 |
| Renan Fracalossi Mano da Silva | 569610 |

---

## 2. Visão geral da solução

O **GoodWe ChargeGrid Intelligence** é uma proposta de plataforma de gerenciamento energético para estações de recarga de veículos elétricos em ambientes comerciais.

As duas interfaces são **complementares** e representam o mesmo conceito de produto:

| Interface | Função |
|---|---|
| **Dashboard Web** | Gestão, monitoramento, balanceamento, logs, simulações e faturamento |
| **Eletroposto 3D** | Demonstração da operação física/simulada da sessão de recarga |

---

## 3. Problema

Em ambientes comerciais com múltiplos veículos elétricos carregando simultaneamente — shopping centers, empresas, estacionamentos, prédios — a demanda elétrica pode aumentar significativamente e superar os limites contratados com a concessionária.

Sem gerenciamento, esse cenário pode gerar picos de demanda com impacto tarifário, sobrecarga da infraestrutura e ineficiência no uso de fontes renováveis e armazenamento.

---

## 4. Objetivo

O ChargeGrid coordena a potência disponível considerando:

- consumo base do prédio;
- limite da rede elétrica;
- geração solar;
- Battery ESS (armazenamento);
- potência demandada pelos veículos;
- Load Balancing;
- Peak Shaving.

O objetivo da Sprint 3 é demonstrar esse conceito por meio de um **Dashboard Web** funcional e de um **protótipo 3D interativo**.

---

## 5. Status das funcionalidades

> **Legenda:**
> - ✅ **Implementado** — presente e funcional no protótipo/interface.
> - 🔶 **Simulado** — comportamento demonstrado com dados/regras simuladas, sem integração física ou serviço real.
> - 🔲 **Planejado** — evolução futura; **não é requisito da Sprint 3 atual**.

| Funcionalidade | Status |
|---|---|
| Dashboard Web | ✅ Implementado |
| Eletroposto 3D | ✅ Implementado |
| Fluxo da sessão de recarga | 🔶 Simulado |
| Distribuição energética | 🔶 Simulado |
| Load Balancing | 🔶 Simulado |
| Peak Shaving | 🔶 Simulado |
| Geração solar | 🔶 Simulado |
| Battery ESS | 🔶 Simulado |
| Logs inspirados em OCPP | 🔶 Simulado |
| IA / Previsão | 🔶 Simulado / Demonstração |
| Simulador "E Se..." | ✅ Implementado / 🔶 Simulado |
| Faturamento | 🔶 Simulado |
| Pagamento PIX real | 🔲 Planejado |
| Pagamento cartão real | 🔲 Planejado |
| Backend / Charge Engine | 🔲 Planejado |
| Banco de dados persistente | 🔲 Planejado |
| CSMS / OCPP real | 🔲 Planejado |
| Edge Gateway / Raspberry Pi | 🔲 Planejado |
| Integração física com equipamentos GoodWe | 🔲 Planejado |
| Machine Learning treinado | 🔲 Planejado |

---

## 6. Arquitetura

```
Fontes de energia + infraestrutura
         ↓
Lógica de gerenciamento / ChargeGrid
         ↓
Dashboard Web        Eletroposto 3D
         ↓                  ↓
Monitoramento        Sessão de recarga
e automações         e distribuição
```

Para detalhes completos, consulte [ARQUITETURA.md](ARQUITETURA.md).

---

## 7. Dashboard Web

🔗 **[https://goodwe-grid-smart.lovable.app/](https://goodwe-grid-smart.lovable.app/)**

Interface de **gestão e monitoramento** da operação ChargeGrid.

| Área | Descrição |
|---|---|
| Painel Geral | Visão consolidada da operação — demanda, sessões ativas, indicadores |
| Balanceamento | Distribuição de potência entre estações e veículos |
| Estações | Status dos carregadores, potência e sessões em andamento |
| Logs OCPP | Eventos operacionais com nomenclatura inspirada em OCPP (simulados) |
| IA & Previsão | Área demonstrativa de análise e previsão de demanda |
| Simulador "E Se..." | Simulação de cenários alternativos de gerenciamento |
| Faturamento | Relatórios e indicadores financeiros simulados |
| Usuários & Frotas | Gestão de usuários e frotas (protótipo) |

O Dashboard utiliza uma camada local de dados simulados — **LiveDataProvider** — atualizada aproximadamente a cada 2 segundos, sem dependência de backend ou hardware físico.

> ⚠️ Os logs OCPP são **gerados localmente** e não representam comunicação OCPP real. A área de IA/Previsão é **demonstrativa** — não existe modelo de Machine Learning treinado.

**Parâmetros do cenário do Dashboard** *(independentes do Eletroposto 3D)*:

| Parâmetro | Valor |
|---|---|
| Limite da rede | 200 kW |
| Consumo base | 120 kW |
| Carregadores | até 22 kW cada |

---

## 8. Eletroposto 3D

Protótipo interativo que demonstra a **operação física/simulada** do eletroposto e o fluxo completo de uma sessão de recarga.

**O que o Eletroposto 3D demonstra:**

- Geração solar e contribuição renovável
- Rede elétrica e limite de demanda
- Battery ESS (armazenamento de energia)
- Consumo base do prédio
- EV 01, EV 02 e EV 03 com demandas distintas
- Distribuição automática de energia entre as fontes e cargas
- Indicadores em tempo real: tempo de sessão, energia entregue, custo, percentual renovável

---

## 9. Fluxo da sessão

```
Identificação → Configuração → Pagamento → Liberação da trava
      → Retirada do conector → Conexão ao EV 03 → Carregamento
      → Distribuição energética → Encerramento → Devolução → Travamento
```

> O fluxo é **simulado**. Não existe hardware físico, OCPP real ou processamento de pagamento real.

---

## 10. Parâmetros da simulação 3D

> ⚠️ Valores **exclusivos do Eletroposto 3D** — independentes dos parâmetros do Dashboard Web.

| Parâmetro | Valor |
|---|---|
| Limite da rede | **35 kW** |
| Consumo base do prédio | **32 kW** |
| Battery ESS | **60 kWh** |
| SOC inicial da bateria | **72%** |
| EV 01 | até **18 kW** |
| EV 02 | até **12 kW** |
| EV 03 — Economy | até **20 kW** |
| EV 03 — Fast | até **28 kW** |
| Velocidade da simulação | **60×** |

### Justificativa dos parâmetros

Os valores foram escolhidos para representar um **cenário comercial com restrição de demanda**. O limite da rede de 35 kW e o consumo base do prédio de 32 kW deixam uma margem inicial pequena (≈ 3 kW) para a recarga dos veículos, criando a necessidade de geração solar e Battery ESS para que os EVs possam ser carregados de forma significativa.

As potências distintas dos EVs permitem demonstrar diferentes níveis de demanda e observar a atuação das regras de Load Balancing e Peak Shaving ao longo da simulação.

> ⚠️ Esses valores são **exclusivamente simulados** e **não representam** dimensionamento elétrico real, homologação, especificação de instalação ou validação de engenharia.

---

## 11. Distribuição energética

```
┌──────────────────────────────────┐
│  Rede elétrica    Geração solar  │
│  Battery ESS      Prédio (base)  │
└──────────────┬───────────────────┘
               ↓
     Lógica ChargeGrid
     (Load Balancing / Peak Shaving)
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
  EV 01      EV 02      EV 03
```

---

## 12. Load Balancing e Peak Shaving

### Load Balancing *(simulado)*

Distribui a potência disponível entre os veículos de acordo com as condições do cenário, garantindo que a soma das cargas respeite o limite da rede.

### Peak Shaving *(simulado)*

Quando a demanda simulada aumenta, o sistema reduz temporariamente a potência destinada aos carregadores para evitar um pico de demanda na rede.

---

## 13. Tecnologias

### Dashboard Web

| Categoria | Tecnologias |
|---|---|
| Framework / Linguagem | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Radix UI, Lucide React |
| Roteamento | React Router |
| Gráficos | Recharts |
| Mapas | Leaflet, OpenStreetMap |
| Dados assíncronos | TanStack React Query |
| Testes | Vitest |

### Eletroposto 3D

| Categoria | Tecnologias |
|---|---|
| Linguagens | HTML, CSS, JavaScript |
| 3D | Three.js, GLTFLoader, PointerLockControls |
| Modelo | GLB (ChargeGrid_Web.glb) |

---

## 14. Conexão com os conteúdos da disciplina

| # | Conteúdo da disciplina | Como se aplica no ChargeGrid |
|---|---|---|
| 1 | Lógica e tomada de decisão | Regras de distribuição de potência e controle de demanda |
| 2 | Automação / IoT | Conceito de coleta de dados e atuação automática sobre cargas |
| 3 | Gestão de estações e sessões | Monitoramento de carregadores, veículos e sessões ativas |
| 4 | Logs operacionais | Eventos simulados com nomenclatura inspirada em OCPP |
| 5 | Load Balancing | Distribuição da potência disponível entre múltiplos EVs |
| 6 | Peak Shaving | Redução da demanda em períodos de pico |
| 7 | Geração solar | Fonte renovável integrada ao cenário energético |
| 8 | Battery ESS | Armazenamento energético como buffer de demanda |
| 9 | Sustentabilidade | Melhor aproveitamento das fontes e infraestrutura existente |
| 10 | Eficiência energética | Coordenação entre consumo, geração, armazenamento e recarga |

---

## 15. Uso de simulações

O Dashboard Web e o Eletroposto 3D permitem testar estratégias de automação e gerenciamento energético em um **ambiente controlado, sem risco físico**.

A simulação demonstra sessões de recarga, distribuição de potência, Load Balancing, Peak Shaving, geração solar, Battery ESS e indicadores operacionais (energia, tempo, custo, percentual renovável), funcionando como uma **validação de conceito** antes de uma eventual implementação física.

---

## 16. Resultados funcionais

- Dashboard Web publicado e acessível via navegador.
- Eletroposto 3D funcional com o fluxo completo da sessão demonstrado.
- Distribuição energética simulada com EV 01, EV 02, EV 03, geração solar e Battery ESS.
- Logs operacionais com nomenclatura inspirada em OCPP.
- Load Balancing e Peak Shaving demonstrados nas duas interfaces.
- Indicadores em tempo real: demanda, energia, custo, percentual renovável.

---

## 17. Evidências

### Dashboard Web

| Evidência | Arquivo |
|---|---|
| Painel Geral | [Painel/dashboard_painel_geral.png](Painel/dashboard_painel_geral.png) |
| Balanceamento | [Painel/dashboard_balanceamento.png](Painel/dashboard_balanceamento.png) |
| Faturamento | [Painel/dashboard_faturamento.png](Painel/dashboard_faturamento.png) |

### Eletroposto 3D

| Evidência | Arquivo |
|---|---|
| Visão geral | [Eletroposto_3D/eletroposto_visao_geral.png](Eletroposto_3D/eletroposto_visao_geral.png) |
| Sessão de recarga | [Eletroposto_3D/eletroposto_sessao_recarga.png](Eletroposto_3D/eletroposto_sessao_recarga.png) |
| Energy Engine | [Eletroposto_3D/eletroposto_energy_engine.png](Eletroposto_3D/eletroposto_energy_engine.png) |

---

## 18. Como executar

### Dashboard Web

Acesso direto pelo navegador:

```
https://goodwe-grid-smart.lovable.app/
```

### Eletroposto 3D

`index_V8_1_SPRINT3.html` e `ChargeGrid_Web.glb` devem estar no mesmo diretório. Execute um servidor HTTP local:

```bash
python -m http.server 8000
```

Acesse:

```
http://localhost:8000/index_V8_1_SPRINT3.html
```

> ⚠️ Abrir o `.html` diretamente como arquivo local pode bloquear o carregamento do modelo 3D. Use sempre o servidor HTTP.

---

## 19. Estrutura do repositório

```
Sprint-3-Python/
├── Painel/
│   ├── dashboard_balanceamento.png
│   ├── dashboard_faturamento.png
│   └── dashboard_painel_geral.png
├── Eletroposto_3D/
│   ├── eletroposto_energy_engine.png
│   ├── eletroposto_sessao_recarga.png
│   └── eletroposto_visao_geral.png
├── ARQUITETURA.md
├── ChargeGrid_Web.glb
├── README.md
├── VALIDACAO.md
└── index_V8_1_SPRINT3.html
```

---

## 20. Limitações

- O Dashboard utiliza **dados simulados/localmente gerados** — não existe backend de produção.
- O Eletroposto 3D utiliza **simulação** — não existe hardware físico.
- Os logs são **inspirados em OCPP**, mas **não representam comunicação OCPP real**.
- A área de IA/Previsão é **demonstrativa** — não existe modelo de Machine Learning treinado.
- O faturamento é **simulado** — não existe processamento financeiro real.
- Não existe banco de dados persistente, integração física com carregadores GoodWe, Edge Gateway físico, pagamento real ou ML treinado e validado.
- Todos os valores de potência, energia, custo e demais indicadores são **exclusivamente demonstrativos**.

Para detalhes completos sobre o escopo validado e não validado, consulte [VALIDACAO.md](VALIDACAO.md).

---

## 21. Arquitetura futura e próximos passos

A arquitetura futura planejada inclui componentes ainda não implementados:

- Backend / Charge Engine
- Banco de dados persistente
- CSMS / OCPP real
- Edge Gateway (ex: Raspberry Pi)
- Integração física com equipamentos GoodWe
- ML / Previsões treinadas com dados históricos
- Pagamentos reais (PIX, cartão)

> ⚠️ Esses itens são **evolução futura** e **não fazem parte do escopo da Sprint 3 atual**. Essa evolução poderá continuar em futuras Sprints, em uma prova de conceito física ou na continuidade do próprio Challenge GoodWe.

---

## 22. Links e documentação

| Recurso | Link |
|---|---|
| Dashboard Web | [https://goodwe-grid-smart.lovable.app/](https://goodwe-grid-smart.lovable.app/) |
| Arquitetura | [ARQUITETURA.md](ARQUITETURA.md) |
| Validação | [VALIDACAO.md](VALIDACAO.md) |
