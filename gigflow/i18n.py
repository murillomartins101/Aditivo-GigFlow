"""Internationalisation (i18n) support for Rockbuzz GigFlow.

Supported locales
-----------------
- ``pt`` – Portuguese (pt-BR) – default
- ``en`` – English (en-US)

Usage::

    from gigflow.i18n import get_text
    label = get_text("sidebar.profit_margin", lang="en")
"""

from __future__ import annotations

_STRINGS: dict[str, dict[str, str]] = {
    # -----------------------------------------------------------------------
    # App-wide
    # -----------------------------------------------------------------------
    "app.title": {
        "pt": "🎸 Rockbuzz Pay",
        "en": "🎸 Rockbuzz Pay",
    },
    "app.subtitle": {
        "pt": "**Calculadora de Cachê e Gerador de Contratos Profissionais**",
        "en": "**Show Fee Calculator & Professional Contract Generator**",
    },
    "app.howto.title": {
        "pt": "ℹ️ Como usar",
        "en": "ℹ️ How to use",
    },
    "app.howto.body": {
        "pt": (
            "1. **Configure os parâmetros** na barra lateral (margem de lucro, dados do evento, etc.)\n"
            "2. **Edite a tabela abaixo** com as quantidades e valores dos itens\n"
            "3. **Marque 'Incluir'** nos itens que devem ser considerados no cálculo\n"
            "4. **Visualize o resumo** com os valores calculados automaticamente\n"
            "5. **Baixe os PDFs** de Orçamento e Contrato separadamente\n"
            "6. **Salve no histórico** para consultas futuras"
        ),
        "en": (
            "1. **Configure parameters** in the sidebar (profit margin, event details, etc.)\n"
            "2. **Edit the table below** with item quantities and costs\n"
            "3. **Check 'Include'** for items that should be included in the calculation\n"
            "4. **Review the summary** with automatically calculated values\n"
            "5. **Download PDFs** for Quotation and Contract separately\n"
            "6. **Save to history** for future reference"
        ),
    },
    # -----------------------------------------------------------------------
    # Sidebar
    # -----------------------------------------------------------------------
    "sidebar.language": {
        "pt": "🌐 Idioma / Language",
        "en": "🌐 Language / Idioma",
    },
    "sidebar.theme": {
        "pt": "🎨 Tema",
        "en": "🎨 Theme",
    },
    "sidebar.theme_dark": {
        "pt": "Escuro",
        "en": "Dark",
    },
    "sidebar.theme_light": {
        "pt": "Claro",
        "en": "Light",
    },
    "sidebar.general_params": {
        "pt": "Parâmetros Gerais",
        "en": "General Parameters",
    },
    "sidebar.profit_margin": {
        "pt": "Margem de Lucro (%)",
        "en": "Profit Margin (%)",
    },
    "sidebar.event_data": {
        "pt": "Dados do Evento",
        "en": "Event Details",
    },
    "sidebar.event_name": {
        "pt": "Evento/Cliente",
        "en": "Event/Client",
    },
    "sidebar.event_name_placeholder": {
        "pt": "Ex: Festa Corporativa XYZ",
        "en": "e.g. XYZ Corporate Party",
    },
    "sidebar.event_date": {
        "pt": "Data do evento",
        "en": "Event date",
    },
    "sidebar.city": {
        "pt": "Cidade/Local",
        "en": "City/Venue",
    },
    "sidebar.city_placeholder": {
        "pt": "Ex: Jundiaí/SP",
        "en": "e.g. São Paulo/SP",
    },
    "sidebar.quote_info": {
        "pt": "Informações do Orçamento",
        "en": "Quote Information",
    },
    "sidebar.proposal_number": {
        "pt": "Nº da Proposta",
        "en": "Proposal No.",
    },
    "sidebar.validity_days": {
        "pt": "Validade (dias)",
        "en": "Validity (days)",
    },
    "sidebar.payment_terms": {
        "pt": "Condições de Pagamento",
        "en": "Payment Terms",
    },
    "sidebar.notes": {
        "pt": "Observações",
        "en": "Notes",
    },
    "sidebar.mark_sent": {
        "pt": "Marcar como ENVIADO",
        "en": "Mark as SENT",
    },
    "sidebar.client_data": {
        "pt": "Dados do Contratante",
        "en": "Client Data",
    },
    "sidebar.client_name": {
        "pt": "Nome/Razão Social",
        "en": "Name/Company",
    },
    "sidebar.client_doc": {
        "pt": "CNPJ/CPF",
        "en": "Tax ID",
    },
    "sidebar.client_email": {
        "pt": "E-mail",
        "en": "E-mail",
    },
    "sidebar.client_phone": {
        "pt": "Telefone",
        "en": "Phone",
    },
    "sidebar.client_address": {
        "pt": "Endereço",
        "en": "Address",
    },
    "sidebar.band_data": {
        "pt": "Dados da Banda",
        "en": "Band Data",
    },
    "sidebar.band_company": {
        "pt": "Razão Social",
        "en": "Company Name",
    },
    "sidebar.band_cnpj": {
        "pt": "CNPJ",
        "en": "Tax ID (CNPJ)",
    },
    "sidebar.band_legal_rep": {
        "pt": "Representante Legal",
        "en": "Legal Representative",
    },
    "sidebar.band_rep": {
        "pt": "Responsável pela Banda",
        "en": "Band Representative",
    },
    "sidebar.event_details": {
        "pt": "Detalhes do Evento",
        "en": "Event Details",
    },
    "sidebar.guests": {
        "pt": "Número de Convidados",
        "en": "Number of Guests",
    },
    "sidebar.setup_time": {
        "pt": "Horário de Montagem",
        "en": "Setup Time",
    },
    "sidebar.setup_time_placeholder": {
        "pt": "Ex: 18:00",
        "en": "e.g. 18:00",
    },
    "sidebar.show_time": {
        "pt": "Horário do Show",
        "en": "Show Time",
    },
    "sidebar.show_time_placeholder": {
        "pt": "Ex: 21:00",
        "en": "e.g. 21:00",
    },
    "sidebar.venue": {
        "pt": "Local de Apresentação",
        "en": "Performance Venue",
    },
    "sidebar.responsibilities": {
        "pt": "Equipamentos e Responsabilidades",
        "en": "Equipment & Responsibilities",
    },
    "sidebar.band_responsibility": {
        "pt": "Responsabilidade da Banda",
        "en": "Band's Responsibility",
    },
    "sidebar.client_responsibility": {
        "pt": "Responsabilidade da Contratante",
        "en": "Client's Responsibility",
    },
    "sidebar.team": {
        "pt": "Composição da Equipe",
        "en": "Team Composition",
    },
    "sidebar.members": {
        "pt": "Integrantes",
        "en": "Members",
    },
    "sidebar.support": {
        "pt": "Equipe de Apoio",
        "en": "Support Staff",
    },
    "sidebar.companions": {
        "pt": "Acompanhantes",
        "en": "Companions",
    },
    "sidebar.power": {
        "pt": "Requisitos de Energia (NBR 5410)",
        "en": "Power Requirements (NBR 5410)",
    },
    "sidebar.outlet": {
        "pt": "Tomada",
        "en": "Outlet",
    },
    "sidebar.voltage": {
        "pt": "Tensão",
        "en": "Voltage",
    },
    "sidebar.grounding": {
        "pt": "Aterramento",
        "en": "Grounding",
    },
    "sidebar.max_distance": {
        "pt": "Distância máx. do palco",
        "en": "Max. distance from stage",
    },
    "sidebar.contract_clauses": {
        "pt": "Cláusulas Contratuais",
        "en": "Contract Clauses",
    },
    "sidebar.penalty": {
        "pt": "Multa por descumprimento (%)",
        "en": "Breach penalty (%)",
    },
    "sidebar.jurisdiction": {
        "pt": "Foro",
        "en": "Jurisdiction",
    },
    # -----------------------------------------------------------------------
    # Main content
    # -----------------------------------------------------------------------
    "main.budget_items": {
        "pt": "💼 Itens do Orçamento",
        "en": "💼 Budget Items",
    },
    "main.budget_caption": {
        "pt": "Adicione, remova ou edite os itens conforme necessário. Marque 'Incluir' para considerar no cálculo.",
        "en": "Add, remove or edit items as needed. Check 'Include' to count them in the calculation.",
    },
    "main.financial_summary": {
        "pt": "💰 Resumo Financeiro",
        "en": "💰 Financial Summary",
    },
    "main.total_cost": {
        "pt": "Custo Total",
        "en": "Total Cost",
    },
    "main.profit_margin": {
        "pt": "Margem de Lucro",
        "en": "Profit Margin",
    },
    "main.proposed_fee": {
        "pt": "Cachê Proposto",
        "en": "Proposed Fee",
    },
    "main.validity": {
        "pt": "Validade",
        "en": "Validity",
    },
    "main.until": {
        "pt": "até",
        "en": "until",
    },
    "main.event_label": {
        "pt": "**Evento:**",
        "en": "**Event:**",
    },
    "main.date_label": {
        "pt": "**Data:**",
        "en": "**Date:**",
    },
    "main.location_label": {
        "pt": "**Local:**",
        "en": "**Location:**",
    },
    "main.not_informed": {
        "pt": "Não informado",
        "en": "Not informed",
    },
    "main.generate_docs": {
        "pt": "📥 Gerar Documentos",
        "en": "📥 Generate Documents",
    },
    "main.download_quote": {
        "pt": "📄 Baixar PDF – Orçamento",
        "en": "📄 Download PDF – Quotation",
    },
    "main.download_contract": {
        "pt": "📝 Baixar PDF – Contrato",
        "en": "📝 Download PDF – Contract",
    },
    "main.history_title": {
        "pt": "📜 Histórico de Propostas",
        "en": "📜 Proposal History",
    },
    "main.save_history": {
        "pt": "💾 Salvar no Histórico",
        "en": "💾 Save to History",
    },
    "main.export_history": {
        "pt": "⬇️ Exportar Histórico",
        "en": "⬇️ Export History",
    },
    "main.import_history": {
        "pt": "📤 Importar Histórico (JSON)",
        "en": "📤 Import History (JSON)",
    },
    "main.history_saved": {
        "pt": "✅ Proposta salva com sucesso!",
        "en": "✅ Proposal saved successfully!",
    },
    "main.history_imported": {
        "pt": "✅ Histórico importado com sucesso!",
        "en": "✅ History imported successfully!",
    },
    "main.history_import_error": {
        "pt": "❌ Falha ao importar:",
        "en": "❌ Import failed:",
    },
    "main.history_empty": {
        "pt": "Nenhuma proposta salva ainda. Crie um orçamento e clique em **Salvar no Histórico**.",
        "en": "No proposals saved yet. Create a quote and click **Save to History**.",
    },
    "main.manage_proposals": {
        "pt": "#### Gerenciar Propostas",
        "en": "#### Manage Proposals",
    },
    "main.select_proposal": {
        "pt": "Selecione uma proposta:",
        "en": "Select a proposal:",
    },
    "main.select_option": {
        "pt": "- Selecione -",
        "en": "- Select -",
    },
    "main.load_editor": {
        "pt": "Carregar no Editor",
        "en": "Load into Editor",
    },
    "main.delete_proposal": {
        "pt": "Apagar Proposta",
        "en": "Delete Proposal",
    },
    "main.proposal_loaded": {
        "pt": "Proposta carregada! Atualizando...",
        "en": "Proposal loaded! Refreshing...",
    },
    "main.proposal_deleted": {
        "pt": "Proposta removida do histórico!",
        "en": "Proposal removed from history!",
    },
    # -----------------------------------------------------------------------
    # Table columns
    # -----------------------------------------------------------------------
    "table.item": {
        "pt": "Item",
        "en": "Item",
    },
    "table.description": {
        "pt": "Descrição",
        "en": "Description",
    },
    "table.quantity": {
        "pt": "Qtd",
        "en": "Qty",
    },
    "table.unit_value": {
        "pt": "Valor Unit.",
        "en": "Unit Value",
    },
    "table.include": {
        "pt": "Incluir",
        "en": "Include",
    },
    # -----------------------------------------------------------------------
    # History table columns
    # -----------------------------------------------------------------------
    "history.created": {
        "pt": "Criado em",
        "en": "Created at",
    },
    "history.proposal_no": {
        "pt": "N\u00ba Proposta",
        "en": "Proposal No.",
    },
    "history.event": {
        "pt": "Evento",
        "en": "Event",
    },
    "history.date": {
        "pt": "Data",
        "en": "Date",
    },
    "history.city": {
        "pt": "Cidade",
        "en": "City",
    },
    "history.status": {
        "pt": "Status",
        "en": "Status",
    },
    "history.total_cost": {
        "pt": "Custo Total",
        "en": "Total Cost",
    },
    "history.margin": {
        "pt": "Margem",
        "en": "Margin",
    },
    "history.fee": {
        "pt": "Cach\u00ea",
        "en": "Fee",
    },
    "history.validity": {
        "pt": "Validade",
        "en": "Validity",
    },
    "history.sent": {
        "pt": "Enviado",
        "en": "Sent",
    },
    "history.draft": {
        "pt": "Rascunho",
        "en": "Draft",
    },
}


def get_text(key: str, lang: str = "pt") -> str:
    """Retorna a string traduzida para o idioma especificado.

    Args:
        key: Chave da string (ex. "app.title").
        lang: Código do idioma ("pt" ou "en"). Padrão: "pt".

    Returns:
        String no idioma solicitado, ou a string em português se o idioma
        não estiver disponível, ou a própria chave se a chave não existir.
    """
    entry = _STRINGS.get(key)
    if entry is None:
        return key
    return entry.get(lang) or entry.get("pt") or key


SUPPORTED_LANGUAGES: dict[str, str] = {
    "pt": "Português (BR)",
    "en": "English (US)",
}
