"""Script executavel de demonstracao do ChargeGrid (cenario do Eletroposto 3D).

Roda uma sessao de recarga simulada no terminal, imprimindo logs no estilo
OCPP (BootNotification, Authorize, StartTransaction, MeterValues,
StatusNotification, StopTransaction) e demonstrando Load Balancing e
Peak Shaving em acao. Nao ha comunicacao OCPP real, hardware fisico ou
pagamento real - tudo aqui e simulado para fins academicos.

Uso:
    python src/simulador/chargegrid_simulador.py
"""

import time
from datetime import datetime, timedelta

from chargegrid_engine import (
    CenarioEletroposto,
    Veiculo,
    aplicar_peak_shaving,
    balancear_carga,
    geracao_solar_kw,
    potencia_disponivel_kw,
    potencia_ess_kw,
)

PASSOS_SIMULACAO = 8
VELOCIDADE_SIMULACAO = 60  # minutos simulados por passo, conforme Eletroposto 3D


def log(inicio: datetime, passo: int, acao: str, mensagem: str) -> None:
    timestamp = inicio + timedelta(minutes=passo * VELOCIDADE_SIMULACAO)
    print(f"[{timestamp.strftime('%H:%M:%S')}] {acao:<20} {mensagem}")


def main() -> None:
    cenario = CenarioEletroposto()
    veiculos = [
        Veiculo(id="EV01", potencia_max_kw=18.0),
        Veiculo(id="EV02", potencia_max_kw=12.0),
        Veiculo(id="EV03-Fast", potencia_max_kw=28.0),
    ]
    soc_atual = cenario.ess_soc_inicial
    inicio = datetime.now()

    print("=" * 72)
    print("GoodWe ChargeGrid Intelligence - Simulador de sessao (Eletroposto 3D)")
    print("Cenario: rede 35 kW | predio 32 kW | ESS 60 kWh (SOC inicial 72%)")
    print("=" * 72)

    log(inicio, 0, "BootNotification", "Eletroposto conectado - status: Available")
    log(inicio, 0, "Authorize", "Usuario identificado - sessao autorizada")
    log(inicio, 0, "StartTransaction", "Modo selecionado: EV03-Fast (28 kW) - conector liberado")

    for passo in range(1, PASSOS_SIMULACAO + 1):
        solar = round(geracao_solar_kw(passo), 2)
        ess = round(potencia_ess_kw(soc_atual, cenario, demanda_excedente_kw=15.0), 2)
        disponivel = round(potencia_disponivel_kw(cenario, solar, ess), 2)

        demanda_total = sum(v.potencia_max_kw for v in veiculos)
        potencia_ajustada, peak_shaving_acionado = aplicar_peak_shaving(demanda_total, disponivel)
        balancear_carga(potencia_ajustada, veiculos)

        if ess > 0:
            soc_atual = max(0.0, soc_atual - 0.03)

        alocacao = ", ".join(f"{v.id}={v.potencia_alocada_kw:.1f}kW" for v in veiculos)
        log(inicio, passo, "MeterValues",
            f"solar={solar:.1f}kW ess={ess:.1f}kW disponivel={disponivel:.1f}kW | {alocacao}")

        if peak_shaving_acionado:
            log(inicio, passo, "StatusNotification",
                f"Peak Shaving ACIONADO - demanda {demanda_total:.1f}kW > disponivel {disponivel:.1f}kW "
                f"-> potencia total reduzida para {potencia_ajustada:.1f}kW")
        else:
            log(inicio, passo, "StatusNotification", "Load Balancing normal - sem reducao de pico")

        time.sleep(0.3)

    log(inicio, PASSOS_SIMULACAO + 1, "StopTransaction", "Sessao encerrada pelo usuario")
    log(inicio, PASSOS_SIMULACAO + 1, "StatusNotification", "Conector devolvido - trava reativada")

    print("=" * 72)
    print("Fim da simulacao. Todos os valores acima sao simulados (sem hardware real).")
    print("=" * 72)


if __name__ == "__main__":
    main()
