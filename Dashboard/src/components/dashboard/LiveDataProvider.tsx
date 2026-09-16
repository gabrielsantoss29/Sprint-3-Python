import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type ChargerStatus = "available" | "preparing" | "charging" | "finishing" | "faulted";
export type ChargeMode = "eco" | "rapido" | "sustentavel" | "garantido";

export const modeMeta: Record<ChargeMode, { label: string; desc: string; emoji: string; cls: string }> = {
  rapido:      { label: "Rápido",      desc: "Prioridade máxima de potência",      emoji: "⚡", cls: "bg-goodwe-blue/15 text-goodwe-blue border-goodwe-blue/30" },
  eco:         { label: "Econômico",   desc: "Carrega quando a demanda é menor",   emoji: "🌿", cls: "bg-goodwe-green/15 text-goodwe-green border-goodwe-green/30" },
  sustentavel: { label: "Sustentável", desc: "Prioriza energia solar disponível",  emoji: "☀️", cls: "bg-goodwe-orange/15 text-goodwe-orange border-goodwe-orange/30" },
  garantido:   { label: "Garantido",   desc: "Garante % no horário informado",     emoji: "🎯", cls: "bg-primary/15 text-primary border-primary/30" },
};

export interface LiveCharger {
  id: string; name: string; type: "CCS2 DC" | "Type 2 AC" | "CHAdeMO";
  maxPower: number; currentPower: number; status: ChargerStatus;
  user: string | null; vehicle: string | null; pct: number; etaMin: number;
  tariff: number; mode?: ChargeMode | null; departureTime?: string | null; sessionKwh?: number;
}

export interface ActiveSession {
  chargerId: string; userName: string; vehicle: string; targetPct: number;
  departureTime: string; startedAt: number; currentPct: number; currentPower: number;
  elapsedMin: number; estimatedCost: number; kwh: number; priority: ChargeMode;
}

export interface CompletedSession {
  chargerId: string; chargerName: string; userName: string; vehicle: string;
  priority: ChargeMode; kwh: number; cost: number; durationMin: number; completedAt: string;
}

export interface OcppLog {
  id: number; ts: string; level: "INFO" | "ACK" | "WARN" | "ERR"; source: string; msg: string;
}

export interface LoadPoint { t: string; total: number; ev: number; limit: number; }

interface LiveData {
  chargers: LiveCharger[]; logs: OcppLog[]; load: LoadPoint[];
  activeSessions: ActiveSession[]; completedSessions: CompletedSession[];
  startSession: (chargerId: string, session: Omit<ActiveSession, "chargerId"|"startedAt"|"currentPct"|"currentPower"|"elapsedMin"|"estimatedCost"|"kwh">) => void;
  endSession: (chargerId: string) => void;
  applyPeakShaving: () => void; peakShavingActive: boolean;
  totals: { kwhToday: number; revenueToday: number; activeSessions: number; networkLoadPct: number; distributedPower: number; networkLimit: number; };
}

const Ctx = createContext<LiveData | null>(null);
const NETWORK_LIMIT = 200; // kW — limite da rede no cenário Dashboard

function now(offsetSec = 0): string {
  const d = new Date(Date.now() + offsetSec * 1000);
  return d.toLocaleTimeString("pt-BR", { hour12: false });
}

const seedChargers: LiveCharger[] = [
  { id: "CG-001", name: "Centro #1",   type: "Type 2 AC", maxPower: 22, currentPower: 14,  status: "charging",  user: "João S.",   vehicle: "BYD Dolphin",   pct: 68, etaMin: 22, tariff: 2.15, mode: "rapido",      departureTime: "18:30", sessionKwh: 9.8  },
  { id: "CG-002", name: "Centro #2",   type: "Type 2 AC", maxPower: 22, currentPower: 0,   status: "available", user: null,        vehicle: null,            pct: 0,  etaMin: 0,  tariff: 2.15, mode: null,          departureTime: null,    sessionKwh: 0    },
  { id: "CG-003", name: "Centro #3",   type: "Type 2 AC", maxPower: 22, currentPower: 11,  status: "charging",  user: "Carlos R.", vehicle: "Volvo XC40",    pct: 42, etaMin: 48, tariff: 1.89, mode: "eco",         departureTime: "19:00", sessionKwh: 6.2  },
  { id: "CG-004", name: "Centro #4",   type: "Type 2 AC", maxPower: 22, currentPower: 0,   status: "available", user: null,        vehicle: null,            pct: 0,  etaMin: 0,  tariff: 2.35, mode: null,          departureTime: null,    sessionKwh: 0    },
  { id: "CG-005", name: "Iguatemi #1", type: "Type 2 AC", maxPower: 22, currentPower: 0,   status: "faulted",   user: null,        vehicle: null,            pct: 0,  etaMin: 0,  tariff: 1.89, mode: null,          departureTime: null,    sessionKwh: 0    },
  { id: "CG-006", name: "Iguatemi #2", type: "Type 2 AC", maxPower: 22, currentPower: 18,  status: "charging",  user: "Maria L.",  vehicle: "GWM Ora 03",    pct: 85, etaMin: 8,  tariff: 2.35, mode: "sustentavel", departureTime: "16:20", sessionKwh: 14.1 },
  { id: "CG-007", name: "Paulista #1", type: "Type 2 AC", maxPower: 22, currentPower: 20,  status: "charging",  user: "Ana P.",    vehicle: "Tesla Model 3", pct: 31, etaMin: 38, tariff: 2.49, mode: "rapido",      departureTime: "18:00", sessionKwh: 8.4  },
  { id: "CG-008", name: "Paulista #2", type: "Type 2 AC", maxPower: 22, currentPower: 0,   status: "available", user: null,        vehicle: null,            pct: 0,  etaMin: 0,  tariff: 1.89, mode: null,          departureTime: null,    sessionKwh: 0    },
];

const initialLogs: OcppLog[] = [
  { id: 1, ts: now(-12), level: "INFO", source: "CG-007", msg: "BootNotification → vendor=GoodWe model=HCharge-150" },
  { id: 2, ts: now(-10), level: "ACK",  source: "CSMS",   msg: "Accepted heartbeatInterval=30s" },
  { id: 3, ts: now(-8),  level: "INFO", source: "CG-001", msg: "StartTransaction idTag=USR-1042 meterStart=18472" },
  { id: 4, ts: now(-6),  level: "INFO", source: "LB-CORE",msg: "LoadBalancing → redistribute 12kW from CG-004 to CG-007" },
  { id: 5, ts: now(-4),  level: "WARN", source: "LB-CORE",msg: "Demand 192kW approaching limit 200kW (96%)" },
  { id: 6, ts: now(-2),  level: "ACK",  source: "CG-006", msg: "StatusNotification status=Charging errorCode=NoError" },
];

const sources = ["CG-001","CG-003","CG-004","CG-006","CG-007","LB-CORE","CSMS"];
const templates: { level: OcppLog["level"]; msg: (s: string) => string }[] = [
  { level: "INFO", msg: () => `MeterValues energy.active.import.register=${(Math.random()*40000+5000).toFixed(0)}Wh` },
  { level: "ACK",  msg: () => `Heartbeat → currentTime=${new Date().toISOString()}` },
  { level: "INFO", msg: () => `LoadBalancing → setChargingProfile limit=${(Math.random()*60+20).toFixed(1)}kW` },
  { level: "INFO", msg: (s) => `StatusNotification status=${["Charging","Preparing","SuspendedEV"][Math.floor(Math.random()*3)]} on ${s}` },
  { level: "WARN", msg: () => `Peak shaving triggered → reducing fleet output by 12%` },
  { level: "INFO", msg: () => `StopTransaction reason=Local meterStop=${(Math.random()*40000+10000).toFixed(0)}Wh` },
  { level: "ACK",  msg: () => `Authorize idTag=USR-${Math.floor(Math.random()*9999)} → Accepted` },
];

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const existing = useContext(Ctx);
  if (existing) return <>{children}</>;
  return <LiveDataRoot>{children}</LiveDataRoot>;
}

function LiveDataRoot({ children }: { children: ReactNode }) {
  const [chargers, setChargers] = useState<LiveCharger[]>(seedChargers);
  const [logs, setLogs] = useState<OcppLog[]>(initialLogs);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [peakShavingActive, setPeakShavingActive] = useState(false);
  const shavingRef = useRef(false);
  const [load, setLoad] = useState<LoadPoint[]>(() => {
    const arr: LoadPoint[] = [];
    for (let i = 15; i >= 0; i--) {
      const buildingBase = 120;
      const evLoad = 40 + Math.sin(i / 3) * 15 + Math.random() * 10;
      const total = Math.min(195, buildingBase + evLoad);
      arr.push({ t: new Date(Date.now() - i * 60_000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), total: Math.round(total), ev: Math.round(evLoad), limit: NETWORK_LIMIT });
    }
    return arr;
  });
  const [revenueToday, setRevenueToday] = useState(2681);
  const [kwhToday, setKwhToday] = useState(1247);
  const logId = useRef(initialLogs.length);

  const pushLog = (level: OcppLog["level"], source: string, msg: string) => {
    logId.current += 1;
    setLogs((prev) => [...prev.slice(-49), { id: logId.current, ts: new Date().toLocaleTimeString("pt-BR", { hour12: false }), level, source, msg }]);
  };

  const startSession: LiveData["startSession"] = (chargerId, session) => {
    setChargers((prev) => prev.map((c) => c.id === chargerId ? { ...c, status: "preparing", user: session.userName, vehicle: session.vehicle, mode: session.priority, departureTime: session.departureTime, pct: 5, sessionKwh: 0, currentPower: Math.min(22, c.maxPower * (session.priority === "rapido" ? 0.85 : session.priority === "eco" ? 0.4 : 0.6)), etaMin: 45 } : c));
    pushLog("INFO", chargerId, `StartTransaction idTag=APP-MOBILE meterStart=0 priority=${session.priority}`);
    setActiveSessions((prev) => [...prev.filter((s) => s.chargerId !== chargerId), { ...session, chargerId, startedAt: Date.now(), currentPct: 5, currentPower: 0, elapsedMin: 0, estimatedCost: 0, kwh: 0 }]);
    setTimeout(() => { setChargers((prev) => prev.map((c) => c.id === chargerId ? { ...c, status: "charging" } : c)); pushLog("ACK", chargerId, "StatusNotification status=Charging errorCode=NoError"); }, 2000);
  };

  const endSession = (chargerId: string) => {
    const session = activeSessions.find((s) => s.chargerId === chargerId);
    const charger = chargers.find((c) => c.id === chargerId);
    if (session && charger) {
      setCompletedSessions((prev) => [{ chargerId, chargerName: charger.name, userName: session.userName, vehicle: session.vehicle, priority: session.priority, kwh: parseFloat(session.kwh.toFixed(2)), cost: parseFloat(session.estimatedCost.toFixed(2)), durationMin: session.elapsedMin, completedAt: new Date().toLocaleString("pt-BR") }, ...prev]);
    }
    setChargers((prev) => prev.map((c) => c.id === chargerId ? { ...c, status: "finishing", currentPower: 0, etaMin: 0 } : c));
    pushLog("INFO", chargerId, "StopTransaction reason=Remote idTag=APP-MOBILE");
    setActiveSessions((prev) => prev.filter((s) => s.chargerId !== chargerId));
  };

  const applyPeakShaving = () => {
    if (shavingRef.current) return;
    shavingRef.current = true; setPeakShavingActive(true);
    setChargers((prev) => prev.map((c) => c.mode === "eco" && c.status === "charging" ? { ...c, currentPower: c.maxPower * 0.6 } : c));
    pushLog("WARN", "LB-CORE", "PeakShaving → setChargingProfile 60% on mode=eco chargers (30s)");
    setTimeout(() => { shavingRef.current = false; setPeakShavingActive(false); pushLog("ACK", "LB-CORE", "PeakShaving window expired → restoring nominal profiles"); }, 30000);
  };

  useEffect(() => {
    const tick = setInterval(() => {
      let snapshot: LiveCharger[] = [];
      setChargers((prev) => (snapshot = prev.map((c) => {
        if (c.status === "charging") {
          const newPct = Math.min(100, c.pct + Math.random() * 1.2);
          const cap = Math.min(22, shavingRef.current && c.mode === "eco" ? c.maxPower * 0.6 : c.maxPower);
          const newPower = Math.max(1, Math.min(cap, c.currentPower + (Math.random() - 0.5) * 4));
          const kwh = (c.sessionKwh ?? 0) + (newPower * 2) / 3600;
          if (newPct >= 100) return { ...c, pct: 100, currentPower: 0, status: "finishing" as ChargerStatus, etaMin: 0, sessionKwh: kwh };
          return { ...c, pct: newPct, currentPower: newPower, etaMin: Math.max(0, Math.round((100 - newPct) * 0.6)), sessionKwh: kwh };
        }
        if (c.status === "preparing" && Math.random() < 0.35) return { ...c, status: "charging" as ChargerStatus, pct: Math.max(6, c.pct) };
        if (c.status === "finishing" && Math.random() < 0.3) return { ...c, status: "available" as ChargerStatus, user: null, vehicle: null, pct: 0, currentPower: 0, mode: null, departureTime: null, sessionKwh: 0 };
        if (c.status === "available" && Math.random() < 0.08) {
          if (prev.filter((x) => x.id !== c.id && x.status === "available").length < 2) return c;
          const names = ["Lucas T.", "Bruno F.", "Camila V.", "Renata B."];
          const cars = ["Renault Kwid E-Tech", "Fiat 500e", "Peugeot e-208", "Nissan Leaf"];
          const modes: ChargeMode[] = ["eco", "rapido", "sustentavel", "garantido"];
          return { ...c, status: "preparing" as ChargerStatus, user: names[Math.floor(Math.random()*names.length)], vehicle: cars[Math.floor(Math.random()*cars.length)], mode: modes[Math.floor(Math.random()*modes.length)], departureTime: ["17:30","18:00","18:30","19:15"][Math.floor(Math.random()*4)], currentPower: Math.min(22, c.maxPower * 0.4), pct: 2, etaMin: 60, sessionKwh: 0 };
        }
        return c;
      })));
      setActiveSessions((prev) => prev.map((s) => { const c = snapshot.find((x) => x.id === s.chargerId); if (!c) return s; const kwh = c.sessionKwh ?? s.kwh; return { ...s, currentPct: c.pct, currentPower: c.currentPower, elapsedMin: Math.max(0, Math.round((Date.now()-s.startedAt)/60000)), kwh, estimatedCost: kwh * c.tariff }; }));
      setLoad((prev) => { const buildingBase = 120; const evContrib = snapshot.reduce((s,c) => s+c.currentPower, 0); const evCapped = Math.min(evContrib, NETWORK_LIMIT-buildingBase-5); return [...prev.slice(-19), { t: new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}), total: Math.round(buildingBase+evCapped), ev: Math.round(evCapped), limit: NETWORK_LIMIT }]; });
      setRevenueToday((r) => r + Math.random() * 4 + 1);
      setKwhToday((k) => k + Math.random() * 2 + 0.5);
      if (Math.random() < 0.7) { const tpl = templates[Math.floor(Math.random()*templates.length)]; const src = sources[Math.floor(Math.random()*sources.length)]; logId.current += 1; setLogs((prev) => [...prev.slice(-49), { id: logId.current, ts: new Date().toLocaleTimeString("pt-BR",{hour12:false}), level: tpl.level, source: src, msg: tpl.msg(src) }]); }
    }, 2000);
    return () => clearInterval(tick);
  }, []);

  const distributedPower = chargers.reduce((s,c) => s+c.currentPower, 0);
  const value: LiveData = { chargers, logs, load, activeSessions, completedSessions, startSession, endSession, applyPeakShaving, peakShavingActive, totals: { kwhToday: Math.round(kwhToday), revenueToday: Math.round(revenueToday), activeSessions: chargers.filter(c=>c.status==="charging"||c.status==="preparing").length, networkLoadPct: Math.min(100,(distributedPower/NETWORK_LIMIT)*100), distributedPower: Math.round(distributedPower*10)/10, networkLimit: NETWORK_LIMIT } };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLiveData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLiveData must be used within LiveDataProvider");
  return v;
}

export const statusMeta: Record<ChargerStatus, { label: string; cls: string; dot: string }> = {
  available: { label: "Disponível", cls: "bg-goodwe-green/15 text-goodwe-green border-goodwe-green/30", dot: "text-goodwe-green" },
  preparing: { label: "Preparando", cls: "bg-goodwe-orange/15 text-goodwe-orange border-goodwe-orange/30", dot: "text-goodwe-orange" },
  charging:  { label: "Carregando", cls: "bg-goodwe-blue/15 text-goodwe-blue border-goodwe-blue/30", dot: "text-goodwe-blue" },
  finishing: { label: "Concluído",  cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "text-emerald-400" },
  faulted:   { label: "Falha",      cls: "bg-primary/15 text-primary border-primary/30", dot: "text-primary" },
};
