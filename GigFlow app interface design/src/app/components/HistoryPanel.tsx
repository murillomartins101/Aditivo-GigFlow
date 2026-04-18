import React, { useRef } from 'react';
import {
  Download, Upload, Trash2, FolderOpen, Clock,
  MapPin, Music2, DollarSign, Users, Calendar, FileJson
} from 'lucide-react';
import { Proposal } from '../App';
import { useIsMobile } from '../hooks/useIsMobile';

interface HistoryPanelProps {
  proposals: Proposal[];
  onLoad: (p: Proposal) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

function Chip({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg px-2 py-1" style={{ background: color + '18', border: `1px solid ${color}33` }}>
      <Icon size={10} color={color} />
      <span style={{ fontSize: 11, color, fontWeight: 500 }}>{children}</span>
    </div>
  );
}

export function HistoryPanel({ proposals, onLoad, onDelete, onExport, onImport }: HistoryPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const emptyState = (
    <div
      className="flex flex-col items-center justify-center text-center rounded-2xl py-16 mx-4"
      style={{ background: '#141414', border: '2px dashed #2a2a2a' }}
    >
      <div className="flex items-center justify-center rounded-2xl mb-4"
        style={{ width: 68, height: 68, background: '#1a1a1a' }}>
        <Clock size={28} color="#444" />
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: '#666', marginBottom: 6 }}>Nenhuma proposta salva</div>
      <div style={{ fontSize: 13, color: '#555', maxWidth: 280 }}>
        Preencha o orçamento e toque em{' '}
        <strong style={{ color: '#e00000' }}>Salvar Proposta</strong>{' '}
        no Resumo para criar o histórico.
      </div>
    </div>
  );

  return (
    <div className="space-y-4" style={{ paddingBottom: isMobile ? 100 : 40 }}>
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 pt-5 pb-2"
        style={{ flexWrap: isMobile ? 'wrap' : 'nowrap', gap: 12 }}
      >
        <div>
          <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: '#f0f0f0' }}>
            📋 Histórico
          </h1>
          <p style={{ fontSize: 13, color: '#777', marginTop: 2 }}>
            {proposals.length === 0 ? 'Nenhuma proposta salva' : `${proposals.length} proposta(s)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm"
            style={{ background: '#1e1e1e', border: '1px solid #2e2e2e', color: '#aaa', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            <Upload size={14} />
            {!isMobile && 'Importar '}JSON
          </button>
          <input
            ref={fileRef} type="file" accept=".json" className="hidden"
            onChange={e => { if (e.target.files?.[0]) { onImport(e.target.files[0]); e.target.value = ''; } }}
          />
          <button
            onClick={onExport}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm"
            style={{ background: '#e00000', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            <Download size={14} />
            {!isMobile && 'Exportar '}JSON
          </button>
        </div>
      </div>

      {/* ── List ── */}
      {proposals.length === 0 ? (
        emptyState
      ) : (
        <div className="space-y-3 px-4">
          {proposals.map((proposal, idx) => {
            const includedCount = proposal.budgetItems.filter(i => i.include).length;
            const totalPeople = proposal.teamComposition.members + proposal.teamComposition.supportTeam + proposal.teamComposition.companions;

            return (
              <div
                key={proposal.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#141414',
                  border: '1px solid #232323',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => !isMobile && (e.currentTarget.style.borderColor = '#e0000044')}
                onMouseLeave={e => !isMobile && (e.currentTarget.style.borderColor = '#232323')}
              >
                {/* Card body */}
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#e00000' }}>
                          #{proposals.length - idx}
                        </span>
                        <Music2 size={14} color="#888" />
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {proposal.eventInfo.bandName || 'Banda sem nome'}
                        </span>
                        <span className="rounded-full px-2 py-0.5"
                          style={{ fontSize: 11, background: '#e0000018', color: '#e00000', border: '1px solid #e0000030', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {proposal.eventInfo.eventType}
                        </span>
                      </div>
                      {proposal.eventInfo.clientName && (
                        <div style={{ fontSize: 13, color: '#888' }}>
                          Cliente: <span style={{ color: '#bbb' }}>{proposal.eventInfo.clientName}</span>
                        </div>
                      )}
                    </div>

                    {/* Fee */}
                    <div className="text-right shrink-0">
                      <div style={{ fontSize: 10, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cachê</div>
                      <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: '#22c55e', lineHeight: 1.1 }}>
                        {formatBRL(proposal.proposedFee)}
                      </div>
                      <div style={{ fontSize: 11, color: '#666' }}>margem {proposal.profitMargin}%</div>
                    </div>
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proposal.eventInfo.eventDate && (
                      <Chip icon={Calendar} color="#60a5fa">
                        {formatDate(proposal.eventInfo.eventDate)}
                        {proposal.eventInfo.eventTime ? ` · ${proposal.eventInfo.eventTime}` : ''}
                      </Chip>
                    )}
                    {(proposal.eventInfo.eventCity || proposal.eventInfo.eventVenue) && (
                      <Chip icon={MapPin} color="#f472b6">
                        {[proposal.eventInfo.eventVenue, proposal.eventInfo.eventCity].filter(Boolean).join(', ')}
                      </Chip>
                    )}
                    <Chip icon={Users} color="#a78bfa">{totalPeople} pessoa(s)</Chip>
                    <Chip icon={DollarSign} color="#34d399">{formatBRL(proposal.totalCost)} · {includedCount} itens</Chip>
                  </div>

                  <div style={{ fontSize: 11, color: '#555' }}>💾 {formatDateTime(proposal.createdAt)}</div>
                </div>

                {/* Action row */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ borderTop: '1px solid #1e1e1e', background: '#111' }}
                >
                  <button
                    onClick={() => onLoad(proposal)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5"
                    style={{ background: '#1a2d1a', border: '1px solid #2a4a2a', color: '#4ade80', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
                  >
                    <FolderOpen size={15} /> Carregar
                  </button>
                  <button
                    onClick={() => { if (confirm('Remover proposta?')) onDelete(proposal.id); }}
                    className="flex items-center justify-center rounded-xl"
                    style={{ width: 42, height: 42, background: '#2a1a1a', border: '1px solid #4a2020', color: '#f87171', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer tip */}
      <div className="mx-4 rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: '#141414', border: '1px solid #232323' }}>
        <FileJson size={16} color="#777" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: '#666' }}>
          <strong style={{ color: '#888' }}>Dica:</strong> Exporte em JSON para backup e importe em outros dispositivos.
          Os dados ficam na sessão atual do navegador.
        </div>
      </div>
    </div>
  );
}