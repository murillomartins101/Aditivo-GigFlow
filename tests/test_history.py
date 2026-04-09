"""Tests for gigflow.history module."""

from __future__ import annotations

from datetime import date, datetime

import pandas as pd
import pytest

from gigflow.data import default_rows
from gigflow.history import make_record


def _base_session() -> dict:
    """Returns a minimal session dictionary for testing."""
    return {
        "numero_proposta": "RB-20240101-1200",
        "enviado": False,
        "nome_evento": "Teste Evento",
        "data_evento": date(2024, 6, 15),
        "cidade": "Jundiaí/SP",
        "margem_pct": 30.0,
        "forma_pagto": "50% na assinatura",
        "observacoes": "Nenhuma",
        "contratante_nome": "Fulano",
        "contratante_doc": "000.000.000-00",
        "contratante_email": "fulano@example.com",
        "contratante_tel": "11 99999-9999",
        "contratante_end": "Rua A, 1",
        "banda_razao": "Aditivo Media Management",
        "banda_cnpj": "40.157.297/0001-18",
        "banda_resp_legal": "João",
        "banda_resp_banda": "Pedro",
        "num_convidados": 50,
        "hora_montagem": "18:00",
        "hora_show": "21:00",
        "local_apresentacao": "Salão B",
        "resp_banda": "Sonorização",
        "resp_contratante": "Estrutura",
        "num_integrantes": 4,
        "num_apoio": 2,
        "num_acomp": 1,
        "energia_tomada": "20A",
        "energia_tensao": "220V",
        "energia_aterramento": "Adequado",
        "energia_dist_max": "10 metros",
        "multa_perc": 50,
        "foro": "Jundiaí/SP",
    }


def _make_df(custo_unitario: float = 500.0) -> pd.DataFrame:
    rows = default_rows()
    rows[0]["Quantidade"] = 1
    rows[0]["Custo Unitário (R$)"] = custo_unitario
    df = pd.DataFrame(rows)
    df["Total (R$)"] = df["Quantidade"] * df["Custo Unitário (R$)"]
    df["Total (R$)"] = df["Total (R$)"].where(df["Incluir"], 0.0)
    return df


class TestMakeRecord:
    def test_returns_dict(self):
        session = _base_session()
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert isinstance(record, dict)

    def test_has_unique_id(self):
        session = _base_session()
        df = _make_df()
        r1 = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        r2 = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert r1["id"] != r2["id"]

    def test_created_at_is_iso_format(self):
        session = _base_session()
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        # Should not raise
        datetime.fromisoformat(record["created_at"])

    def test_financial_values(self):
        session = _base_session()
        df = _make_df(custo_unitario=1000.0)
        record = make_record(df, 1000.0, 1300.0, date(2024, 6, 22), session)
        assert record["custo_total"] == 1000.0
        assert record["cache_proposto"] == 1300.0
        assert record["margem_pct"] == 30.0

    def test_contratante_fields(self):
        session = _base_session()
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert record["contratante"]["nome"] == "Fulano"
        assert record["contratante"]["doc"] == "000.000.000-00"

    def test_banda_fields(self):
        session = _base_session()
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert record["banda"]["razao"] == "Aditivo Media Management"

    def test_itens_serialised(self):
        session = _base_session()
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert isinstance(record["itens"], list)
        assert len(record["itens"]) == 12

    def test_validade_ate_stored_correctly(self):
        session = _base_session()
        df = _make_df()
        validade = date(2024, 6, 22)
        record = make_record(df, 500.0, 650.0, validade, session)
        assert record["validade_ate"] == str(validade)

    def test_enviado_false_by_default(self):
        session = _base_session()
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert record["enviado"] is False

    def test_enviado_true(self):
        session = _base_session()
        session["enviado"] = True
        df = _make_df()
        record = make_record(df, 500.0, 650.0, date(2024, 6, 22), session)
        assert record["enviado"] is True
