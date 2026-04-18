import React from 'react';
import { TrendingUp, DollarSign, Receipt, FileText, Save, RotateCcw, Printer } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface SummaryPanelProps {
  totalCost: number;
  profitAmount: number;
  proposedFee: number;
  profitMargin: number;
  setProfitMargin: (v: number) => void;
  onGenerateBudget: () => void;
  onGenerateContract: () => void;
  onSave: () => void;
  onReset: () => void;
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function SummaryPanel({
  totalCost, profitAmount, proposedFee,
  profitMargin, setProfitMargin,
  onGenerateBudget, onGenerateContract, onSave, onReset,
}: SummaryPanelProps) {
  const isMobile = useIsMobile();
  const marginPercent = totalCost > 0 ? (profitAmount / proposedFee) * 100 : 0;

  if (isMobile) {
    return (
      <div className="space-y-4 px-4" style={{ paddingBottom: 100 }}>

        {/* ── Hero Fee Card ── */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: 'linear-gradient(135deg, #1a0000, #2d0000)',
            border: '1px solid #e0000044',
          }}
        >
          <div style={{ fontSize: 13, color: '#ff6060', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            💰 Cachê Proposto
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: '#e00000', lineHeight: 1, marginBottom: 4 }}>
            {formatBRL(proposedFee)}
          </div>
          <div style={{ fontSize: 13, color: '#ff606099' }}>
            {marginPercent.toFixed(1)}% de margem líquida
          </div>
        </div>

        {/* ── Mini Stats Row ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ background: '#141414', border: '1px solid #232323' }}>
            <div className="flex items-center gap-2 mb-2">
              <Receipt size={14} color="#60a5fa" />
              <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Custo Total</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa' }}>{formatBRL(totalCost)}</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#141414', border: '1px solid #232323' }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} color="#a78bfa" />
              <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lucro</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa' }}>{formatBRL(profitAmount)}</div>
          </div>
        </div>

        {/* ── Margin Slider ── */}
        <div className="rounded-2xl p-5" style={{ background: '#141414', border: '1px solid #232323' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#d0d0d0' }}>🎯 Margem de Lucro</div>
              <div style={{ fontSize: 12, color: '#777', marginTop: 1 }}>% sobre o custo total</div>
            </div>
            <div className="flex items-center justify-center rounded-xl px-3 py-2"
              style={{ background: '#e0000022', border: '1px solid #e0000044', minWidth: 60 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#e00000' }}>{profitMargin}%</span>
            </div>
          </div>

          <input
            type="range" min={0} max={200} step={1} value={profitMargin}
            onChange={e => setProfitMargin(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#e00000', height: 8, cursor: 'pointer' }}
          />

          {/* Quick preset buttons */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {[0, 10, 20, 30, 50, 75, 100].map(v => (
              <button
                key={v}
                onClick={() => setProfitMargin(v)}
                style={{
                  background: profitMargin === v ? '#e00000' : '#1f1f1f',
                  color: profitMargin === v ? '#fff' : '#777',
                  border: profitMargin === v ? 'none' : '1px solid #2e2e2e',
                  borderRadius: 10,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: profitMargin === v ? 700 : 400,
                  cursor: 'pointer',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {v}%
              </button>
            ))}
          </div>

          {/* Breakdown bar */}
          {proposedFee > 0 && (
            <div className="mt-4">
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: 11, color: '#60a5fa' }}>Custo {((totalCost / proposedFee) * 100).toFixed(0)}%</span>
                <span style={{ fontSize: 11, color: '#a78bfa' }}>Lucro {((profitAmount / proposedFee) * 100).toFixed(0)}%</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 10, background: '#1f1f1f' }}>
                <div style={{
                  height: '100%',
                  width: `${(totalCost / proposedFee) * 100}%`,
                  background: 'linear-gradient(90deg, #60a5fa, #818cf8)',
                  borderRadius: 5,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: '#141414', border: '1px solid #232323' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#d0d0d0', marginBottom: 4 }}>📄 Documentos</div>

          {/* Save – primary CTA */}
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-3 rounded-2xl"
            style={{ height: 56, background: '#e00000', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}
          >
            <Save size={18} /> Salvar Proposta
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onGenerateBudget}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4"
              style={{ background: '#1e3a5f', border: '1px solid #2d5a8f', color: '#60a5fa', cursor: 'pointer' }}
            >
              <FileText size={20} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Orçamento PDF</span>
            </button>
            <button
              onClick={onGenerateContract}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4"
              style={{ background: '#2d1f4f', border: '1px solid #4a3580', color: '#a78bfa', cursor: 'pointer' }}
            >
              <Printer size={20} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Contrato PDF</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 rounded-2xl"
            style={{ height: 48, background: '#1a1a1a', border: '1px solid #2e2e2e', color: '#777', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            <RotateCcw size={15} /> Resetar Formulário
          </button>
        </div>
      </div>
    );
  }

  /* ─── Desktop layout ─── */
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="flex gap-4">
        {[
          { label: 'Custo Total', value: formatBRL(totalCost), icon: Receipt, accent: '#60a5fa', sub: 'Soma dos itens incluídos' },
          { label: 'Margem de Lucro', value: formatBRL(profitAmount), icon: TrendingUp, accent: '#a78bfa', sub: `${profitMargin}% sobre o custo total` },
          { label: 'Cachê Proposto', value: formatBRL(proposedFee), icon: DollarSign, accent: '#e00000', sub: `${marginPercent.toFixed(1)}% de margem líquida` },
        ].map(({ label, value, icon: Icon, accent, sub }) => (
          <div key={label} className="flex-1 rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#141414', border: '1px solid #232323' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{label}</span>
              <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: accent + '22' }}>
                <Icon size={18} color={accent} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: accent, lineHeight: 1.1 }}>{value}</div>
              {sub && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Margin slider */}
      <div className="rounded-2xl p-5" style={{ background: '#141414', border: '1px solid #232323' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#d0d0d0' }}>🎯 Margem de Lucro</div>
            <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>Ajuste o percentual aplicado sobre o custo total</div>
          </div>
          <div className="flex items-center justify-center rounded-xl px-4 py-2" style={{ background: '#e0000022', border: '1px solid #e0000044' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#e00000' }}>{profitMargin}%</span>
          </div>
        </div>

        <input
          type="range" min={0} max={200} step={1} value={profitMargin}
          onChange={e => setProfitMargin(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#e00000', height: 6, cursor: 'pointer' }}
        />

        <div className="flex justify-between mt-2">
          {[0, 10, 20, 30, 50, 75, 100, 150, 200].map(v => (
            <button
              key={v}
              onClick={() => setProfitMargin(v)}
              className="rounded-md px-2 py-1 text-xs transition-colors"
              style={{
                background: profitMargin === v ? '#e00000' : '#1f1f1f',
                color: profitMargin === v ? '#fff' : '#777',
                border: 'none', cursor: 'pointer',
                fontWeight: profitMargin === v ? 600 : 400,
              }}
            >
              {v}%
            </button>
          ))}
        </div>

        {proposedFee > 0 && (
          <div className="mt-4">
            <div className="flex justify-between mb-1.5" style={{ fontSize: 11, color: '#666' }}>
              <span>Custo ({((totalCost / proposedFee) * 100).toFixed(1)}%)</span>
              <span>Lucro ({((profitAmount / proposedFee) * 100).toFixed(1)}%)</span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 8, background: '#1f1f1f' }}>
              <div style={{
                height: '100%',
                width: `${(totalCost / proposedFee) * 100}%`,
                background: 'linear-gradient(90deg, #60a5fa, #818cf8)',
                borderRadius: 4,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="rounded-2xl p-5" style={{ background: '#141414', border: '1px solid #232323' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#d0d0d0', marginBottom: 14 }}>📄 Ações e Documentos</div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Gerar Orçamento PDF', icon: FileText, bg: '#1e3a5f', border: '#2d5a8f', color: '#60a5fa', action: onGenerateBudget },
            { label: 'Gerar Contrato PDF', icon: Printer, bg: '#2d1f4f', border: '#4a3580', color: '#a78bfa', action: onGenerateContract },
            { label: 'Salvar Proposta', icon: Save, bg: '#e00000', border: 'transparent', color: '#fff', action: onSave, accent: true },
            { label: 'Resetar Formulário', icon: RotateCcw, bg: '#1f1f1f', border: '#2e2e2e', color: '#888', action: onReset },
          ].map(({ label, icon: Icon, bg, border, color, action, accent }) => (
            <button
              key={label}
              onClick={action}
              className="flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color, cursor: 'pointer', fontWeight: accent ? 700 : 600, fontSize: 14 }}
              onMouseEnter={e => !accent && (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}