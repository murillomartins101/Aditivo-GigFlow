import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, CheckSquare, Square, Pencil, ChevronRight } from 'lucide-react';
import { BudgetItem } from '../App';
import { EditItemSheet } from './EditItemSheet';
import { useIsMobile } from '../hooks/useIsMobile';

interface BudgetTableProps {
  items: BudgetItem[];
  setItems: (items: BudgetItem[]) => void;
}

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

/* ─── Inline editable cell (desktop only) ─── */
function EditableCell({
  value, onSave, type = 'text', placeholder = '', align = 'left',
}: {
  value: string | number; onSave: (v: string) => void;
  type?: string; placeholder?: string; align?: 'left' | 'right' | 'center';
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => { setEditing(false); onSave(draft); };

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(String(value)); setEditing(false); }
        }}
        style={{
          width: '100%', background: '#1a1a1a', border: '1px solid #e00000',
          borderRadius: 6, padding: '4px 8px', fontSize: 13, color: '#f0f0f0',
          outline: 'none', textAlign: align,
        }}
      />
    );
  }

  return (
    <div
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      title="Clique para editar"
      style={{
        cursor: 'text', padding: '4px 6px', borderRadius: 6, fontSize: 13,
        color: type === 'number' && Number(value) === 0 ? '#555' : '#d0d0d0',
        textAlign: align, minHeight: 28, transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#202020')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {type === 'number' ? value : ((value as string) || <span style={{ color: '#555', fontStyle: 'italic' }}>{placeholder}</span>)}
    </div>
  );
}

/* ─── Mobile Item Card ─── */
function MobileItemCard({
  item, index, onEdit, onToggle,
}: {
  item: BudgetItem; index: number; onEdit: () => void; onToggle: () => void;
}) {
  const lineTotal = item.quantity * item.unitValue;

  return (
    <div
      style={{
        background: item.include ? '#161616' : '#111',
        border: `1px solid ${item.include ? '#242424' : '#1c1c1c'}`,
        borderRadius: 16,
        overflow: 'hidden',
        opacity: item.include ? 1 : 0.55,
        transition: 'all 0.2s',
      }}
    >
      <div className="flex items-stretch">
        {/* Include toggle strip */}
        <button
          onClick={onToggle}
          style={{
            width: 44,
            background: item.include ? '#e0000012' : 'transparent',
            border: 'none',
            borderRight: `2px solid ${item.include ? '#e00000' : '#222'}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          {item.include
            ? <CheckSquare size={18} color="#e00000" />
            : <Square size={18} color="#444" />}
        </button>

        {/* Main content – tap to edit */}
        <button
          onClick={onEdit}
          className="flex-1 text-left px-4 py-3"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f0f0', marginBottom: 2 }}>
                {item.name || <span style={{ color: '#555', fontStyle: 'italic' }}>Sem nome</span>}
              </div>
              {item.description && (
                <div style={{ fontSize: 12, color: '#777', marginBottom: 6, lineHeight: 1.3 }}>{item.description}</div>
              )}
              <div className="flex items-center gap-1.5" style={{ flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#888' }}>{item.quantity} × {formatBRL(item.unitValue)}</span>
                <span style={{ fontSize: 12, color: '#555' }}>=</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: lineTotal > 0 ? '#22c55e' : '#555' }}>
                  {formatBRL(lineTotal)}
                </span>
              </div>
            </div>
            <ChevronRight size={16} color="#444" style={{ flexShrink: 0, marginTop: 2 }} />
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function BudgetTable({ items, setItems }: BudgetTableProps) {
  const isMobile = useIsMobile();
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  const update = (id: string, changes: Partial<BudgetItem>) => {
    setItems(items.map(item => (item.id === id ? { ...item, ...changes } : item)));
  };

  const addItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: 'Novo Item',
      description: '',
      quantity: 1,
      unitValue: 0,
      include: true,
    };
    setItems([...items, newItem]);
    if (isMobile) setEditingItem(newItem);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const includedItems = items.filter(i => i.include);
  const excludedItems = items.filter(i => !i.include);
  const subtotal = includedItems.reduce((s, i) => s + i.quantity * i.unitValue, 0);

  /* ────────────────────────────────────────
   *  MOBILE VIEW
   * ──────────────────────────────────────── */
  if (isMobile) {
    return (
      <>
        <div className="space-y-3 px-4" style={{ paddingBottom: 80 }}>
          {/* Sticky mini-total bar */}
          <div
            className="rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            <div>
              <div style={{ fontSize: 11, color: '#777', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Subtotal ({includedItems.length} itens)
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#e00000', lineHeight: 1.1 }}>
                {formatBRL(subtotal)}
              </div>
            </div>
            <button
              onClick={addItem}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{ background: '#e00000', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14, flexShrink: 0 }}
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>

          {/* Included items */}
          {includedItems.length > 0 && (
            <div className="space-y-2">
              <div style={{ fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 4 }}>
                ✅ Incluídos ({includedItems.length})
              </div>
              {includedItems.map((item, idx) => (
                <MobileItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onEdit={() => setEditingItem(item)}
                  onToggle={() => update(item.id, { include: false })}
                />
              ))}
            </div>
          )}

          {/* Excluded items */}
          {excludedItems.length > 0 && (
            <div className="space-y-2 mt-4">
              <div style={{ fontSize: 11, color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: 4 }}>
                ⬜ Não incluídos ({excludedItems.length})
              </div>
              {excludedItems.map((item, idx) => (
                <MobileItemCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onEdit={() => setEditingItem(item)}
                  onToggle={() => update(item.id, { include: true })}
                />
              ))}
            </div>
          )}

          {items.length === 0 && (
            <div className="text-center py-12">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 16, color: '#666' }}>Nenhum item ainda</div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>Toque em "Adicionar" para começar</div>
            </div>
          )}
        </div>

        {/* Edit sheet */}
        {editingItem && (
          <EditItemSheet
            item={editingItem}
            onSave={updated => {
              if (items.find(i => i.id === updated.id)) {
                update(updated.id, updated);
              } else {
                setItems([...items, updated]);
              }
              setEditingItem(null);
            }}
            onDelete={() => { removeItem(editingItem.id); setEditingItem(null); }}
            onClose={() => setEditingItem(null)}
          />
        )}
      </>
    );
  }

  /* ────────────────────────────────────────
   *  DESKTOP VIEW (table)
   * ──────────────────────────────────────── */
  const thStyle: React.CSSProperties = {
    padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', whiteSpace: 'nowrap',
  };
  const tdStyle: React.CSSProperties = {
    padding: '6px 12px', verticalAlign: 'middle', borderBottom: '1px solid #1e1e1e',
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#141414', border: '1px solid #232323' }}>
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
              <th style={{ ...thStyle, width: 32 }}></th>
              <th style={{ ...thStyle, width: '18%' }}>Item</th>
              <th style={thStyle}>Descrição</th>
              <th style={{ ...thStyle, width: '10%', textAlign: 'center' }}>Qtd</th>
              <th style={{ ...thStyle, width: '15%', textAlign: 'right' }}>Valor Unit.</th>
              <th style={{ ...thStyle, width: '15%', textAlign: 'right' }}>Total</th>
              <th style={{ ...thStyle, width: 70, textAlign: 'center' }}>Incluir</th>
              <th style={{ ...thStyle, width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const lineTotal = item.quantity * item.unitValue;
              return (
                <tr key={item.id} style={{
                  background: item.include
                    ? (idx % 2 === 0 ? '#141414' : '#161616')
                    : '#111',
                  opacity: item.include ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}>
                  <td style={{ ...tdStyle, paddingRight: 0, color: '#444' }}><GripVertical size={14} /></td>
                  <td style={tdStyle}>
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: 12, color: '#555', minWidth: 20 }}>{idx + 1}.</span>
                      <EditableCell value={item.name} onSave={v => update(item.id, { name: v })} placeholder="Nome" />
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <EditableCell value={item.description} onSave={v => update(item.id, { description: v })} placeholder="Descrição" />
                  </td>
                  <td style={tdStyle}>
                    <EditableCell value={item.quantity} onSave={v => update(item.id, { quantity: Math.max(0, Number(v) || 0) })} type="number" align="center" />
                  </td>
                  <td style={tdStyle}>
                    <EditableCell value={item.unitValue} onSave={v => update(item.id, { unitValue: Math.max(0, Number(v) || 0) })} type="number" align="right" />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: lineTotal > 0 ? '#22c55e' : '#555' }}>
                      {formatBRL(lineTotal)}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button onClick={() => update(item.id, { include: !item.include })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      {item.include ? <CheckSquare size={17} color="#e00000" /> : <Square size={17} color="#555" />}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center justify-center rounded-lg"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', width: 28, height: 28, color: '#555' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#2a1a1a'; e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #2a2a2a', background: '#1a1a1a' }}>
        <button
          onClick={addItem}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all"
          style={{ background: '#e00000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#c00000')}
          onMouseLeave={e => (e.currentTarget.style.background = '#e00000')}
        >
          <Plus size={15} /> Adicionar Item
        </button>
        <div className="flex items-center gap-6">
          <span style={{ fontSize: 12, color: '#777' }}>{includedItems.length} de {items.length} incluídos</span>
          <div className="text-right">
            <div style={{ fontSize: 11, color: '#777' }}>Subtotal</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e00000' }}>{formatBRL(subtotal)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}