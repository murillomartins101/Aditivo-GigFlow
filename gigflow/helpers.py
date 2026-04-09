"""Utility helpers for Rockbuzz GigFlow."""


def brl(x: float) -> str:
    """Formata um valor numérico como Real Brasileiro (BRL).

    Args:
        x: Valor numérico a ser formatado.

    Returns:
        String no formato "R$ 1.234,56".
        Retorna "R$ 0,00" em caso de erro.
    """
    try:
        return f"R$ {x:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "R$ 0,00"
