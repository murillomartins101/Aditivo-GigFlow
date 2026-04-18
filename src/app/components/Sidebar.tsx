import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Calendar, MapPin, Users, Zap, FileText, X } from 'lucide-react';
import { EventInfo, TeamComposition, EnergyReqs, ContractClauses } from '../App';

interface SidebarProps {
  eventInfo: EventInfo;
  setEventInfo: (info: EventInfo) => void;
  teamComposition: TeamComposition;
  setTeamComposition: (team: TeamComposition) => void;
  energyReqs: EnergyReqs;
  setEnergyReqs: (reqs: EnergyReqs) => void;
  contractClauses: ContractClauses;
  setContractClauses: (clauses: ContractClauses) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

/* ─── Shared input styles ─── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#202020',
  border: '1px solid #2e2e2e',
  borderRadius: 10,
  padding: '9px 12px',
  fontSize: 14,
  color: '#e5e5e5',
  outline: 'none',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#888',
  marginBottom: 6,
  display: 'block',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function SInput({ value, onChange, placeholder = '', type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={e => (e.currentTarget.style.borderColor = '#e00000')}
      onBlur={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
    />
  );
}

function STextarea({ value, onChange, rows = 2 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
      onFocus={e => (e.currentTarget.style.borderColor = '#e00000')}
      onBlur={e => (e.currentTarget.style.borderColor = '#2e2e2e')}
    />
  );
}

function SSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: 'pointer' }}
    >
      {options.map(o => (
        <option key={o} value={o} style={{ background: '#1f1f1f' }}>{o}</option>
      ))}
    </select>
  );
}

function Counter({ value, onChange, min = 0, max = 99 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{
          width: 40, height: 40,
          borderRadius: 10,
          border: '1px solid #2e2e2e',
          background: value <= min ? '#181818' : '#252525',
          color: value <= min ? '#444' : '#ccc',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          fontSize: 20, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >−</button>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ ...inputStyle, width: 70, textAlign: 'center', padding: '8px' }}
        min={min} max={max}
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{
          width: 40, height: 40,
          borderRadius: 10,
          border: '1px solid #2e2e2e',
          background: value >= max ? '#181818' : '#252525',
          color: value >= max ? '#444' : '#ccc',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          fontSize: 20, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >+</button>
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #1e1e1e' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#e0000020', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={15} color="#e00000" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#d0d0d0' }}>{title}</span>
        </div>
        {open ? <ChevronDown size={15} color="#555" /> : <ChevronRight size={15} color="#555" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  eventInfo, setEventInfo,
  teamComposition, setTeamComposition,
  energyReqs, setEnergyReqs,
  contractClauses, setContractClauses,
  isMobile = false,
  onClose,
}: SidebarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isMobile) {
      requestAnimationFrame(() => setVisible(true));
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isMobile]);

  const handleClose = () => {
    if (isMobile) {
      setVisible(false);
      setTimeout(() => onClose?.(), 280);
    } else {
      onClose?.();
    }
  };

  const upEv = (k: keyof EventInfo, v: string) => setEventInfo({ ...eventInfo, [k]: v });
  const upTm = (k: keyof TeamComposition, v: number) => setTeamComposition({ ...teamComposition, [k]: v });
  const upEn = (k: keyof EnergyReqs, v: string | boolean) => setEnergyReqs({ ...energyReqs, [k]: v });
  const upCl = (k: keyof ContractClauses, v: string | number) => setContractClauses({ ...contractClauses, [k]: v });

  const totalPeople = teamComposition.members + teamComposition.supportTeam + teamComposition.companions;

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 70,
            background: 'rgba(0,0,0,0.75)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.28s',
          }}
        />
        {/* Drawer */}
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            zIndex: 71,
            width: '88vw',
            maxWidth: 360,
            background: '#141414',
            borderRight: '1px solid #232323',
            overflowY: 'auto',
            transform: visible ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-5 py-4 sticky top-0"
            style={{ background: '#141414', borderBottom: '1px solid #232323', zIndex: 1 }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: '#f0f0f0' }}>⚙️ Detalhes do Show</div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center rounded-full"
              style={{ width: 36, height: 36, background: '#2a2a2a', border: 'none', cursor: 'pointer', color: '#aaa' }}
            >
              <X size={16} />
            </button>
          </div>
          <SidebarContent
            eventInfo={eventInfo} upEv={upEv}
            teamComposition={teamComposition} upTm={upTm} totalPeople={totalPeople}
            energyReqs={energyReqs} upEn={upEn}
            contractClauses={contractClauses} upCl={upCl}
          />
          <div style={{ height: 80 }} />
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className="flex flex-col overflow-y-auto shrink-0"
      style={{ width: 280, background: '#141414', borderRight: '1px solid #232323', height: '100%' }}
    >
      <SidebarContent
        eventInfo={eventInfo} upEv={upEv}
        teamComposition={teamComposition} upTm={upTm} totalPeople={totalPeople}
        energyReqs={energyReqs} upEn={upEn}
        contractClauses={contractClauses} upCl={upCl}
      />
      <div style={{ height: 20 }} />
    </aside>
  );
}

function SidebarContent({
  eventInfo, upEv,
  teamComposition, upTm, totalPeople,
  energyReqs, upEn,
  contractClauses, upCl,
}: any) {
  return (
    <>
      <Section title="Informações do Evento" icon={Calendar} defaultOpen={true}>
        <Field label="Banda / Artista">
          <SInput value={eventInfo.bandName} onChange={v => upEv('bandName', v)} placeholder="Ex: Banda Vibe" />
        </Field>
        <Field label="Contratante">
          <SInput value={eventInfo.clientName} onChange={v => upEv('clientName', v)} placeholder="Nome completo" />
        </Field>
        <Field label="CNPJ / CPF">
          <SInput value={eventInfo.cnpjClient} onChange={v => upEv('cnpjClient', v)} placeholder="00.000.000/0000-00" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data">
            <SInput type="date" value={eventInfo.eventDate} onChange={v => upEv('eventDate', v)} />
          </Field>
          <Field label="Horário">
            <SInput type="time" value={eventInfo.eventTime} onChange={v => upEv('eventTime', v)} />
          </Field>
        </div>
        <Field label="Local / Espaço">
          <SInput value={eventInfo.eventVenue} onChange={v => upEv('eventVenue', v)} placeholder="Nome do local" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cidade">
            <SInput value={eventInfo.eventCity} onChange={v => upEv('eventCity', v)} placeholder="Cidade" />
          </Field>
          <Field label="Estado">
            <SInput value={eventInfo.eventState} onChange={v => upEv('eventState', v)} placeholder="SP" />
          </Field>
        </div>
        <Field label="Tipo de Evento">
          <SSelect
            value={eventInfo.eventType}
            onChange={v => upEv('eventType', v)}
            options={['Show ao Vivo','Casamento','Corporativo','Festa Privada','Festival','Formatatura','Bar/Restaurante','Outro']}
          />
        </Field>
        <Field label="Duração do Set (min)">
          <SInput type="number" value={eventInfo.setDuration} onChange={v => upEv('setDuration', v)} placeholder="60" />
        </Field>
        <Field label="Sonorização / Iluminação">
          <STextarea value={eventInfo.soundLighting} onChange={v => upEv('soundLighting', v)} rows={2} />
        </Field>
        <Field label="Obrigações do Contratante">
          <STextarea value={eventInfo.contractingResponsibility} onChange={v => upEv('contractingResponsibility', v)} rows={2} />
        </Field>
      </Section>

      <Section title="Composição da Equipe" icon={Users} defaultOpen={true}>
        <Field label="Músicos (integrantes)">
          <Counter value={teamComposition.members} onChange={v => upTm('members', v)} />
        </Field>
        <Field label="Equipe de Apoio">
          <Counter value={teamComposition.supportTeam} onChange={v => upTm('supportTeam', v)} />
        </Field>
        <Field label="Acompanhantes">
          <Counter value={teamComposition.companions} onChange={v => upTm('companions', v)} />
        </Field>
        <div className="flex items-center justify-between rounded-xl px-4 py-3 mt-1" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
          <span style={{ fontSize: 13, color: '#888' }}>Total de pessoas</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#e00000' }}>{totalPeople}</span>
        </div>
      </Section>

      <Section title="Energia (NBR 5410)" icon={Zap} defaultOpen={false}>
        <Field label="Potência do Gerador (kVA)">
          <SInput value={energyReqs.generatorPower} onChange={v => upEn('generatorPower', v)} placeholder="Ex: 30 kVA" />
        </Field>
        <Field label="Disjuntores / Circuitos">
          <SInput value={energyReqs.circuitBreakers} onChange={v => upEn('circuitBreakers', v)} placeholder="Ex: 3×63A trifásico" />
        </Field>
        <div className="flex items-center gap-3 py-1">
          <input
            type="checkbox"
            id="techVisit"
            checked={energyReqs.technicalVisit}
            onChange={e => upEn('technicalVisit', e.target.checked)}
            style={{ accentColor: '#e00000', width: 18, height: 18, cursor: 'pointer' }}
          />
          <label htmlFor="techVisit" style={{ fontSize: 14, color: '#ccc', cursor: 'pointer' }}>
            Visita técnica prévia necessária
          </label>
        </div>
      </Section>

      <Section title="Cláusulas Contratuais" icon={FileText} defaultOpen={true}>
        <Field label="Multa por descumprimento (%)">
          <div className="flex items-center gap-3">
            <Counter value={contractClauses.penaltyPercentage} onChange={v => upCl('penaltyPercentage', v)} min={0} max={100} />
            <span style={{ color: '#888' }}>%</span>
          </div>
        </Field>
        <Field label="Sinal / Antecipado (%)">
          <div className="flex items-center gap-3">
            <Counter value={contractClauses.paymentAdvance} onChange={v => upCl('paymentAdvance', v)} min={0} max={100} />
            <span style={{ color: '#888' }}>%</span>
          </div>
        </Field>
        <Field label="Foro">
          <SInput value={contractClauses.venue} onChange={v => upCl('venue', v)} placeholder="Ex: Comarca de SP/SP" />
        </Field>
        <Field label="Cláusulas Adicionais">
          <STextarea value={contractClauses.additionalClauses} onChange={v => upCl('additionalClauses', v)} rows={3} />
        </Field>
      </Section>
    </>
  );
}