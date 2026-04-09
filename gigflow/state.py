"""Session-state management for Rockbuzz GigFlow.

``ensure_state`` is the single entry point that initialises every key in
``st.session_state`` with a sensible default so the rest of the app can
always read those values safely.
"""

from datetime import datetime

import pandas as pd
import streamlit as st

from .data import (
    DEFAULT_BANDA_CNPJ,
    DEFAULT_BANDA_RAZAO,
    DEFAULT_ENERGIA_ATERRAMENTO,
    DEFAULT_ENERGIA_DIST_MAX,
    DEFAULT_ENERGIA_TOMADA,
    DEFAULT_ENERGIA_TENSAO,
    DEFAULT_FORO,
    DEFAULT_FORMA_PAGTO,
    DEFAULT_MARGEM_PCT,
    DEFAULT_MULTA_PERC,
    DEFAULT_RESP_BANDA,
    DEFAULT_RESP_CONTRATANTE,
    DEFAULT_VALIDADE_DIAS,
    default_rows,
)


def ensure_state() -> None:
    """Inicializa o estado da sessão com valores padrão.

    Apenas define uma chave se ela ainda não existir, preservando
    quaisquer valores já definidos pelo usuário.
    """
    defaults: dict = {
        "df": pd.DataFrame(default_rows()),
        "history": [],
        "margem_pct": DEFAULT_MARGEM_PCT,
        "nome_evento": "",
        "data_evento": datetime.today().date(),
        "cidade": "",
        "numero_proposta": datetime.now().strftime("RB-%Y%m%d-%H%M"),
        "validade_dias": DEFAULT_VALIDADE_DIAS,
        "forma_pagto": DEFAULT_FORMA_PAGTO,
        "observacoes": "",
        "enviado": False,
        "contratante_nome": "",
        "contratante_doc": "",
        "contratante_email": "",
        "contratante_tel": "",
        "contratante_end": "",
        "banda_razao": DEFAULT_BANDA_RAZAO,
        "banda_cnpj": DEFAULT_BANDA_CNPJ,
        "banda_resp_legal": "",
        "banda_resp_banda": "",
        "num_convidados": 0,
        "hora_montagem": "",
        "hora_show": "",
        "local_apresentacao": "",
        "resp_banda": DEFAULT_RESP_BANDA,
        "resp_contratante": DEFAULT_RESP_CONTRATANTE,
        "num_integrantes": 0,
        "num_apoio": 0,
        "num_acomp": 0,
        "energia_tomada": DEFAULT_ENERGIA_TOMADA,
        "energia_tensao": DEFAULT_ENERGIA_TENSAO,
        "energia_aterramento": DEFAULT_ENERGIA_ATERRAMENTO,
        "energia_dist_max": DEFAULT_ENERGIA_DIST_MAX,
        "multa_perc": DEFAULT_MULTA_PERC,
        "foro": DEFAULT_FORO,
        "lang": "pt",
        "theme": "dark",
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value
