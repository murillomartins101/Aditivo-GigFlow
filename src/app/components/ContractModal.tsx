import React, { useRef, useEffect, useState } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { BudgetItem, EventInfo, TeamComposition, ContractClauses, EnergyReqs } from '../App';
import { useIsMobile } from '../hooks/useIsMobile';

interface ContractModalProps {
  type: 'budget' | 'contract';
  eventInfo: EventInfo;
  teamComposition: TeamComposition;
  energyReqs: EnergyReqs;
  budgetItems: BudgetItem[];
  profitMargin: number;
  totalCost: number;
  profitAmount: number;
  proposedFee: number;
  contractClauses: ContractClauses;
  onClose: () => void;
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatDate = (s: string) => {
  if (!s) return '___/___/______';
  return new Date(s + 'T12:00:00').toLocaleDateString('pt-BR');
};

const numWords = (n: number): string => {
  const units = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
  const tens = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
  const hundreds = ['','cem','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];

  if (n === 0) return 'zero reais';
  const int = Math.floor(n);
  const cents = Math.round((n - int) * 100);

  const toWords = (num: number): string => {
    if (num === 0) return '';
    if (num < 20) return units[num];
    if (num < 100) {
      const t = tens[Math.floor(num / 10)];
      const u = num % 10;
      return u === 0 ? t : `${t} e ${units[u]}`;
    }
    if (num < 1000) {
      const h = Math.floor(num / 100);
      const rest = num % 100;
      const hWord = num === 100 ? 'cem' : hundreds[h];
      return rest === 0 ? hWord : `${hWord} e ${toWords(rest)}`;
    }
    if (num < 1000000) {
      const t = Math.floor(num / 1000);
      const rest = num % 1000;
      const tWord = t === 1 ? 'mil' : `${toWords(t)} mil`;
      return rest === 0 ? tWord : `${tWord} e ${toWords(rest)}`;
    }
    return num.toString();
  };

  let result = `${toWords(int)} real${int !== 1 ? 's' : ''}`;
  if (cents > 0) result += ` e ${toWords(cents)} centavo${cents !== 1 ? 's' : ''}`;
  return result;
};

export function ContractModal({
  type, eventInfo, teamComposition, energyReqs, budgetItems,
  profitMargin, totalCost, profitAmount, proposedFee,
  contractClauses, onClose,
}: ContractModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const includedItems = budgetItems.filter(i => i.include);
  const advanceAmount = proposedFee * (contractClauses.paymentAdvance / 100);
  const remainingAmount = proposedFee - advanceAmount;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><title>${type === 'budget' ? 'Orçamento' : 'Contrato'} – GigFlow</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Georgia',serif;font-size:13px;color:#111;background:#fff;padding:40px;}h1{font-size:22px;margin-bottom:4px;}h2{font-size:15px;margin:20px 0 8px;color:#333;border-bottom:1px solid #ddd;padding-bottom:4px;}table{width:100%;border-collapse:collapse;margin:10px 0;}th{background:#f5f5f5;padding:8px 10px;text-align:left;font-size:12px;border:1px solid #ddd;}td{padding:7px 10px;border:1px solid #ddd;font-size:12px;}.right{text-align:right;}.total-row{background:#fff3e0;font-weight:bold;}.fee-row{background:#e8f5e9;font-weight:bold;font-size:14px;}p{margin-bottom:8px;line-height:1.6;}@media print{body{padding:20px;}button{display:none!important;}}</style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const docContent = (
    <div ref={printRef} style={{
      background: '#fff', color: '#111', padding: isMobile ? '24px 20px' : '40px',
      borderRadius: isMobile ? 0 : 12,
      fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.6,
    }}>
      {type === 'budget' ? (
        <BudgetDocument
          eventInfo={eventInfo} teamComposition={teamComposition}
          includedItems={includedItems} totalCost={totalCost}
          profitMargin={profitMargin} profitAmount={profitAmount}
          proposedFee={proposedFee} advanceAmount={advanceAmount}
          remainingAmount={remainingAmount} contractClauses={contractClauses}
        />
      ) : (
        <ContractDocument
          eventInfo={eventInfo} teamComposition={teamComposition}
          energyReqs={energyReqs}
          includedItems={includedItems} totalCost={totalCost}
          profitMargin={profitMargin} profitAmount={profitAmount}
          proposedFee={proposedFee} advanceAmount={advanceAmount}
          remainingAmount={remainingAmount} contractClauses={contractClauses}
        />
      )}
    </div>
  );

  /* ── Mobile: full-screen sheet ── */
  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: '#0f0f0f',
          display: 'flex', flexDirection: 'column',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ background: '#141414', borderBottom: '1px solid #232323' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: type === 'budget' ? '#1e3a5f' : '#2d1f4f' }}>
              <FileText size={17} color={type === 'budget' ? '#60a5fa' : '#a78bfa'} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f0f0' }}>
                {type === 'budget' ? 'Orçamento' : 'Contrato'}
              </div>
              <div style={{ fontSize: 11, color: '#777' }}>Pré-visualização</div>
            </div>
          </div>
          <button
            onClick={close}
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: '#2a2a2a', border: 'none', cursor: 'pointer', color: '#aaa' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable doc */}
        <div className="flex-1 overflow-y-auto">
          {docContent}
        </div>

        {/* Sticky print button */}
        <div
          className="shrink-0 px-4 py-3"
          style={{ background: '#141414', borderTop: '1px solid #232323', paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
        >
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 rounded-2xl"
            style={{ height: 54, background: '#e00000', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}
          >
            <Printer size={18} /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    );
  }

  /* ── Desktop: modal overlay ── */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: `rgba(0,0,0,${visible ? 0.85 : 0})`, transition: 'background 0.25s' }}
      onClick={e => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          width: '90vw', maxWidth: 860, height: '92vh',
          background: '#141414', border: '1px solid #2a2a2a',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(16px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s, opacity 0.3s',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid #232323', background: '#1a1a1a' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: type === 'budget' ? '#1e3a5f' : '#2d1f4f' }}>
              <FileText size={18} color={type === 'budget' ? '#60a5fa' : '#a78bfa'} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f0' }}>
                {type === 'budget' ? 'Orçamento de Show' : 'Contrato de Prestação de Serviços'}
              </div>
              <div style={{ fontSize: 12, color: '#777' }}>Pré-visualização do documento</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
              style={{ background: '#e00000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <Printer size={15} /> Imprimir / Salvar PDF
            </button>
            <button
              onClick={close}
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: '#2a2a2a', border: 'none', cursor: 'pointer', color: '#aaa' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {docContent}
        </div>
      </div>
    </div>
  );
}

/* ─── Budget Document ─── */
function BudgetDocument({ eventInfo, teamComposition, includedItems, totalCost, profitMargin, profitAmount, proposedFee, advanceAmount, remainingAmount, contractClauses }: any) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:26, fontWeight:800, color:'#cc0000' }}>🎸 GigFlow</div>
          <div style={{ fontSize:11, color:'#888' }}>Calculadora de Cachê Profissional</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:20, fontWeight:700 }}>ORÇAMENTO</div>
          <div style={{ fontSize:12, color:'#666' }}>Nº {Date.now().toString().slice(-6)}</div>
          <div style={{ fontSize:12, color:'#666' }}>Data: {new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
      <hr style={{ borderColor:'#cc0000', borderWidth:2, marginBottom:20 }} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {[
          { title:'Prestador de Serviços', name: eventInfo.bandName || '____________________', sub: `${teamComposition.members} músico(s) · ${teamComposition.supportTeam} apoio` },
          { title:'Contratante', name: eventInfo.clientName || '____________________', sub: eventInfo.cnpjClient ? `CNPJ/CPF: ${eventInfo.cnpjClient}` : '' },
        ].map(({ title, name, sub }) => (
          <div key={title} style={{ background:'#fafafa', borderRadius:8, padding:14, border:'1px solid #eee' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', marginBottom:6 }}>{title}</div>
            <div style={{ fontSize:14, fontWeight:700 }}>{name}</div>
            {sub && <div style={{ fontSize:12, color:'#555', marginTop:3 }}>{sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ background:'#fafafa', borderRadius:8, padding:14, border:'1px solid #eee', marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', marginBottom:8 }}>Dados do Evento</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {[
            ['Tipo', eventInfo.eventType],
            ['Data', formatDate(eventInfo.eventDate)],
            ['Horário', eventInfo.eventTime || '--:--'],
            ['Local', eventInfo.eventVenue || '—'],
            ['Cidade/Estado', `${eventInfo.eventCity||'—'}/${eventInfo.eventState||'—'}`],
            ['Duração', `${eventInfo.setDuration} min`],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize:10, color:'#999', textTransform:'uppercase' }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:600 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <table>
        <thead><tr>
          <th>Item</th><th>Descrição</th>
          <th style={{ textAlign:'center' }}>Qtd</th>
          <th style={{ textAlign:'right' }}>Valor Unit.</th>
          <th style={{ textAlign:'right' }}>Total</th>
        </tr></thead>
        <tbody>
          {includedItems.map((item: BudgetItem, i: number) => (
            <tr key={item.id} style={{ background: i%2===0?'#fff':'#fafafa' }}>
              <td style={{ fontWeight:600 }}>{item.name}</td>
              <td style={{ color:'#555' }}>{item.description}</td>
              <td style={{ textAlign:'center' }}>{item.quantity}</td>
              <td style={{ textAlign:'right' }}>{formatBRL(item.unitValue)}</td>
              <td style={{ textAlign:'right', fontWeight:600 }}>{formatBRL(item.quantity*item.unitValue)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background:'#fff0f0' }}>
            <td colSpan={4} style={{ fontWeight:700, textAlign:'right' }}>CUSTO TOTAL</td>
            <td style={{ fontWeight:700, textAlign:'right' }}>{formatBRL(totalCost)}</td>
          </tr>
          <tr style={{ background:'#f3e5f5' }}>
            <td colSpan={4} style={{ fontWeight:600, textAlign:'right' }}>Margem de Lucro ({profitMargin}%)</td>
            <td style={{ fontWeight:600, textAlign:'right' }}>{formatBRL(profitAmount)}</td>
          </tr>
          <tr style={{ background:'#e8f5e9', fontSize:14 }}>
            <td colSpan={4} style={{ fontWeight:800, textAlign:'right', color:'#1b5e20' }}>CACHÊ PROPOSTO</td>
            <td style={{ fontWeight:800, textAlign:'right', color:'#1b5e20' }}>{formatBRL(proposedFee)}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{ background:'#fff8f8', border:'1px solid #ffcccc', borderRadius:8, padding:14, marginTop:16 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>Condições de Pagamento</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <div style={{ fontSize:11, color:'#888' }}>Sinal ({contractClauses.paymentAdvance}%)</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#cc0000' }}>{formatBRL(advanceAmount)}</div>
            <div style={{ fontSize:11, color:'#888' }}>Na assinatura do contrato</div>
          </div>
          <div>
            <div style={{ fontSize:11, color:'#888' }}>Restante ({100-contractClauses.paymentAdvance}%)</div>
            <div style={{ fontSize:16, fontWeight:700 }}>{formatBRL(remainingAmount)}</div>
            <div style={{ fontSize:11, color:'#888' }}>No dia do evento</div>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:50 }}>
        {[eventInfo.bandName||'Prestador de Serviços', eventInfo.clientName||'Contratante'].map(name => (
          <div key={name} style={{ width:220, textAlign:'center' }}>
            <div style={{ borderTop:'1px solid #333', paddingTop:8, fontSize:11 }}>
              <strong>{name}</strong><br/>Assinatura
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:'center', marginTop:24, fontSize:10, color:'#bbb' }}>
        Documento gerado por GigFlow · Aditivo Media · {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
}

/* ─── Contract Document ─── */
function ContractDocument({ eventInfo, teamComposition, energyReqs, includedItems, totalCost, profitMargin, profitAmount, proposedFee, advanceAmount, remainingAmount, contractClauses }: any) {
  return (
    <div>
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ fontSize:17, fontWeight:800, textTransform:'uppercase', letterSpacing:2 }}>
          Contrato de Prestação de Serviços Artísticos
        </div>
        <div style={{ fontSize:11, color:'#777', marginTop:4 }}>
          Número {Date.now().toString().slice(-6)} · {new Date().toLocaleDateString('pt-BR')}
        </div>
        <hr style={{ borderColor:'#333', marginTop:10 }} />
      </div>

      <p>As partes qualificadas abaixo celebram o presente <strong>Contrato de Prestação de Serviços Artísticos</strong>, regendo-se pelas cláusulas e condições a seguir estabelecidas.</p>

      {[
        {
          clause: '1ª – DAS PARTES',
          content: (
            <>
              <p><strong>CONTRATADO:</strong> {eventInfo.bandName||'__________________'}, composto por {teamComposition.members} integrante(s) e {teamComposition.supportTeam} membro(s) de equipe de apoio.</p>
              <p style={{marginTop:8}}><strong>CONTRATANTE:</strong> {eventInfo.clientName||'__________________'}, CNPJ/CPF: {eventInfo.cnpjClient||'__________________'}.</p>
            </>
          )
        },
        {
          clause: '2ª – DO OBJETO',
          content: (
            <>
              <p>Apresentação artística musical ({eventInfo.eventType}) com duração de <strong>{eventInfo.setDuration} minutos</strong>:</p>
              <p style={{paddingLeft:16, borderLeft:'3px solid #cc0000', marginTop:8, fontWeight:600}}>
                📍 {eventInfo.eventVenue||'____________________'}, {eventInfo.eventCity||'____________________'}/{eventInfo.eventState||'—'}<br/>
                📅 {formatDate(eventInfo.eventDate)} às {eventInfo.eventTime||'--:--'}
              </p>
              {eventInfo.soundLighting && <p style={{marginTop:8}}><strong>Responsabilidade da Banda:</strong> {eventInfo.soundLighting}</p>}
              {eventInfo.contractingResponsibility && <p style={{marginTop:4}}><strong>Responsabilidade da Contratante:</strong> {eventInfo.contractingResponsibility}</p>}
              {(energyReqs.tomada || energyReqs.tensao || energyReqs.aterramento || energyReqs.distMax) && (
                <div style={{marginTop:8, padding:'8px 12px', background:'#f9f9f9', borderRadius:6, border:'1px solid #eee'}}>
                  <strong>Requisitos de Energia (NBR 5410):</strong>
                  {energyReqs.tomada && <p style={{margin:'4px 0 0'}}>Tomada: {energyReqs.tomada}</p>}
                  {energyReqs.tensao && <p style={{margin:'2px 0 0'}}>Tensão: {energyReqs.tensao}</p>}
                  {energyReqs.aterramento && <p style={{margin:'2px 0 0'}}>Aterramento: {energyReqs.aterramento}</p>}
                  {energyReqs.distMax && <p style={{margin:'2px 0 0'}}>Distância máx. do palco: {energyReqs.distMax}</p>}
                </div>
              )}
            </>
          )
        },
        {
          clause: '3ª – DA REMUNERAÇÃO',
          content: (
            <>
              <p>Valor total: <strong>{formatBRL(proposedFee)}</strong> ({numWords(proposedFee)}).</p>
              <table style={{marginTop:10}}>
                <thead><tr>
                  <th>Parcela</th><th>%</th><th style={{textAlign:'right'}}>Valor</th><th>Prazo</th>
                </tr></thead>
                <tbody>
                  <tr>
                    <td>Sinal</td><td>{contractClauses.paymentAdvance}%</td>
                    <td style={{textAlign:'right',fontWeight:700}}>{formatBRL(advanceAmount)}</td>
                    <td>Na assinatura</td>
                  </tr>
                  <tr style={{background:'#fafafa'}}>
                    <td>Restante</td><td>{100-contractClauses.paymentAdvance}%</td>
                    <td style={{textAlign:'right',fontWeight:700}}>{formatBRL(remainingAmount)}</td>
                    <td>No dia do evento</td>
                  </tr>
                </tbody>
              </table>
            </>
          )
        },
        {
          clause: '4ª – DA MULTA E RESCISÃO',
          content: <p>Multa de <strong>{contractClauses.penaltyPercentage}%</strong> ({numWords(contractClauses.penaltyPercentage)} por cento) do valor total ({formatBRL(proposedFee * contractClauses.penaltyPercentage / 100)}) pelo descumprimento contratual. Rescisão com menos de 15 dias implica perda do sinal e pagamento da multa.</p>
        },
        {
          clause: '5ª – DAS OBRIGAÇÕES',
          content: (
            <>
              <p><strong>CONTRATADO:</strong> Comparecer no horário acordado; realizar apresentação pelo tempo contratado; zelar pelo espaço e equipamentos.</p>
              <p style={{marginTop:6}}><strong>CONTRATANTE:</strong> Efetuar pagamentos nos prazos; disponibilizar espaço e condições técnicas; garantir segurança da equipe.{eventInfo.contractingResponsibility ? ` ${eventInfo.contractingResponsibility}.` : ''}</p>
            </>
          )
        },
        {
          clause: '6ª – DO FORO',
          content: <p>Fica eleito o <strong>{contractClauses.venue||'foro competente'}</strong> para dirimir quaisquer litígios.</p>
        },
        ...(contractClauses.additionalClauses ? [{
          clause: '7ª – DISPOSIÇÕES ADICIONAIS',
          content: <p>{contractClauses.additionalClauses}</p>
        }] : []),
      ].map(({ clause, content }) => (
        <div key={clause} style={{ marginBottom:18 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:8, borderBottom:'1px solid #ddd', paddingBottom:4 }}>
            CLÁUSULA {clause}
          </div>
          {content}
        </div>
      ))}

      <p style={{marginTop:16}}>
        Em {eventInfo.eventCity||'____________________'}/{eventInfo.eventState||'—'}, {formatDate(eventInfo.eventDate) !== '___/___/______' ? formatDate(eventInfo.eventDate) : `______ de ______________ de ${new Date().getFullYear()}`}.
      </p>

      <div style={{ display:'flex', justifyContent:'space-between', marginTop:40 }}>
        {[
          { name: eventInfo.bandName||'__________________________', role:'CONTRATADO – Prestador de Serviços' },
          { name: eventInfo.clientName||'__________________________', role:'CONTRATANTE', sub: eventInfo.cnpjClient },
        ].map(({ name, role, sub }) => (
          <div key={role} style={{ width:220, textAlign:'center' }}>
            <div style={{ borderTop:'2px solid #333', paddingTop:10 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{name}</div>
              <div style={{ fontSize:11, color:'#777', marginTop:2 }}>{role}</div>
              {sub && <div style={{ fontSize:10, color:'#999' }}>{sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign:'center', marginTop:28, fontSize:10, color:'#bbb' }}>
        Documento gerado por GigFlow · Aditivo Media · {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
}
