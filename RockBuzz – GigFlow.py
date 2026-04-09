# Rockbuzz Pay – GigFlow
# Calculadora de custos de um show e emissão de contratos pequenos
# -------------------------------------------------------------------------------
import json
from datetime import datetime, timedelta

import pandas as pd
import streamlit as st

from gigflow.data import default_rows
from gigflow.helpers import brl
from gigflow.history import make_record
from gigflow.i18n import SUPPORTED_LANGUAGES, get_text
from gigflow.pdf import gerar_pdf_contrato, gerar_pdf_orcamento
from gigflow.state import ensure_state

st.set_page_config(
    page_title="Rockbuzz Gigflow | Calculadora de Custos e Emissão de Contratos",
    page_icon="🎸",
    layout="wide",
    initial_sidebar_state="auto",
)

# Initialise session state (sets defaults only if keys are absent)
# Must run before CSS injection so the theme variable is available.
ensure_state()

# =========================
# CSS Customizado – Responsivo, Acessível e com Suporte a Temas
# =========================
_theme = st.session_state.get("theme", "dark")

if _theme == "light":
    _accent          = "#CC0000"
    _footer_bg       = "#F0F2F6"
    _footer_text     = "#1A1A2E"
    _footer_border   = "#D0D0D0"
    _success_bg      = "#D4EDDA"
    _success_border  = "#28A745"
    _info_bg         = "#D1ECF1"
    _info_border     = "#17A2B8"
    _metric_bg       = "#F0F2F6"
    _metric_border   = "#C8CBD4"
    _h1_color        = "#CC0000"
    _h2_color        = "#1A1A2E"
else:  # dark (default)
    _accent          = "#FF4B4B"
    _footer_bg       = "#0E1117"
    _footer_text     = "#FAFAFA"
    _footer_border   = "#262730"
    _success_bg      = "#1F4D2E"
    _success_border  = "#4CAF50"
    _info_bg         = "#1E3A5F"
    _info_border     = "#2196F3"
    _metric_bg       = "#262730"
    _metric_border   = "#3D3D3D"
    _h1_color        = "#FF4B4B"
    _h2_color        = "#FAFAFA"

st.markdown(f"""
<style>
    /* ================================================================
       Rockbuzz GigFlow – Custom Styles
       Responsivo · Acessível · Suporte a Temas
       ================================================================ */

    /* ---------- Acessibilidade: Skip navigation ---------- */
    .gf-skip-link {{
        position: absolute;
        top: -44px;
        left: 0;
        background: {_accent};
        color: #FFFFFF;
        padding: 8px 16px;
        text-decoration: none;
        font-weight: 600;
        border-radius: 0 0 4px 0;
        z-index: 10000;
        transition: top 0.2s;
    }}
    .gf-skip-link:focus {{
        top: 0;
    }}

    /* ---------- Footer ---------- */
    .gf-footer {{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: {_footer_bg};
        color: {_footer_text};
        text-align: center;
        padding: 10px 0;
        font-size: 14px;
        border-top: 1px solid {_footer_border};
        z-index: 999;
    }}
    .gf-footer a {{
        color: {_accent};
        text-decoration: none;
        font-weight: 600;
    }}
    .gf-footer a:hover {{
        text-decoration: underline;
    }}

    /* ---------- Conteúdo principal (espaço para o footer) ---------- */
    .main .block-container {{
        padding-bottom: 60px;
    }}

    /* ---------- Cards de métricas ---------- */
    [data-testid="stMetric"] {{
        background-color: {_metric_bg};
        padding: 15px;
        border-radius: 8px;
        border: 1px solid {_metric_border};
    }}

    /* ---------- Botões ---------- */
    .stButton > button {{
        width: 100%;
        border-radius: 6px;
        font-weight: 600;
        /* Acessibilidade: área mínima de toque de 44 px */
        min-height: 44px;
    }}

    /* ---------- Títulos ---------- */
    h1 {{
        color: {_h1_color};
        padding-bottom: 10px;
        border-bottom: 2px solid {_h1_color};
    }}
    h2 {{
        color: {_h2_color};
        margin-top: 20px;
    }}

    /* ---------- Caixas de status (usadas via st.markdown) ---------- */
    .success-box {{
        background-color: {_success_bg};
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid {_success_border};
        margin: 10px 0;
    }}
    .info-box {{
        background-color: {_info_bg};
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid {_info_border};
        margin: 10px 0;
    }}

    /* ---------- Acessibilidade: Indicadores de foco visíveis ---------- */
    :focus-visible {{
        outline: 3px solid {_accent} !important;
        outline-offset: 2px !important;
        border-radius: 3px;
    }}
    .stButton > button:focus-visible {{
        outline: 3px solid {_accent} !important;
        outline-offset: 2px !important;
    }}

    /* ================================================================
       RESPONSIVIDADE – Tablet (≤ 768 px)
       ================================================================ */
    @media (max-width: 768px) {{
        /* Padding mais compacto */
        .main .block-container {{
            padding: 1rem 0.75rem 70px 0.75rem;
            max-width: 100% !important;
        }}

        /* Títulos menores */
        h1 {{ font-size: 1.4rem !important; }}
        h2 {{ font-size: 1.15rem !important; }}

        /* Métricas legíveis em tela pequena */
        [data-testid="stMetricValue"] {{
            font-size: 1.1rem !important;
        }}
        [data-testid="stMetricLabel"] {{
            font-size: 0.75rem !important;
        }}

        /* Tabela com scroll horizontal */
        [data-testid="stDataEditorContainer"] {{
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }}

        /* Botões maiores para toque */
        .stButton > button {{
            min-height: 48px;
            font-size: 15px;
        }}

        /* Footer compacto */
        .gf-footer {{
            font-size: 12px;
            padding: 8px 10px;
        }}
    }}

    /* ================================================================
       RESPONSIVIDADE – Smartphone pequeno (≤ 480 px)
       ================================================================ */
    @media (max-width: 480px) {{
        h1 {{ font-size: 1.2rem !important; }}

        .main .block-container {{
            padding: 0.5rem 0.5rem 70px 0.5rem;
        }}

        [data-testid="stMetricValue"] {{
            font-size: 1rem !important;
        }}
    }}
</style>
""", unsafe_allow_html=True)

# Skip-navigation link (acessibilidade para usuários de teclado/leitor de tela)
st.markdown(
    '<a class="gf-skip-link" href="#main-content">Ir para o conteúdo principal</a>',
    unsafe_allow_html=True,
)

# Convenience shorthand – read current language once per run
lang = st.session_state.get("lang", "pt")
t = lambda key: get_text(key, lang)  # noqa: E731


# =========================
# Sidebar – Configurações
# =========================
with st.sidebar:
    try:
        st.image("LOGO DEFINITIVO FUNDO ESCURO.png", use_container_width=True)
    except Exception:
        st.markdown("### Rockbuzz GigFlow")

    st.markdown("---")

    # Language selector
    lang_options = list(SUPPORTED_LANGUAGES.keys())
    lang_labels = list(SUPPORTED_LANGUAGES.values())
    selected_lang_label = st.selectbox(
        t("sidebar.language"),
        options=lang_labels,
        index=lang_options.index(st.session_state.get("lang", "pt")),
    )
    new_lang = lang_options[lang_labels.index(selected_lang_label)]
    if new_lang != st.session_state.get("lang"):
        st.session_state["lang"] = new_lang
        st.rerun()

    # Theme selector
    _theme_dark_label  = t("sidebar.theme_dark")
    _theme_light_label = t("sidebar.theme_light")
    _theme_options = {_theme_dark_label: "dark", _theme_light_label: "light"}
    _current_theme_label = (
        _theme_light_label
        if st.session_state.get("theme") == "light"
        else _theme_dark_label
    )
    _selected_theme_label = st.radio(
        t("sidebar.theme"),
        options=list(_theme_options.keys()),
        index=list(_theme_options.keys()).index(_current_theme_label),
        horizontal=True,
    )
    _new_theme = _theme_options[_selected_theme_label]
    if _new_theme != st.session_state.get("theme"):
        st.session_state["theme"] = _new_theme
        st.rerun()

    st.markdown("---")

    with st.expander(t("sidebar.general_params"), expanded=True):
        margem_pct = st.number_input(
            t("sidebar.profit_margin"),
            min_value=0.0, max_value=200.0, step=5.0, key="margem_pct",
        )

    with st.expander(t("sidebar.event_data"), expanded=True):
        nome_evento = st.text_input(
            t("sidebar.event_name"),
            placeholder=t("sidebar.event_name_placeholder"),
            key="nome_evento",
        )
        data_evento = st.date_input(t("sidebar.event_date"), key="data_evento")
        cidade = st.text_input(
            t("sidebar.city"),
            placeholder=t("sidebar.city_placeholder"),
            key="cidade",
        )

    with st.expander(t("sidebar.quote_info"), expanded=False):
        numero_proposta = st.text_input(t("sidebar.proposal_number"), key="numero_proposta")
        validade_dias = st.number_input(
            t("sidebar.validity_days"), min_value=1, max_value=90, step=1, key="validade_dias",
        )
        forma_pagto = st.text_input(t("sidebar.payment_terms"), key="forma_pagto")
        observacoes = st.text_area(t("sidebar.notes"), height=100, key="observacoes")
        enviado = st.checkbox(t("sidebar.mark_sent"), key="enviado")

    with st.expander(t("sidebar.client_data"), expanded=False):
        contratante_nome = st.text_input(t("sidebar.client_name"), key="contratante_nome")
        contratante_doc = st.text_input(t("sidebar.client_doc"), key="contratante_doc")
        contratante_email = st.text_input(t("sidebar.client_email"), key="contratante_email")
        contratante_tel = st.text_input(t("sidebar.client_phone"), key="contratante_tel")
        contratante_end = st.text_area(t("sidebar.client_address"), height=80, key="contratante_end")

    with st.expander(t("sidebar.band_data"), expanded=False):
        banda_razao = st.text_input(t("sidebar.band_company"), key="banda_razao")
        banda_cnpj = st.text_input(t("sidebar.band_cnpj"), key="banda_cnpj")
        banda_resp_legal = st.text_input(t("sidebar.band_legal_rep"), key="banda_resp_legal")
        banda_resp_banda = st.text_input(t("sidebar.band_rep"), key="banda_resp_banda")

    with st.expander(t("sidebar.event_details"), expanded=False):
        num_convidados = st.number_input(
            t("sidebar.guests"), min_value=0, step=10, key="num_convidados",
        )
        hora_montagem = st.text_input(
            t("sidebar.setup_time"),
            placeholder=t("sidebar.setup_time_placeholder"),
            key="hora_montagem",
        )
        hora_show = st.text_input(
            t("sidebar.show_time"),
            placeholder=t("sidebar.show_time_placeholder"),
            key="hora_show",
        )
        local_apresentacao = st.text_input(t("sidebar.venue"), key="local_apresentacao")

    with st.expander(t("sidebar.responsibilities"), expanded=False):
        resp_banda = st.text_area(t("sidebar.band_responsibility"), height=80, key="resp_banda")
        resp_contratante = st.text_area(
            t("sidebar.client_responsibility"), height=80, key="resp_contratante",
        )

    with st.expander(t("sidebar.team"), expanded=False):
        num_integrantes = st.number_input(t("sidebar.members"), min_value=0, key="num_integrantes")
        num_apoio = st.number_input(t("sidebar.support"), min_value=0, key="num_apoio")
        num_acomp = st.number_input(t("sidebar.companions"), min_value=0, key="num_acomp")

    with st.expander(t("sidebar.power"), expanded=False):
        energia_tomada = st.text_input(t("sidebar.outlet"), key="energia_tomada")
        energia_tensao = st.text_input(t("sidebar.voltage"), key="energia_tensao")
        energia_aterramento = st.text_input(t("sidebar.grounding"), key="energia_aterramento")
        energia_dist_max = st.text_input(t("sidebar.max_distance"), key="energia_dist_max")

    with st.expander(t("sidebar.contract_clauses"), expanded=False):
        multa_perc = st.number_input(
            t("sidebar.penalty"), min_value=0, max_value=100, key="multa_perc",
        )
        foro = st.text_input(t("sidebar.jurisdiction"), key="foro")

# =========================
# Conteúdo Principal
# =========================
# Anchor para o skip-link de acessibilidade
st.markdown('<span id="main-content"></span>', unsafe_allow_html=True)
st.title(t("app.title"))
st.markdown(t("app.subtitle"))
st.markdown("---")

# How-to instructions
with st.expander(t("app.howto.title"), expanded=False):
    st.markdown(t("app.howto.body"))

st.subheader(t("main.budget_items"))
st.caption(t("main.budget_caption"))

# Editor de itens
edited_df = st.data_editor(
    st.session_state.df,
    num_rows="dynamic",
    use_container_width=True,
    column_order=["Item", "Descrição", "Quantidade", "Custo Unitário (R$)", "Incluir"],
    column_config={
        "Item": st.column_config.TextColumn(t("table.item"), width="small"),
        "Descrição": st.column_config.TextColumn(t("table.description"), width="large"),
        "Quantidade": st.column_config.NumberColumn(t("table.quantity"), format="%.0f", step=1.0, min_value=0.0, width="small"),
        "Custo Unitário (R$)": st.column_config.NumberColumn(t("table.unit_value"), format="R$ %.2f", step=50.0, min_value=0.0, width="medium"),
        "Incluir": st.column_config.CheckboxColumn(t("table.include"), width="small"),
    },
    hide_index=True,
)

# =========================
# Cálculos com tratamento de NaN
# =========================
df_calc = edited_df.copy()
df_calc["Quantidade"] = pd.to_numeric(df_calc["Quantidade"], errors="coerce").fillna(0)
df_calc["Custo Unitário (R$)"] = pd.to_numeric(df_calc["Custo Unitário (R$)"], errors="coerce").fillna(0)
df_calc["Incluir"] = df_calc["Incluir"].fillna(False).astype(bool)
df_calc["Total (R$)"] = df_calc["Quantidade"] * df_calc["Custo Unitário (R$)"]
df_calc["Total (R$)"] = df_calc["Total (R$)"].where(df_calc["Incluir"], 0.0)

custo_total = float(df_calc["Total (R$)"].sum())
margem_valor = custo_total * (st.session_state.margem_pct / 100.0)
cache_proposto = custo_total + margem_valor
data_validade = datetime.today().date() + timedelta(days=int(st.session_state.validade_dias))

# =========================
# Resumo Financeiro
# =========================
st.markdown("---")
st.subheader(t("main.financial_summary"))

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric(t("main.total_cost"), brl(custo_total))
with col2:
    st.metric(t("main.profit_margin"), brl(margem_valor), f"{st.session_state.margem_pct:.0f}%")
with col3:
    st.metric(t("main.proposed_fee"), brl(cache_proposto))
with col4:
    st.metric(
        t("main.validity"),
        f"{st.session_state.validade_dias} dias",
        f"{t('main.until')} {data_validade.strftime('%d/%m/%Y')}",
    )

info_cols = st.columns(3)
with info_cols[0]:
    st.info(f"{t('main.event_label')} {st.session_state.nome_evento or t('main.not_informed')}")
with info_cols[1]:
    st.info(f"{t('main.date_label')} {st.session_state.data_evento.strftime('%d/%m/%Y')}")
with info_cols[2]:
    st.info(f"{t('main.location_label')} {st.session_state.cidade or t('main.not_informed')}")

# =========================
# Geração de PDFs
# =========================
session_dict = dict(st.session_state)
session_dict["data_validade"] = data_validade

st.markdown("---")
st.subheader(t("main.generate_docs"))

col_btn1, col_btn2 = st.columns(2)
with col_btn1:
    pdf_orc = gerar_pdf_orcamento(df_calc, custo_total, margem_valor, cache_proposto, session_dict)
    st.download_button(
        label=t("main.download_quote"),
        data=pdf_orc,
        file_name=f"Rockbuzz_Orcamento_{numero_proposta}.pdf",
        mime="application/pdf",
        use_container_width=True,
    )
with col_btn2:
    pdf_ctr = gerar_pdf_contrato(cache_proposto, session_dict)
    st.download_button(
        label=t("main.download_contract"),
        data=pdf_ctr,
        file_name=f"Rockbuzz_Contrato_{numero_proposta}.pdf",
        mime="application/pdf",
        use_container_width=True,
    )

# =========================
# Histórico
# =========================
st.markdown("---")
st.subheader(t("main.history_title"))

colA, colB, colC = st.columns([1, 1, 2])

if colA.button(t("main.save_history"), use_container_width=True):
    record = make_record(df_calc, custo_total, cache_proposto, data_validade, session_dict)
    st.session_state.history.append(record)
    st.success(t("main.history_saved"))

hist_json = json.dumps(st.session_state.history, ensure_ascii=False, indent=2)
colB.download_button(
    t("main.export_history"),
    data=hist_json.encode("utf-8"),
    file_name="rockbuzz_historico.json",
    mime="application/json",
    use_container_width=True,
)

uploaded = colC.file_uploader(t("main.import_history"), type=["json"])
if uploaded:
    try:
        st.session_state.history = json.loads(uploaded.read().decode("utf-8"))
        st.success(t("main.history_imported"))
        st.rerun()
    except Exception as e:
        st.error(f"{t('main.history_import_error')} {e}")

st.markdown("---")

# Listagem do histórico
if st.session_state.history:
    hist_data = []
    for r in st.session_state.history:
        created_dt = datetime.fromisoformat(r["created_at"])
        hist_data.append({
            "_created_dt": created_dt,
            t("history.created"): created_dt.strftime("%d/%m/%Y %H:%M"),
            t("history.proposal_no"): r["numero_proposta"],
            t("history.event"): r["evento"] or "-",
            t("history.date"): datetime.fromisoformat(r["data_evento"]).strftime("%d/%m/%Y"),
            t("history.city"): r["cidade"] or "-",
            t("history.status"): t("history.sent") if r["enviado"] else t("history.draft"),
            t("history.total_cost"): brl(r["custo_total"]),
            t("history.margin"): f"{r['margem_pct']:.0f}%",
            t("history.fee"): brl(r["cache_proposto"]),
            t("history.validity"): datetime.fromisoformat(r["validade_ate"]).strftime("%d/%m/%Y"),
            "id": r["id"],
        })
    hist_df = (
        pd.DataFrame(hist_data)
        .sort_values("_created_dt", ascending=False)
        .drop(columns=["_created_dt"])
    )

    st.dataframe(
        hist_df.drop(columns=["id"]),
        use_container_width=True,
        hide_index=True,
    )

    st.markdown(t("main.manage_proposals"))
    ids = hist_df["id"].tolist()
    proposal_no_col = t("history.proposal_no")
    event_col = t("history.event")
    escolha = st.selectbox(
        t("main.select_proposal"),
        options=[t("main.select_option")] + ids,
        format_func=lambda x: (
            t("main.select_option")
            if x == t("main.select_option")
            else (
                hist_df[hist_df["id"] == x][proposal_no_col].values[0]
                + f" - {hist_df[hist_df['id'] == x][event_col].values[0]}"
            )
        ),
    )

    ac1, ac2 = st.columns([1, 1])

    if escolha != t("main.select_option"):
        if ac1.button(t("main.load_editor"), use_container_width=True):
            rec = next((r for r in st.session_state.history if r["id"] == escolha), None)
            if rec:
                itens_df = pd.DataFrame(rec["itens"])
                if "Total (R$)" in itens_df.columns:
                    itens_df = itens_df.drop(columns=["Total (R$)"])
                st.session_state.df = itens_df

                st.session_state.margem_pct = rec.get("margem_pct", 30.0)
                st.session_state.nome_evento = rec.get("evento", "")

                try:
                    st.session_state.data_evento = datetime.fromisoformat(
                        rec.get("data_evento", "")
                    ).date()
                except (ValueError, TypeError):
                    st.session_state.data_evento = datetime.today().date()

                st.session_state.cidade = rec.get("cidade", "")
                st.session_state.numero_proposta = rec.get("numero_proposta", "")
                st.session_state.forma_pagto = rec.get("cond_pagto", "")
                st.session_state.observacoes = rec.get("observacoes", "")
                st.session_state.enviado = rec.get("enviado", False)

                contratante = rec.get("contratante", {})
                st.session_state.contratante_nome = contratante.get("nome", "")
                st.session_state.contratante_doc = contratante.get("doc", "")
                st.session_state.contratante_email = contratante.get("email", "")
                st.session_state.contratante_tel = contratante.get("tel", "")
                st.session_state.contratante_end = contratante.get("end", "")

                banda = rec.get("banda", {})
                st.session_state.banda_razao = banda.get("razao", "Aditivo Media Management")
                st.session_state.banda_cnpj = banda.get("cnpj", "40.157.297/0001-18")
                st.session_state.banda_resp_legal = banda.get("resp_legal", "")
                st.session_state.banda_resp_banda = banda.get("resp_banda", "")

                ev = rec.get("evento_info", {})
                st.session_state.num_convidados = ev.get("num_convidados", 0)
                st.session_state.hora_montagem = ev.get("hora_montagem", "")
                st.session_state.hora_show = ev.get("hora_show", "")
                st.session_state.local_apresentacao = ev.get("local_apresentacao", "")

                resp = rec.get("responsabilidades", {})
                st.session_state.resp_banda = resp.get("banda", "Sonorização e iluminação do show")
                st.session_state.resp_contratante = resp.get("contratante", "Som mecânico para a festa")

                equipe = rec.get("equipe", {})
                st.session_state.num_integrantes = equipe.get("integrantes", 0)
                st.session_state.num_apoio = equipe.get("apoio", 0)
                st.session_state.num_acomp = equipe.get("acompanhantes", 0)

                eng = rec.get("energia", {})
                st.session_state.energia_tomada = eng.get("tomada", "20A")
                st.session_state.energia_tensao = eng.get("tensao", "220V")
                st.session_state.energia_aterramento = eng.get("aterramento", "Adequado, conforme NBR 5410")
                st.session_state.energia_dist_max = eng.get("dist_max", "10 metros")

                st.session_state.multa_perc = rec.get("multa_perc", 50)
                st.session_state.foro = rec.get("foro", "Comarca de Jundiaí/SP")

                st.success(t("main.proposal_loaded"))
                st.rerun()

        if ac2.button(t("main.delete_proposal"), use_container_width=True):
            st.session_state.history = [
                r for r in st.session_state.history if r["id"] != escolha
            ]
            st.success(t("main.proposal_deleted"))
            st.rerun()
else:
    st.info(t("main.history_empty"))

# Persist edited items back into session state
st.session_state.df = edited_df

# =========================
# Footer
# =========================
st.markdown(
    '<footer class="gf-footer" role="contentinfo">'
    'Desenvolvido por <a href="https://aditivomedia.com" target="_blank" rel="noopener noreferrer">Aditivo Media</a>'
    "</footer>",
    unsafe_allow_html=True,
)
