"""Tests for gigflow.state module."""

from unittest.mock import patch

import pandas as pd
import pytest

from gigflow.state import ensure_state

EXPECTED_KEYS = {
    "df",
    "history",
    "margem_pct",
    "nome_evento",
    "data_evento",
    "cidade",
    "numero_proposta",
    "validade_dias",
    "forma_pagto",
    "observacoes",
    "enviado",
    "contratante_nome",
    "contratante_doc",
    "contratante_email",
    "contratante_tel",
    "contratante_end",
    "banda_razao",
    "banda_cnpj",
    "banda_resp_legal",
    "banda_resp_banda",
    "num_convidados",
    "hora_montagem",
    "hora_show",
    "local_apresentacao",
    "resp_banda",
    "resp_contratante",
    "num_integrantes",
    "num_apoio",
    "num_acomp",
    "energia_tomada",
    "energia_tensao",
    "energia_aterramento",
    "energia_dist_max",
    "multa_perc",
    "foro",
    "lang",
    "theme",
}


class TestEnsureState:
    def test_sets_all_expected_keys(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert EXPECTED_KEYS.issubset(mock_state.keys())

    def test_df_is_dataframe(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert isinstance(mock_state["df"], pd.DataFrame)

    def test_df_has_twelve_rows(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert len(mock_state["df"]) == 12

    def test_history_is_empty_list(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["history"] == []

    def test_lang_default_is_pt(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["lang"] == "pt"

    def test_theme_default_is_dark(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["theme"] == "dark"

    def test_does_not_overwrite_existing_theme(self):
        mock_state: dict = {"theme": "light"}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["theme"] == "light"

    def test_enviado_default_is_false(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["enviado"] is False

    def test_numero_proposta_starts_with_rb(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["numero_proposta"].startswith("RB-")

    def test_does_not_overwrite_existing_lang(self):
        mock_state: dict = {"lang": "en"}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["lang"] == "en"

    def test_does_not_overwrite_existing_margem_pct(self):
        mock_state: dict = {"margem_pct": 50.0}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["margem_pct"] == 50.0

    def test_does_not_overwrite_existing_history(self):
        existing_history = [{"id": "abc", "numero_proposta": "RB-001"}]
        mock_state: dict = {"history": existing_history}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["history"] is existing_history

    def test_does_not_overwrite_existing_df(self):
        existing_df = pd.DataFrame([{"col": 1}])
        mock_state: dict = {"df": existing_df}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["df"] is existing_df

    def test_num_convidados_default_is_zero(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["num_convidados"] == 0

    def test_numeric_counts_default_to_zero(self):
        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        for key in ("num_integrantes", "num_apoio", "num_acomp"):
            assert mock_state[key] == 0, f"{key} should default to 0"

    def test_banda_defaults_match_constants(self):
        from gigflow.data import DEFAULT_BANDA_CNPJ, DEFAULT_BANDA_RAZAO

        mock_state: dict = {}
        with patch("streamlit.session_state", mock_state):
            ensure_state()
        assert mock_state["banda_razao"] == DEFAULT_BANDA_RAZAO
        assert mock_state["banda_cnpj"] == DEFAULT_BANDA_CNPJ
