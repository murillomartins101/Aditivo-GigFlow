# 🎸 Rockbuzz GigFlow

**Calculadora de Cachê e Gerador de Contratos Profissionais para Músicos e Bandas**

> Desenvolvido por [Aditivo Media](https://aditivomedia.com)

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação e Execução](#instalação-e-execução)
- [Testes Automatizados](#testes-automatizados)
- [Internacionalização](#internacionalização)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Como Contribuir](#como-contribuir)

---

## Visão Geral

O **Rockbuzz GigFlow** é uma aplicação web construída com [Streamlit](https://streamlit.io/) que auxilia músicos e gestores de bandas a:

- Calcular o **custo total** de um show (músicos, transporte, alimentação, hospedagem, equipamentos, etc.);
- Aplicar uma **margem de lucro** sobre os custos para obter o cachê proposto;
- Gerar **PDFs profissionais** de Orçamento e Contrato de Prestação de Serviços;
- Manter um **histórico** de propostas exportável e importável em JSON.

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 💼 Tabela de Itens | Adicione, edite ou remova itens do orçamento de forma interativa |
| 💰 Resumo Financeiro | Custo total, margem de lucro e cachê calculados automaticamente |
| 📄 PDF de Orçamento | Gera orçamento detalhado em PDF com tabela de itens e condições de pagamento |
| 📝 PDF de Contrato | Gera contrato de prestação de serviços com cláusulas padronizadas |
| 📜 Histórico | Salva, exporta (JSON) e importa propostas anteriores |
| 🌐 Idiomas | Interface disponível em **Português (BR)** e **English (US)** |

---

## Arquitetura

O projeto foi refatorado de um único arquivo monolítico para uma **estrutura modular** dentro do pacote `gigflow/`:

```
gigflow/
├── __init__.py     # Declaração do pacote
├── data.py         # Constantes e template padrão de itens (default_rows)
├── helpers.py      # Funções utilitárias (brl – formatação de moeda)
├── history.py      # Criação de registros de histórico (make_record)
├── i18n.py         # Internacionalização – strings pt-BR e en-US (get_text)
├── pdf.py          # Geração de PDFs (gerar_pdf_orcamento, gerar_pdf_contrato)
└── state.py        # Inicialização do estado da sessão Streamlit (ensure_state)
```

### Fluxo da Aplicação

```
RockBuzz – GigFlow.py  (camada de interface – Streamlit)
        │
        ├── gigflow.state.ensure_state()      # Inicializa st.session_state
        ├── gigflow.i18n.get_text()           # Traduz labels da UI
        ├── gigflow.helpers.brl()             # Formata valores em BRL
        ├── gigflow.pdf.gerar_pdf_orcamento() # Gera PDF de orçamento
        ├── gigflow.pdf.gerar_pdf_contrato()  # Gera PDF de contrato
        └── gigflow.history.make_record()     # Cria registro de histórico
```

### Princípios de Design

- **Separação de responsabilidades**: A UI (Streamlit) não contém lógica de negócio.
- **Dados centralizados**: Todos os valores padrão estão em `gigflow/data.py`.
- **Desacoplamento do Streamlit**: As funções de PDF e histórico recebem `session` como dicionário, facilitando os testes.
- **Testabilidade**: Funções puras testáveis sem dependência de servidor Streamlit.

---

## Instalação e Execução

### Pré-requisitos

- Python 3.10+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/murillomartins101/Rockbuzz-GigFlow.git
cd Rockbuzz-GigFlow

# (Opcional) Crie um ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt
```

### Execução

```bash
streamlit run "RockBuzz – GigFlow.py"
```

A aplicação será aberta automaticamente no navegador em `http://localhost:8501`.

---

## Testes Automatizados

O projeto utiliza **pytest** para testes unitários dos módulos do pacote `gigflow/`.

### Executar os testes

```bash
pytest tests/ -v
```

### Cobertura dos testes

| Módulo | Arquivo de testes | O que é testado |
|---|---|---|
| `gigflow/helpers.py` | `tests/test_helpers.py` | Formatação BRL (zero, inteiros, decimais, valores inválidos) |
| `gigflow/data.py` | `tests/test_data.py` | Template de itens, unicidade, constantes padrão |
| `gigflow/history.py` | `tests/test_history.py` | Criação de registros, unicidade de ID, serialização |
| `gigflow/i18n.py` | `tests/test_i18n.py` | Traduções pt/en, fallback, keys faltantes |

---

## Internacionalização

A aplicação suporta múltiplos idiomas via `gigflow/i18n.py`.

### Idiomas suportados

| Código | Idioma |
|---|---|
| `pt` | Português (BR) – padrão |
| `en` | English (US) |

O idioma é selecionado pelo usuário na barra lateral e persiste na sessão atual.

### Adicionando um novo idioma

1. Abra `gigflow/i18n.py`.
2. Adicione o novo código de idioma a cada entrada em `_STRINGS`, por exemplo:

```python
"app.title": {
    "pt": "🎸 Rockbuzz Pay",
    "en": "🎸 Rockbuzz Pay",
    "es": "🎸 Rockbuzz Pay",  # novo idioma
},
```

3. Adicione o novo idioma ao dicionário `SUPPORTED_LANGUAGES`:

```python
SUPPORTED_LANGUAGES: dict[str, str] = {
    "pt": "Português (BR)",
    "en": "English (US)",
    "es": "Español",  # novo idioma
}
```

---

## Estrutura de Arquivos

```
Rockbuzz-GigFlow/
├── RockBuzz – GigFlow.py   # Ponto de entrada da aplicação (UI Streamlit)
├── requirements.txt        # Dependências Python
├── README.md               # Esta documentação
├── LOGO DEFINITIVO FUNDO ESCURO.png
├── gigflow/                # Pacote modular
│   ├── __init__.py
│   ├── data.py
│   ├── helpers.py
│   ├── history.py
│   ├── i18n.py
│   ├── pdf.py
│   └── state.py
└── tests/                  # Testes automatizados
    ├── __init__.py
    ├── test_data.py
    ├── test_helpers.py
    ├── test_history.py
    └── test_i18n.py
```

---

## Como Contribuir

1. Faça um **fork** do repositório.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b feature/minha-melhoria
   ```
3. Escreva ou atualize os **testes** correspondentes em `tests/`.
4. Certifique-se de que todos os testes passam:
   ```bash
   pytest tests/ -v
   ```
5. Abra um **Pull Request** descrevendo as mudanças.

### Convenções

- **Código**: Python 3.10+, tipagem estática (`from __future__ import annotations`).
- **Strings da UI**: Sempre usar `gigflow/i18n.py` – nunca strings literais na camada de interface.
- **Constantes**: Novos valores padrão devem ser adicionados em `gigflow/data.py`.
- **Testes**: Cada módulo do pacote `gigflow/` deve ter um arquivo de testes correspondente.

---

*Desenvolvido com ❤️ por [Aditivo Media](https://aditivomedia.com)*
