import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { BudgetItem } from '../App';

interface EditItemSheetProps {
  item: BudgetItem;
  onSave: (item: BudgetItem) => void;
  onDelete: () => void;
  onClose: () => void;
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: '#202020',
  border: '1px solid #2e2e2e',
  borderRadius: 12,
  padding: '13px 16px',
  fontSize: 16,
  color: '#f0f0f0',
  outline: 'none',
  WebkitAppearance: 'none',
};

export function EditItemSheet({ item, onSave, onDelete, onClose }: EditItemSheetProps) {
  const [draft, setDraft] = useState({ ...item });
  const [visible, setVisible] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Small delay then focus first input
    const t = setTimeout(() => firstInputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSave = () => {
    onSave(draft);
    close();
  };

  const handleDelete = () => {
    if (confirm('Remover este item do orçamento?')) {
      onDelete();
      close();
    }
  };

  const lineTotal = draft.quantity * draft.unitValue;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'rgba(0,0,0,0.7)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 61,
          background: '#1a1a1a',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid #2e2e2e',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 36, height: 4, background: '#3a3a3a', borderRadius: 2 }} />
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between py-1">
            <h3 style={{ fontSize: 19, fontWeight: 700, color: '#f0f0f0' }}>Editar Item</h3>
            <button
              onClick={close}
              className="flex items-center justify-center rounded-full"
              style={{ width: 34, height: 34, background: '#2a2a2a', border: 'none', cursor: 'pointer', color: '#aaa' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Name */}
          <div>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 7, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Nome</label>
            <input
              ref={firstInputRef}
              type="text"
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
              style={fieldStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#e00000')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 7, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Descrição</label>
            <input
              type="text"
              value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
              style={fieldStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#e00000')}
              onBlur={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
            />
          </div>

          {/* Qty + Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 7, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Quantidade</label>
              <input
                type="number"
                value={draft.quantity === 0 ? '' : draft.quantity}
                placeholder="0"
                onChange={e => setDraft(d => ({ ...d, quantity: Math.max(0, Number(e.target.value) || 0) }))}
                style={{ ...fieldStyle, textAlign: 'center' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#e00000')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 7, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Valor Unit. R$</label>
              <input
                type="number"
                value={draft.unitValue === 0 ? '' : draft.unitValue}
                placeholder="0,00"
                onChange={e => setDraft(d => ({ ...d, unitValue: Math.max(0, Number(e.target.value) || 0) }))}
                style={{ ...fieldStyle, textAlign: 'right' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#e00000')}
                onBlur={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
              />
            </div>
          </div>

          {/* Total preview */}
          <div
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ background: '#141414', border: '1px solid #232323' }}
          >
            <span style={{ fontSize: 14, color: '#888' }}>Total do item</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: lineTotal > 0 ? '#22c55e' : '#555' }}>
              {formatBRL(lineTotal)}
            </span>
          </div>

          {/* Include toggle */}
          <div
            className="flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ background: '#141414', border: '1px solid #232323' }}
          >
            <div>
              <div style={{ fontSize: 15, color: '#e0e0e0', fontWeight: 500 }}>Incluir no orçamento</div>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                {draft.include ? 'Item será somado ao total' : 'Item não contabilizado'}
              </div>
            </div>
            <button
              onClick={() => setDraft(d => ({ ...d, include: !d.include }))}
              style={{
                width: 52,
                height: 30,
                borderRadius: 15,
                background: draft.include ? '#e00000' : '#2e2e2e',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: draft.include ? 25 : 3,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 rounded-2xl"
              style={{
                flex: '0 0 52px',
                height: 52,
                background: '#2a1a1a',
                border: '1px solid #4a2020',
                color: '#f87171',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={close}
              className="flex items-center justify-center gap-2 rounded-2xl"
              style={{
                flex: 1,
                height: 52,
                background: '#1f1f1f',
                border: '1px solid #2e2e2e',
                color: '#aaa',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-2xl"
              style={{
                flex: 1,
                height: 52,
                background: '#e00000',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              <Check size={17} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}