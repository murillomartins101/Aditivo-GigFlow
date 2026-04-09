"""Tests for gigflow.data module."""

import pytest

from gigflow.data import (
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

REQUIRED_KEYS = {"Item", "Descrição", "Quantidade", "Custo Unitário (R$)", "Incluir"}


class TestDefaultRows:
    def test_returns_list(self):
        rows = default_rows()
        assert isinstance(rows, list)

    def test_returns_twelve_items(self):
        rows = default_rows()
        assert len(rows) == 12

    def test_each_row_has_required_keys(self):
        for row in default_rows():
            assert REQUIRED_KEYS == set(row.keys()), f"Missing keys in row: {row}"

    def test_default_quantity_is_zero(self):
        for row in default_rows():
            assert row["Quantidade"] == 0

    def test_default_unit_cost_is_zero(self):
        for row in default_rows():
            assert row["Custo Unitário (R$)"] == 0.00

    def test_include_is_true_by_default(self):
        for row in default_rows():
            assert row["Incluir"] is True

    def test_items_are_unique(self):
        items = [r["Item"] for r in default_rows()]
        assert len(items) == len(set(items)), "Duplicate item names found"

    def test_returns_new_list_each_call(self):
        """Mutations to one list must not affect the next call."""
        rows1 = default_rows()
        rows1[0]["Quantidade"] = 99
        rows2 = default_rows()
        assert rows2[0]["Quantidade"] == 0


class TestConstants:
    def test_default_margem_pct_is_positive(self):
        assert DEFAULT_MARGEM_PCT > 0

    def test_default_validade_days_is_positive(self):
        assert DEFAULT_VALIDADE_DIAS > 0

    def test_default_multa_perc_in_range(self):
        assert 0 <= DEFAULT_MULTA_PERC <= 100

    def test_banda_razao_not_empty(self):
        assert DEFAULT_BANDA_RAZAO != ""

    def test_banda_cnpj_not_empty(self):
        assert DEFAULT_BANDA_CNPJ != ""

    def test_foro_not_empty(self):
        assert DEFAULT_FORO != ""

    def test_forma_pagto_not_empty(self):
        assert DEFAULT_FORMA_PAGTO != ""

    def test_energia_fields_not_empty(self):
        assert DEFAULT_ENERGIA_TOMADA != ""
        assert DEFAULT_ENERGIA_TENSAO != ""
        assert DEFAULT_ENERGIA_ATERRAMENTO != ""
        assert DEFAULT_ENERGIA_DIST_MAX != ""

    def test_responsabilidades_not_empty(self):
        assert DEFAULT_RESP_BANDA != ""
        assert DEFAULT_RESP_CONTRATANTE != ""
