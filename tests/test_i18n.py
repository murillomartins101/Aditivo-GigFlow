"""Tests for gigflow.i18n module."""

import pytest

from gigflow.i18n import SUPPORTED_LANGUAGES, get_text


class TestGetText:
    def test_returns_portuguese_by_default(self):
        result = get_text("app.title")
        assert isinstance(result, str)
        assert result != ""

    def test_returns_english_when_requested(self):
        result_pt = get_text("sidebar.profit_margin", lang="pt")
        result_en = get_text("sidebar.profit_margin", lang="en")
        assert result_pt != result_en

    def test_missing_key_returns_key_itself(self):
        assert get_text("nonexistent.key") == "nonexistent.key"

    def test_unsupported_lang_falls_back_to_portuguese(self):
        result = get_text("app.title", lang="de")
        result_pt = get_text("app.title", lang="pt")
        assert result == result_pt

    def test_all_keys_have_portuguese(self):
        from gigflow.i18n import _STRINGS
        for key, translations in _STRINGS.items():
            assert "pt" in translations, f"Key '{key}' is missing Portuguese translation"

    def test_all_keys_have_english(self):
        from gigflow.i18n import _STRINGS
        for key, translations in _STRINGS.items():
            assert "en" in translations, f"Key '{key}' is missing English translation"


class TestSupportedLanguages:
    def test_pt_and_en_present(self):
        assert "pt" in SUPPORTED_LANGUAGES
        assert "en" in SUPPORTED_LANGUAGES

    def test_values_are_non_empty_strings(self):
        for code, label in SUPPORTED_LANGUAGES.items():
            assert isinstance(label, str) and label, f"Empty label for language code '{code}'"
