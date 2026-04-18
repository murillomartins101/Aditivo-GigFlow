"""Centralized constants and default data for Aditivo GigFlow.

All hard-coded values and default templates live here so that they
are defined in exactly one place and can be reused across the app and
tests without duplication.
"""

# ---------------------------------------------------------------------------
# Banda defaults
# ---------------------------------------------------------------------------
DEFAULT_BANDA_RAZAO: str = "Aditivo Media Management"
DEFAULT_BANDA_CNPJ: str = "40.157.297/0001-18"

# ---------------------------------------------------------------------------
# Energia defaults (NBR 5410)
# ---------------------------------------------------------------------------
DEFAULT_ENERGIA_TOMADA: str = "20A"
DEFAULT_ENERGIA_TENSAO: str = "220V"
DEFAULT_ENERGIA_ATERRAMENTO: str = "Adequado, conforme NBR 5410"
DEFAULT_ENERGIA_DIST_MAX: str = "10 metros"

# ---------------------------------------------------------------------------
# Orçamento defaults
# ---------------------------------------------------------------------------
DEFAULT_MARGEM_PCT: float = 30.0
DEFAULT_FORMA_PAGTO: str = "50% na assinatura + 50% no dia do evento"
DEFAULT_VALIDADE_DIAS: int = 7

# ---------------------------------------------------------------------------
# Responsabilidades defaults
# ---------------------------------------------------------------------------
DEFAULT_RESP_BANDA: str = "Sonorização e iluminação do show"
DEFAULT_RESP_CONTRATANTE: str = "Som mecânico para a festa"

# ---------------------------------------------------------------------------
# Cláusulas contratuais defaults
# ---------------------------------------------------------------------------
DEFAULT_MULTA_PERC: int = 50
DEFAULT_FORO: str = "Comarca de Jundiaí/SP"


# ---------------------------------------------------------------------------
# Template de itens do orçamento
# ---------------------------------------------------------------------------
def default_rows() -> list[dict]:
    """Retorna o template padrão de itens do orçamento.

    Cada item contém: Item, Descrição, Quantidade, Custo Unitário (R$), Incluir.
    """
    return [
        {
            "Item": "1. Músicos",
            "Descrição": "Pagamento músicos",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "2. Ajudantes/Staff",
            "Descrição": "Pagamento de ajudantes (roadies)",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "3. Transporte",
            "Descrição": "Aluguel/combustível de carros próprios",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "4. Pedágio",
            "Descrição": "Custos com pedágios (ida e volta)",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "5. Combustível",
            "Descrição": "Estimativa ida/volta (média 13 km/L)",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "6. Alimentação",
            "Descrição": "Refeição completa para equipe",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "7. Hospedagem",
            "Descrição": "Caso haja necessidade de pernoite",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "8. Som/Luz Kiko",
            "Descrição": "PA até 100 pessoas + Monitoramento + Luz",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "9. PA Guilherme",
            "Descrição": "PA para eventos acima de 100 pessoas",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "10. Estrutura Evento",
            "Descrição": "Palco, som, luz, telão, treliças",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "11. Técnico de Som",
            "Descrição": "Palco/FOH",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
        {
            "Item": "12. Outros Custos",
            "Descrição": "Equipamentos extras, imprevistos",
            "Quantidade": 0,
            "Custo Unitário (R$)": 0.00,
            "Incluir": True,
        },
    ]
