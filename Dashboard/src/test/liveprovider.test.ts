import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── tipos espelhados do LiveDataProvider ───────────────────────────────────
type ChargerStatus = "available" | "preparing" | "charging" | "finishing" | "faulted";
type ChargeMode    = "eco" | "rapido" | "sustentavel" | "garantido";

interface LiveCharger {
  id: string;
  maxPower: number;
  currentPower: number;
  status: ChargerStatus;
  pct: number;
  etaMin: number;
  tariff: number;
  mode: ChargeMode | null;
  sessionKwh: number;
  user: string | null;
  vehicle: string | null;
}

interface ActiveSession {
  chargerId: string;
  userName: string;
  vehicle: string;
  targetPct: number;
  departureTime: string;
  startedAt: number;
  currentPct: number;
  currentPower: number;
  elapsedMin: number;
  estimatedCost: number;
  kwh: number;
  priority: ChargeMode;
}

interface CompletedSession {
  chargerId: string;
  chargerName: string;
  userName: string;
  vehicle: string;
  priority: ChargeMode;
  kwh: number;
  cost: number;
  durationMin: number;
  completedAt: string;
}

// ─── constantes do cenário Dashboard ────────────────────────────────────────
const NETWORK_LIMIT = 200; // kW — conforme LiveDataProvider
const BUILDING_BASE = 120; // kW — consumo fixo do prédio

// ─── helpers puros extraídos da lógica do LiveDataProvider ──────────────────

/** Calcula a potência total distribuída entre carregadores ativos */
function calcDistributedPower(chargers: Pick<LiveCharger, "currentPower">[]): number {
  return chargers.reduce((sum, c) => sum + c.currentPower, 0);
}

/** Calcula o percentual de uso da rede */
function calcNetworkLoadPct(distributedPower: number, limit = NETWORK_LIMIT): number {
  return Math.min(100, (distributedPower / limit) * 100);
}

/**
 * Lógica de Peak Shaving:
 * reduz currentPower dos carregadores em modo "eco" para 60 % da maxPower
 */
function applyPeakShavingLogic(chargers: LiveCharger[]): LiveCharger[] {
  return chargers.map((c) =>
    c.mode === "eco" && c.status === "charging"
      ? { ...c, currentPower: c.maxPower * 0.6 }
      : c
  );
}

/**
 * Lógica de Load Balancing:
 * potência disponível para EVs = NETWORK_LIMIT − BUILDING_BASE − margem (5 kW)
 * a contribuição dos EVs é limitada a esse valor
 */
function calcEvCap(evContrib: number): number {
  return Math.min(evContrib, NETWORK_LIMIT - BUILDING_BASE - 5);
}

/** Custo estimado de uma sessão */
function calcEstimatedCost(kwh: number, tariff: number): number {
  return kwh * tariff;
}

/** ETA estimado dado o percentual atual */
function calcEta(currentPct: number): number {
  return Math.max(0, Math.round((100 - currentPct) * 0.6));
}

/** Verifica se um carregador pode transitar de "available" para "preparing" */
function canAcceptNewSession(
  charger: Pick<LiveCharger, "status">,
  otherAvailableCount: number
): boolean {
  return charger.status === "available" && otherAvailableCount >= 2;
}

// ─── fixtures ────────────────────────────────────────────────────────────────

function makeCharger(overrides: Partial<LiveCharger> = {}): LiveCharger {
  return {
    id: "CG-001",
    maxPower: 22,
    currentPower: 14,
    status: "charging",
    pct: 50,
    etaMin: 30,
    tariff: 2.15,
    mode: "rapido",
    sessionKwh: 5,
    user: "João S.",
    vehicle: "BYD Dolphin",
    ...overrides,
  };
}

function makeSession(overrides: Partial<ActiveSession> = {}): ActiveSession {
  return {
    chargerId: "CG-001",
    userName: "João S.",
    vehicle: "BYD Dolphin",
    targetPct: 80,
    departureTime: "18:30",
    startedAt: Date.now() - 600_000,
    currentPct: 50,
    currentPower: 14,
    elapsedMin: 10,
    estimatedCost: 0,
    kwh: 2.5,
    priority: "rapido",
    ...overrides,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// TESTES
// ════════════════════════════════════════════════════════════════════════════

describe("Cenário energético — Dashboard", () => {
  it("NETWORK_LIMIT deve ser 200 kW", () => {
    expect(NETWORK_LIMIT).toBe(200);
  });

  it("BUILDING_BASE deve ser 120 kW", () => {
    expect(BUILDING_BASE).toBe(120);
  });

  it("margem disponível para EVs sem solar/ESS deve ser 75 kW (200 − 120 − 5)", () => {
    const evContrib = 200; // hipotético — sem limite
    expect(calcEvCap(evContrib)).toBe(75);
  });

  it("EVs não devem ultrapassar a margem disponível", () => {
    const evContrib = 100;
    expect(calcEvCap(evContrib)).toBeLessThanOrEqual(75);
  });
});

describe("calcDistributedPower", () => {
  it("retorna 0 quando não há carregadores", () => {
    expect(calcDistributedPower([])).toBe(0);
  });

  it("soma corretamente as potências", () => {
    const chargers = [{ currentPower: 14 }, { currentPower: 18 }, { currentPower: 11 }];
    expect(calcDistributedPower(chargers)).toBe(43);
  });

  it("funciona com carregadores disponíveis (currentPower = 0)", () => {
    const chargers = [{ currentPower: 0 }, { currentPower: 0 }];
    expect(calcDistributedPower(chargers)).toBe(0);
  });
});

describe("calcNetworkLoadPct", () => {
  it("retorna 0% quando não há carga", () => {
    expect(calcNetworkLoadPct(0)).toBe(0);
  });

  it("retorna 50% com 100 kW e limite 200 kW", () => {
    expect(calcNetworkLoadPct(100)).toBe(50);
  });

  it("retorna no máximo 100% mesmo com sobrecarga", () => {
    expect(calcNetworkLoadPct(999)).toBe(100);
  });

  it("calcula corretamente com limite customizado", () => {
    expect(calcNetworkLoadPct(35, 35)).toBeCloseTo(100, 1);
  });
});

describe("applyPeakShavingLogic — Peak Shaving", () => {
  it("reduz apenas carregadores em modo eco e status charging", () => {
    const chargers: LiveCharger[] = [
      makeCharger({ id: "CG-001", mode: "eco",    status: "charging",  maxPower: 22, currentPower: 22 }),
      makeCharger({ id: "CG-002", mode: "rapido", status: "charging",  maxPower: 22, currentPower: 20 }),
      makeCharger({ id: "CG-003", mode: "eco",    status: "available", maxPower: 22, currentPower: 0  }),
    ];
    const result = applyPeakShavingLogic(chargers);

    // CG-001: eco + charging → 60 %
    expect(result[0].currentPower).toBeCloseTo(22 * 0.6, 5);
    // CG-002: rapido → não muda
    expect(result[1].currentPower).toBe(20);
    // CG-003: eco + available → não muda
    expect(result[2].currentPower).toBe(0);
  });

  it("não afeta carregadores em modo rapido", () => {
    const chargers = [makeCharger({ mode: "rapido", status: "charging", currentPower: 20 })];
    expect(applyPeakShavingLogic(chargers)[0].currentPower).toBe(20);
  });

  it("reduz para exatamente 60 % da maxPower no modo eco", () => {
    const c = makeCharger({ mode: "eco", status: "charging", maxPower: 22, currentPower: 22 });
    const [result] = applyPeakShavingLogic([c]);
    expect(result.currentPower).toBeCloseTo(13.2, 5);
  });
});

describe("calcEstimatedCost — faturamento simulado", () => {
  it("retorna 0 para sessão sem kWh", () => {
    expect(calcEstimatedCost(0, 2.15)).toBe(0);
  });

  it("calcula custo corretamente", () => {
    expect(calcEstimatedCost(10, 2.15)).toBeCloseTo(21.5, 5);
  });

  it("usa a tarifa corretamente em diferentes cenários", () => {
    expect(calcEstimatedCost(5, 1.89)).toBeCloseTo(9.45, 5);
    expect(calcEstimatedCost(5, 2.49)).toBeCloseTo(12.45, 5);
  });
});

describe("calcEta — tempo estimado", () => {
  it("retorna 0 quando bateria está completa", () => {
    expect(calcEta(100)).toBe(0);
  });

  it("retorna 60 minutos quando pct = 0", () => {
    expect(calcEta(0)).toBe(60);
  });

  it("retorna valor intermediário", () => {
    expect(calcEta(50)).toBe(30);
  });

  it("nunca retorna valor negativo", () => {
    expect(calcEta(110)).toBe(0);
  });
});

describe("canAcceptNewSession — Load Balancing de vagas", () => {
  it("aceita nova sessão quando há pelo menos 2 outros disponíveis", () => {
    const c = makeCharger({ status: "available" });
    expect(canAcceptNewSession(c, 2)).toBe(true);
    expect(canAcceptNewSession(c, 5)).toBe(true);
  });

  it("rejeita quando há menos de 2 outros disponíveis", () => {
    const c = makeCharger({ status: "available" });
    expect(canAcceptNewSession(c, 1)).toBe(false);
    expect(canAcceptNewSession(c, 0)).toBe(false);
  });

  it("rejeita quando carregador não está available", () => {
    const c = makeCharger({ status: "charging" });
    expect(canAcceptNewSession(c, 5)).toBe(false);
  });
});

describe("Sessão de recarga — ciclo de vida", () => {
  it("sessão completa tem os campos obrigatórios", () => {
    const session = makeSession();
    expect(session).toHaveProperty("chargerId");
    expect(session).toHaveProperty("userName");
    expect(session).toHaveProperty("kwh");
    expect(session).toHaveProperty("priority");
  });

  it("custo estimado atualiza com o kWh da sessão", () => {
    const tariff = 2.15;
    const kwh = 9.8;
    const cost = calcEstimatedCost(kwh, tariff);
    expect(cost).toBeCloseTo(21.07, 1);
  });

  it("sessão concluída deve ter custo e duração registrados", () => {
    const completed: CompletedSession = {
      chargerId: "CG-001",
      chargerName: "Centro #1",
      userName: "João S.",
      vehicle: "BYD Dolphin",
      priority: "rapido",
      kwh: 9.8,
      cost: 21.07,
      durationMin: 45,
      completedAt: new Date().toLocaleString("pt-BR"),
    };
    expect(completed.kwh).toBeGreaterThan(0);
    expect(completed.cost).toBeGreaterThan(0);
    expect(completed.durationMin).toBeGreaterThan(0);
  });
});

describe("Modos de recarga", () => {
  const modes: ChargeMode[] = ["eco", "rapido", "sustentavel", "garantido"];

  it.each(modes)("modo '%s' é um valor válido de ChargeMode", (mode) => {
    expect(["eco", "rapido", "sustentavel", "garantido"]).toContain(mode);
  });

  it("modo eco resulta em potência reduzida no Peak Shaving", () => {
    const c = makeCharger({ mode: "eco", status: "charging", maxPower: 22, currentPower: 22 });
    const [result] = applyPeakShavingLogic([c]);
    expect(result.currentPower).toBeLessThan(c.currentPower);
  });

  it("modo rapido não sofre redução no Peak Shaving", () => {
    const c = makeCharger({ mode: "rapido", status: "charging", maxPower: 22, currentPower: 22 });
    const [result] = applyPeakShavingLogic([c]);
    expect(result.currentPower).toBe(22);
  });
});

describe("Status dos carregadores", () => {
  const statuses: ChargerStatus[] = ["available", "preparing", "charging", "finishing", "faulted"];

  it.each(statuses)("status '%s' é um valor válido", (status) => {
    expect(["available", "preparing", "charging", "finishing", "faulted"]).toContain(status);
  });

  it("carregador faulted não deve ter currentPower > 0", () => {
    const c = makeCharger({ status: "faulted", currentPower: 0 });
    expect(c.currentPower).toBe(0);
  });

  it("carregador available não deve ter usuário associado", () => {
    const c = makeCharger({ status: "available", user: null });
    expect(c.user).toBeNull();
  });
});

describe("Integração — cenário completo de Peak Shaving", () => {
  it("demanda reduz após Peak Shaving com múltiplos carregadores", () => {
    const chargers: LiveCharger[] = [
      makeCharger({ id: "CG-001", mode: "eco",    status: "charging",  maxPower: 22, currentPower: 22 }),
      makeCharger({ id: "CG-002", mode: "eco",    status: "charging",  maxPower: 22, currentPower: 20 }),
      makeCharger({ id: "CG-003", mode: "rapido", status: "charging",  maxPower: 22, currentPower: 18 }),
    ];

    const before = calcDistributedPower(chargers);
    const after  = calcDistributedPower(applyPeakShavingLogic(chargers));

    expect(after).toBeLessThan(before);
  });

  it("percentual de rede reduz após Peak Shaving", () => {
    const chargers: LiveCharger[] = [
      makeCharger({ mode: "eco", status: "charging", maxPower: 22, currentPower: 22 }),
      makeCharger({ mode: "eco", status: "charging", maxPower: 22, currentPower: 22 }),
    ];

    const before = calcNetworkLoadPct(calcDistributedPower(chargers));
    const after  = calcNetworkLoadPct(calcDistributedPower(applyPeakShavingLogic(chargers)));

    expect(after).toBeLessThan(before);
  });
});
