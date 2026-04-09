"""Tests for gigflow.helpers module."""

import pytest

from gigflow.helpers import brl


class TestBrl:
    def test_zero(self):
        assert brl(0) == "R$ 0,00"

    def test_integer(self):
        assert brl(1000) == "R$ 1.000,00"

    def test_float(self):
        assert brl(1234.56) == "R$ 1.234,56"

    def test_large_value(self):
        assert brl(1_000_000.00) == "R$ 1.000.000,00"

    def test_small_fractional(self):
        assert brl(0.99) == "R$ 0,99"

    def test_negative(self):
        # Negative values are formatted with a leading minus sign
        result = brl(-500.0)
        assert result.startswith("R$ -")
        assert "500,00" in result

    def test_invalid_string_returns_default(self):
        # Passing a non-numeric type should return the default string
        assert brl("not a number") == "R$ 0,00"

    def test_none_returns_default(self):
        assert brl(None) == "R$ 0,00"
