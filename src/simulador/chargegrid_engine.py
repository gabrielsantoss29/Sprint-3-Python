"""Logica pura de gerenciamento energetico do ChargeGrid (cenario do Eletroposto 3D).

Todas as funcoes sao independentes de I/O e podem ser importadas e testadas
isoladamente. Nenhum valor aqui representa medicao real - e um modelo
simulado para fins academicos (GoodWe Challenge 2026 - FIAP - Sprint 3).
"""

from dataclasses import dataclass, field
from typing import List, Tuple
import math


@dataclass
class Veiculo:
    id: str
    potencia_max_kw: float
    potencia_alocada_kw: float = 0.0


@dataclass
class CenarioEletroposto:
    limite_rede_kw: float = 35.0
    consumo_predio_kw: float = 32.0
    ess_capacidade_kwh: float = 60.0
    ess_soc_inicial: float = 0.72
    ess_potencia_max_kw: float = 15.0


def geracao_solar_kw(passo: int, pico_kw: float = 10.0, duracao_passos: int = 20) -> float:
    """Perfil solar simulado (meia senoide) ao longo da sessao de recarga."""
    fase = min(passo / duracao_passos, 1.0)
    return max(0.0, pico_kw * math.sin(fase * math.pi))


def potencia_ess_kw(soc_atual: float, cenario: CenarioEletroposto, demanda_excedente_kw: float) -> float:
    """Potencia que o Battery ESS pode fornecer para complementar a rede."""
    if demanda_excedente_kw <= 0 or soc_atual <= 0.1:
        return 0.0
    return min(cenario.ess_potencia_max_kw, demanda_excedente_kw)


def potencia_disponivel_kw(cenario: CenarioEletroposto, geracao_solar: float, potencia_ess: float) -> float:
    """Potencia disponivel para os carregadores = (rede - consumo do predio) + solar + ESS."""
    return (cenario.limite_rede_kw - cenario.consumo_predio_kw) + geracao_solar + potencia_ess


def balancear_carga(potencia_disponivel: float, veiculos: List[Veiculo]) -> List[Veiculo]:
    """Load Balancing: distribui a potencia disponivel entre os veiculos conectados."""
    demanda_total = sum(v.potencia_max_kw for v in veiculos)

    if potencia_disponivel <= 0 or demanda_total == 0:
        for v in veiculos:
            v.potencia_alocada_kw = 0.0
        return veiculos

    if demanda_total <= potencia_disponivel:
        for v in veiculos:
            v.potencia_alocada_kw = v.potencia_max_kw
        return veiculos

    fator = potencia_disponivel / demanda_total
    for v in veiculos:
        v.potencia_alocada_kw = round(v.potencia_max_kw * fator, 2)
    return veiculos


def aplicar_peak_shaving(demanda_total_kw: float, limite_kw: float, margem_seguranca: float = 0.9) -> Tuple[float, bool]:
    """Peak Shaving: quando a demanda supera o limite disponivel, reduz a potencia total
    alocavel para uma margem de seguranca abaixo desse limite (nunca ultrapassando-o)."""
    limite_seguro = round(limite_kw * margem_seguranca, 2)
    if demanda_total_kw > limite_seguro:
        return limite_seguro, True
    return demanda_total_kw, False
