# Dashboard — GoodWe ChargeGrid Intelligence

Interface web de gestão e monitoramento da operação ChargeGrid.

🔗 **[https://goodwe-grid-smart.lovable.app/](https://goodwe-grid-smart.lovable.app/)**

---

## Sobre este diretório

Esta pasta contém o **código-fonte completo** do Dashboard Web do ChargeGrid Intelligence, desenvolvido com React 18 + TypeScript + Vite e publicado via Lovable.

O Dashboard é uma das duas interfaces do produto ChargeGrid. A outra é o **Eletroposto 3D** (`index_V8_1_SPRINT3.html` + `ChargeGrid_Web.glb`), localizado na raiz do repositório.

---

## Stack

| Categoria | Tecnologias |
|---|---|
| Framework / Linguagem | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Radix UI, Lucide React |
| Roteamento | React Router |
| Gráficos | Recharts |
| Mapas | Leaflet, OpenStreetMap |
| Dados assíncronos | TanStack React Query |
| Testes | Vitest, @testing-library/react |

---

## Estrutura relevante

```
Dashboard/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── LiveDataProvider.tsx   ← camada de dados simulados
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── DashboardLoadManagement.tsx
│   │   │   ├── DashboardChargers.tsx
│   │   │   ├── DashboardLogs.tsx
│   │   │   ├── DashboardInsights.tsx
│   │   │   ├── DashboardSimulator.tsx
│   │   │   ├── DashboardBilling.tsx
│   │   │   └── DashboardUsers.tsx
│   │   └── mobile/
│   └── test/
│       ├── setup.ts
│       └── liveprovider.test.ts      ← testes Vitest
├── package.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Como executar localmente

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## Testes

```bash
# Executar testes (modo CI)
npm test

# Modo watch (desenvolvimento)
npm run test:watch
```

Os testes estão em `src/test/liveprovider.test.ts` e cobrem as principais lógicas do `LiveDataProvider`:

- Cálculo de potência distribuída
- Percentual de carga da rede
- Peak Shaving (redução de carregadores em modo eco)
- Faturamento simulado (custo por kWh)
- ETA estimado de sessões
- Load Balancing (aceite de novas sessões)
- Ciclo de vida de sessões
- Cenários integrados

---

## Camada de dados — LiveDataProvider

O Dashboard não possui backend de produção. Os dados são gerados e gerenciados localmente pelo `LiveDataProvider`, que mantém o estado de carregadores, sessões e logs, atualizando a cada ~2 segundos.

> ⚠️ Todos os dados são **simulados localmente**. Os logs com nomenclatura OCPP são gerados no frontend e não representam comunicação OCPP real.

---

## Acesso à versão publicada

O Dashboard está disponível publicamente em:

```
https://goodwe-grid-smart.lovable.app/
```

Para documentação completa do produto, consulte o [`README.md`](../README.md) na raiz do repositório.
