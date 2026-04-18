"""PDF generation for Aditivo GigFlow.

Provides two public functions:

- ``gerar_pdf_orcamento`` – generates a quotation PDF.
- ``gerar_pdf_contrato``  – generates a service contract PDF.

Both functions are intentionally decoupled from Streamlit: they receive
all required data as explicit arguments so they can be tested without a
running Streamlit session.
"""

from __future__ import annotations

from datetime import date
from io import BytesIO
from typing import Any

import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from .helpers import brl


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _pdf_styles() -> tuple[dict, ParagraphStyle, ParagraphStyle, ParagraphStyle]:
    """Cria e retorna os estilos compartilhados para os PDFs.

    Returns:
        Tuple (doc_kwargs, small, small_bold, title_style).
    """
    doc_kwargs = {
        "pagesize": A4,
        "leftMargin": 36,
        "rightMargin": 36,
        "topMargin": 36,
        "bottomMargin": 36,
    }
    styles = getSampleStyleSheet()
    small = ParagraphStyle(
        name="small",
        parent=styles["Normal"],
        fontSize=9,
        leading=11,
    )
    small_bold = ParagraphStyle(
        name="small_bold",
        parent=styles["Normal"],
        fontSize=9,
        leading=11,
        fontName="Helvetica-Bold",
    )
    title_style = ParagraphStyle(
        name="title",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#FF4B4B"),
    )
    return doc_kwargs, small, small_bold, title_style


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def gerar_pdf_orcamento(
    df: pd.DataFrame,
    custo_total: float,
    margem_valor: float,
    cache_proposto: float,
    session: dict[str, Any],
) -> BytesIO:
    """Gera o PDF de orçamento.

    Args:
        df: DataFrame com os itens do orçamento (já filtrado por "Incluir" e
            com a coluna "Total (R$)" calculada).
        custo_total: Soma dos custos totais dos itens incluídos.
        margem_valor: Valor monetário da margem de lucro.
        cache_proposto: Valor total proposto (custo + margem).
        session: Dicionário com os dados da sessão (equivalente a
            ``st.session_state``).

    Returns:
        BytesIO com o conteúdo do PDF pronto para download.
    """
    buffer = BytesIO()
    doc_kwargs, small, small_bold, title_style = _pdf_styles()
    doc = SimpleDocTemplate(buffer, **doc_kwargs)

    data_evento: date = session.get("data_evento", date.today())
    data_validade: date = session.get("data_validade", date.today())
    margem_pct: float = session.get("margem_pct", 0.0)

    elementos = []
    elementos.append(Paragraph("<b>Aditivo GigFlow \u2013 Or\u00e7amento</b>", title_style))
    elementos.append(Spacer(1, 6))

    status_text = "ENVIADO" if session.get("enviado") else "RASCUNHO"
    topo = (
        f"<b>N\u00ba Proposta:</b> {session.get('numero_proposta', '-')} &nbsp;&nbsp; "
        f"<b>Status:</b> {status_text}<br/>"
        f"<b>Evento:</b> {session.get('nome_evento') or '-'} &nbsp;&nbsp; "
        f"<b>Data:</b> {data_evento.strftime('%d/%m/%Y')} &nbsp;&nbsp; "
        f"<b>Cidade:</b> {session.get('cidade') or '-'}<br/>"
        f"<b>Validade:</b> {session.get('validade_dias', 0)} dia(s) "
        f"(at\u00e9 {data_validade.strftime('%d/%m/%Y')})"
    )
    elementos.append(Paragraph(topo, small))
    elementos.append(Spacer(1, 10))

    dados = [[
        Paragraph("<b>Item</b>", small_bold),
        Paragraph("<b>Descri\u00e7\u00e3o</b>", small_bold),
        Paragraph("<b>Qtd</b>", small_bold),
        Paragraph("<b>Valor Unit.</b>", small_bold),
        Paragraph("<b>Total</b>", small_bold),
    ]]

    for _, row in df[df["Incluir"]].iterrows():
        dados.append([
            Paragraph(str(row["Item"]), small),
            Paragraph(str(row["Descri\u00e7\u00e3o"]), small),
            Paragraph(f"{row['Quantidade']:.0f}", small),
            Paragraph(brl(row["Custo Unit\u00e1rio (R$)"]), small),
            Paragraph(brl(row["Total (R$)"]), small),
        ])

    dados += [
        ["", "", "", Paragraph("<b>Custo Total</b>", small_bold), Paragraph(brl(custo_total), small_bold)],
        ["", "", "", Paragraph(f"<b>Margem de Lucro ({margem_pct:.0f}%)</b>", small_bold), Paragraph(brl(margem_valor), small_bold)],
        ["", "", "", Paragraph("<b>Cach\u00ea Proposto</b>", small_bold), Paragraph(brl(cache_proposto), small_bold)],
    ]

    col_widths = [60, 210, 40, 90, 90]
    tabela = Table(dados, colWidths=col_widths, repeatRows=1)
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#FF4B4B")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (2, 1), (-1, -1), "CENTER"),
        ("ALIGN", (1, 1), (1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.gray),
        ("ROWBACKGROUNDS", (0, 1), (-1, -4), [colors.whitesmoke, colors.white]),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
    ]))
    elementos += [tabela, Spacer(1, 12)]

    elementos.append(Paragraph(
        f"<b>Condi\u00e7\u00f5es de Pagamento:</b> {session.get('forma_pagto') or '-'}",
        small,
    ))
    if session.get("observacoes"):
        elementos.append(Spacer(1, 6))
        elementos.append(Paragraph(
            f"<b>Observa\u00e7\u00f5es:</b> {session['observacoes']}",
            small,
        ))

    elementos.append(Spacer(1, 20))
    elementos.append(Paragraph("<i>Desenvolvido por Aditivo Media</i>", small))

    doc.build(elementos)
    buffer.seek(0)
    return buffer


def gerar_pdf_contrato(
    cache_proposto: float,
    session: dict[str, Any],
) -> BytesIO:
    """Gera o PDF de contrato de prestação de serviços musicais.

    Args:
        cache_proposto: Valor total do cachê proposto.
        session: Dicionário com os dados da sessão (equivalente a
            ``st.session_state``).

    Returns:
        BytesIO com o conteúdo do PDF pronto para download.
    """
    buffer = BytesIO()
    doc_kwargs, small, small_bold, title_style = _pdf_styles()
    doc = SimpleDocTemplate(buffer, **doc_kwargs)

    data_evento: date = session.get("data_evento", date.today())

    elementos = []
    elementos.append(Paragraph("<b>Contrato de Presta\u00e7\u00e3o de Servi\u00e7os Musicais</b>", title_style))
    elementos.append(Spacer(1, 8))

    partes = (
        f"<b>CONTRATANTE:</b> {session.get('contratante_nome') or '-'} - "
        f"CPF/CNPJ: {session.get('contratante_doc') or '-'}<br/>"
        f"Endere\u00e7o: {session.get('contratante_end') or '-'}<br/>"
        f"E-mail: {session.get('contratante_email') or '-'} - "
        f"Telefone: {session.get('contratante_tel') or '-'}<br/><br/>"
        f"<b>CONTRATADA:</b> {session.get('banda_razao', '-')} - "
        f"CNPJ: {session.get('banda_cnpj', '-')}<br/>"
        f"Representante Legal: {session.get('banda_resp_legal') or '-'}<br/>"
        f"Respons\u00e1vel pela Banda: {session.get('banda_resp_banda') or '-'}"
    )
    elementos.append(Paragraph(partes, small))
    elementos.append(Spacer(1, 10))

    info_evento = (
        f"<b>INFORMA\u00c7\u00d5ES DO EVENTO</b><br/>"
        f"Data: {data_evento.strftime('%d/%m/%Y')} | "
        f"Local: {session.get('cidade') or '-'} | "
        f"N\u00ba Convidados: {session.get('num_convidados', 0)}<br/>"
        f"Hor\u00e1rio Montagem: {session.get('hora_montagem') or '-'} | "
        f"Hor\u00e1rio Show: {session.get('hora_show') or '-'}<br/>"
        f"Local de Apresenta\u00e7\u00e3o: {session.get('local_apresentacao') or '-'}"
    )
    elementos.append(Paragraph(info_evento, small))
    elementos.append(Spacer(1, 8))

    elementos.append(Paragraph("<b>EQUIPAMENTOS E RESPONSABILIDADES</b>", small_bold))
    elementos.append(Paragraph(
        f"<b>Responsabilidade da Banda:</b> {session.get('resp_banda', '-')}",
        small,
    ))
    elementos.append(Paragraph(
        f"<b>Responsabilidade da Contratante:</b> {session.get('resp_contratante', '-')}",
        small,
    ))
    elementos.append(Spacer(1, 8))

    equipe = (
        f"<b>COMPOSI\u00c7\u00c3O DA EQUIPE:</b> "
        f"Integrantes: {session.get('num_integrantes', 0)} | "
        f"Apoio: {session.get('num_apoio', 0)} | "
        f"Acompanhantes: {session.get('num_acomp', 0)}"
    )
    elementos.append(Paragraph(equipe, small))
    elementos.append(Spacer(1, 10))

    elementos.append(Paragraph("<b>CL\u00c1USULAS CONTRATUAIS</b>", small_bold))
    elementos.append(Spacer(1, 4))

    clausulas = [
        (
            f"<b>1\u00aa.</b> Valor total do servi\u00e7o: <b>{brl(cache_proposto)}</b> - "
            f"Pagamento: {session.get('forma_pagto') or '-'}."
        ),
        "<b>2\u00aa.</b> Despesas de transporte: responsabilidade da Contratada.",
        "<b>3\u00aa.</b> Alimenta\u00e7\u00e3o de banda e equipe: responsabilidade da Contratante.",
        "<b>4\u00aa.</b> Altera\u00e7\u00e3o de data: deve ser comunicada por escrito ao respons\u00e1vel indicado.",
        "<b>5\u00aa.</b> O respons\u00e1vel que assina pela Contratante \u00e9 fiador solid\u00e1rio.",
        "<b>6\u00aa.</b> A Contratante responde por danos aos equipamentos ou integrantes por problemas no local.",
        (
            f"<b>7\u00aa.</b> Energia el\u00e9trica conforme NBR 5410: "
            f"tomada {session.get('energia_tomada', '-')}, "
            f"{session.get('energia_tensao', '-')}, "
            f"aterramento {session.get('energia_aterramento', '-')}; "
            f"dist\u00e2ncia m\u00e1xima do palco: {session.get('energia_dist_max', '-')}."
        ),
        f"<b>8\u00aa.</b> Multa por descumprimento: {session.get('multa_perc', 0)}% do valor total.",
        f"<b>9\u00aa.</b> Foro: {session.get('foro', '-')}.",
    ]

    for clausula in clausulas:
        elementos.append(Paragraph(clausula, small))
        elementos.append(Spacer(1, 3))

    elementos.append(Spacer(1, 15))

    contratante_nome = session.get("contratante_nome") or "________________________________"
    contratante_doc = session.get("contratante_doc") or ""
    banda_resp_banda = session.get("banda_resp_banda") or "________________________________"
    banda_razao = session.get("banda_razao", "")

    assinatura_tbl = Table(
        [[
            Paragraph(
                f"<b>Contratante:</b><br/><br/>{contratante_nome}<br/>{contratante_doc}",
                small,
            ),
            Paragraph(
                f"<b>Banda Aditivo / {banda_razao}:</b><br/><br/>{banda_resp_banda}",
                small,
            ),
        ]],
        colWidths=[240, 240],
    )
    assinatura_tbl.setStyle(TableStyle([
        ("LINEABOVE", (0, 0), (0, 0), 1, colors.black),
        ("LINEABOVE", (1, 0), (1, 0), 1, colors.black),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    elementos.append(assinatura_tbl)

    elementos.append(Spacer(1, 15))
    elementos.append(Paragraph("<i>Desenvolvido por Aditivo Media</i>", small))

    doc.build(elementos)
    buffer.seek(0)
    return buffer
