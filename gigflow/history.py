"""History record management for Aditivo GigFlow.

Provides ``make_record`` which serialises the current session state and
calculated values into a plain Python dictionary suitable for JSON
serialisation and persistent storage.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Any

import pandas as pd


def make_record(
    df_calc: pd.DataFrame,
    custo_total: float,
    cache_proposto: float,
    data_validade: date,
    session: dict[str, Any],
) -> dict[str, Any]:
    """Cria um registro de histórico a partir do estado atual da sessão.

    Args:
        df_calc: DataFrame com os itens calculados (inclui coluna "Total (R$)").
        custo_total: Custo total calculado.
        cache_proposto: Cachê proposto (custo + margem).
        data_validade: Data de validade do orçamento.
        session: Dicionário com os dados da sessão (equivalente a
            ``st.session_state``).

    Returns:
        Dicionário serializável em JSON representando a proposta.
    """
    return {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "numero_proposta": session.get("numero_proposta", ""),
        "enviado": bool(session.get("enviado", False)),
        "evento": session.get("nome_evento", ""),
        "data_evento": str(session.get("data_evento", date.today())),
        "cidade": session.get("cidade", ""),
        "custo_total": custo_total,
        "margem_pct": float(session.get("margem_pct", 0.0)),
        "cache_proposto": cache_proposto,
        "validade_ate": str(data_validade),
        "cond_pagto": session.get("forma_pagto", ""),
        "observacoes": session.get("observacoes", ""),
        "contratante": {
            "nome": session.get("contratante_nome", ""),
            "doc": session.get("contratante_doc", ""),
            "email": session.get("contratante_email", ""),
            "tel": session.get("contratante_tel", ""),
            "end": session.get("contratante_end", ""),
        },
        "banda": {
            "razao": session.get("banda_razao", ""),
            "cnpj": session.get("banda_cnpj", ""),
            "resp_legal": session.get("banda_resp_legal", ""),
            "resp_banda": session.get("banda_resp_banda", ""),
        },
        "evento_info": {
            "num_convidados": session.get("num_convidados", 0),
            "hora_montagem": session.get("hora_montagem", ""),
            "hora_show": session.get("hora_show", ""),
            "local_apresentacao": session.get("local_apresentacao", ""),
        },
        "responsabilidades": {
            "banda": session.get("resp_banda", ""),
            "contratante": session.get("resp_contratante", ""),
        },
        "equipe": {
            "integrantes": session.get("num_integrantes", 0),
            "apoio": session.get("num_apoio", 0),
            "acompanhantes": session.get("num_acomp", 0),
        },
        "energia": {
            "tomada": session.get("energia_tomada", ""),
            "tensao": session.get("energia_tensao", ""),
            "aterramento": session.get("energia_aterramento", ""),
            "dist_max": session.get("energia_dist_max", ""),
        },
        "multa_perc": session.get("multa_perc", 0),
        "foro": session.get("foro", ""),
        "itens": df_calc.to_dict(orient="records"),
    }
