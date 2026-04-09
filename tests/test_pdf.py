"""Tests for gigflow.pdf module."""

from datetime import date
from io import BytesIO

import pandas as pd
import pytest

from gigflow.data import default_rows
from gigflow.pdf import gerar_pdf_contrato, gerar_pdf_orcamento


def _base_session() -> dict:
    """Returns a complete session dictionary for PDF generation tests."""
    return {
        "numero_proposta": "RB-20240101-1200",
        "enviado": False,
        "nome_evento": "Teste Evento",
        "data_evento": date(2024, 6, 15),
        "data_validade": date(2024, 6, 22),
        "cidade": "Jundiaí/SP",
        "margem_pct": 30.0,
        "validade_dias": 7,
        "forma_pagto": "50% na assinatura",
        "observacoes": "Nenhuma observação",
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


class TestGerarPdfOrcamento:
    def test_returns_bytesio(self):
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, _base_session())
        assert isinstance(result, BytesIO)

    def test_pdf_has_content(self):
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, _base_session())
        assert len(result.read()) > 0

    def test_pdf_starts_with_pdf_header(self):
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, _base_session())
        assert result.read(4) == b"%PDF"

    def test_buffer_seeked_to_start(self):
        """Callers must be able to read the buffer directly from position 0."""
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, _base_session())
        assert result.tell() == 0

    def test_works_with_empty_observacoes(self):
        session = _base_session()
        session["observacoes"] = ""
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, session)
        assert isinstance(result, BytesIO)

    def test_works_when_enviado_is_true(self):
        session = _base_session()
        session["enviado"] = True
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, session)
        assert isinstance(result, BytesIO)

    def test_works_with_zero_costs(self):
        result = gerar_pdf_orcamento(_make_df(0.0), 0.0, 0.0, 0.0, _base_session())
        assert isinstance(result, BytesIO)

    def test_works_with_missing_optional_session_keys(self):
        """PDF should generate even when optional session keys are absent."""
        session = {"data_evento": date(2024, 6, 15), "data_validade": date(2024, 6, 22)}
        result = gerar_pdf_orcamento(_make_df(), 500.0, 150.0, 650.0, session)
        assert isinstance(result, BytesIO)

    def test_each_call_produces_independent_buffer(self):
        df = _make_df()
        session = _base_session()
        buf1 = gerar_pdf_orcamento(df, 500.0, 150.0, 650.0, session)
        buf2 = gerar_pdf_orcamento(df, 500.0, 150.0, 650.0, session)
        assert buf1 is not buf2


class TestGerarPdfContrato:
    def test_returns_bytesio(self):
        result = gerar_pdf_contrato(650.0, _base_session())
        assert isinstance(result, BytesIO)

    def test_pdf_has_content(self):
        result = gerar_pdf_contrato(650.0, _base_session())
        assert len(result.read()) > 0

    def test_pdf_starts_with_pdf_header(self):
        result = gerar_pdf_contrato(650.0, _base_session())
        assert result.read(4) == b"%PDF"

    def test_buffer_seeked_to_start(self):
        result = gerar_pdf_contrato(650.0, _base_session())
        assert result.tell() == 0

    def test_works_with_zero_cache(self):
        result = gerar_pdf_contrato(0.0, _base_session())
        assert isinstance(result, BytesIO)

    def test_works_with_minimal_session(self):
        """Should not raise even when most optional session values are absent."""
        session = {"data_evento": date(2024, 6, 15)}
        result = gerar_pdf_contrato(1000.0, session)
        assert isinstance(result, BytesIO)

    def test_works_with_empty_contratante_fields(self):
        session = _base_session()
        session["contratante_nome"] = ""
        session["contratante_doc"] = ""
        session["contratante_email"] = ""
        session["contratante_tel"] = ""
        session["contratante_end"] = ""
        result = gerar_pdf_contrato(650.0, session)
        assert isinstance(result, BytesIO)

    def test_each_call_produces_independent_buffer(self):
        session = _base_session()
        buf1 = gerar_pdf_contrato(650.0, session)
        buf2 = gerar_pdf_contrato(650.0, session)
        assert buf1 is not buf2
