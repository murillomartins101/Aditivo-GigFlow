import React, { useState, useCallback } from 'react';
import { Calculator, History, Menu, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import logo from '../imports/Logo2026.png';
import { Sidebar } from './components/Sidebar';
import { BudgetTable } from './components/BudgetTable';
import { SummaryPanel } from './components/SummaryPanel';
import { ContractModal } from './components/ContractModal';
import { HistoryPanel } from './components/HistoryPanel';
import { BottomNav, MobileTab } from './components/BottomNav';
import { useIsMobile } from './hooks/useIsMobile';

/* ──────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────── */
export interface BudgetItem {
  id: string; name: string; description: string;
  quantity: number; unitValue: number; include: boolean;
}
export interface EventInfo {
  bandName: string; clientName: string; cnpjClient: string;
  eventDate: string; eventTime: string; eventVenue: string;
  eventCity: string; eventState: string; eventType: string;
  soundLighting: string; contractingResponsibility: string; setDuration: string;
}
export interface TeamComposition { members: number; supportTeam: number; companions: number; }
export interface EnergyReqs { generatorPower: string; circuitBreakers: string; technicalVisit: boolean; }
export interface ContractClauses { penaltyPercentage: number; paymentAdvance: number; venue: string; additionalClauses: string; }
export interface Proposal {
  id: string; createdAt: string;
  eventInfo: EventInfo; teamComposition: TeamComposition;
  energyReqs: EnergyReqs; contractClauses: ContractClauses;
  budgetItems: BudgetItem[];
  profitMargin: number; totalCost: number; profitAmount: number; proposedFee: number;
}

/* ──────────────────────────────────────────────
 * Defaults
 * ────────────────────────────────────────────── */
const DEF_ITEMS: BudgetItem[] = [
  { id:'1', name:'Músicos',          description:'Pagamento dos músicos',               quantity:0, unitValue:0, include:true  },
  { id:'2', name:'Ajudantes/Staff',  description:'Pagamento de ajudantes (roadies)',     quantity:0, unitValue:0, include:true  },
  { id:'3', name:'Transporte',       description:'Aluguel/combustível de carros',        quantity:0, unitValue:0, include:true  },
  { id:'4', name:'Pedágio',          description:'Custos com pedágios (ida e volta)',    quantity:0, unitValue:0, include:true  },
  { id:'5', name:'Combustível',      description:'Estimativa ida/volta (média 13 km/L)',quantity:0, unitValue:0, include:true  },
  { id:'6', name:'Alimentação',      description:'Refeição completa para equipe',       quantity:0, unitValue:0, include:true  },
  { id:'7', name:'Hospedagem',       description:'Caso haja necessidade de pernoite',   quantity:0, unitValue:0, include:false },
  { id:'8', name:'Equipamentos',     description:'Aluguel de equipamentos adicionais',  quantity:0, unitValue:0, include:false },
  { id:'9', name:'Marketing',        description:'Divulgação e promoção do evento',     quantity:0, unitValue:0, include:false },
  { id:'10',name:'Outros',           description:'Despesas diversas',                  quantity:0, unitValue:0, include:false },
];
const DEF_EVENT: EventInfo = {
  bandName:'', clientName:'', cnpjClient:'', eventDate:'', eventTime:'',
  eventVenue:'', eventCity:'', eventState:'SP', eventType:'Show ao Vivo',
  soundLighting:'', contractingResponsibility:'', setDuration:'60',
};
const DEF_TEAM: TeamComposition   = { members:6, supportTeam:1, companions:0 };
const DEF_ENERGY: EnergyReqs     = { generatorPower:'', circuitBreakers:'', technicalVisit:false };
const DEF_CLAUSES: ContractClauses = { penaltyPercentage:50, paymentAdvance:50, venue:'Comarca de Jundiaí/SP', additionalClauses:'' };

/* ──────────────────────────────────────────────
 * App
 * ────────────────────────────────────────────── */
export default function App() {
  const isMobile = useIsMobile();

  /* Navigation */
  const [desktopTab, setDesktopTab]   = useState<'calculator' | 'history'>('calculator');
  const [mobileTab,  setMobileTab]    = useState<MobileTab>('budget');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // open by default on desktop

  /* Form state */
  const [eventInfo,       setEventInfo]       = useState<EventInfo>(DEF_EVENT);
  const [teamComposition, setTeamComposition] = useState<TeamComposition>(DEF_TEAM);
  const [energyReqs,      setEnergyReqs]      = useState<EnergyReqs>(DEF_ENERGY);
  const [contractClauses, setContractClauses] = useState<ContractClauses>(DEF_CLAUSES);
  const [budgetItems,     setBudgetItems]     = useState<BudgetItem[]>(DEF_ITEMS);
  const [profitMargin,    setProfitMargin]    = useState(30);

  /* Modal */
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractType,      setContractType]      = useState<'budget' | 'contract'>('budget');

  /* History */
  const [proposals, setProposals] = useState<Proposal[]>([]);

  /* Calculations */
  const totalCost    = budgetItems.filter(i => i.include).reduce((s, i) => s + i.quantity * i.unitValue, 0);
  const profitAmount = totalCost * (profitMargin / 100);
  const proposedFee  = totalCost + profitAmount;

  /* Actions */
  const handleSave = useCallback(() => {
    const p: Proposal = {
      id: Date.now().toString(), createdAt: new Date().toISOString(),
      eventInfo, teamComposition, energyReqs, contractClauses,
      budgetItems: [...budgetItems], profitMargin, totalCost, profitAmount, proposedFee,
    };
    setProposals(prev => [p, ...prev]);
    toast.success('Proposta salva no histórico!');
  }, [eventInfo, teamComposition, energyReqs, contractClauses, budgetItems, profitMargin, totalCost, profitAmount, proposedFee]);

  const handleExport = useCallback(() => {
    if (!proposals.length) { toast.error('Nenhuma proposta para exportar.'); return; }
    const blob = new Blob([JSON.stringify(proposals, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `gigflow-${new Date().toISOString().split('T')[0]}.json` });
    a.click(); URL.revokeObjectURL(a.href);
    toast.success(`${proposals.length} proposta(s) exportada(s)!`);
  }, [proposals]);

  const handleImport = useCallback((file: File) => {
    const r = new FileReader();
    r.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string) as Proposal[];
        if (!Array.isArray(data)) throw new Error();
        setProposals(data);
        toast.success(`${data.length} proposta(s) importada(s)!`);
      } catch { toast.error('Arquivo inválido. Use um JSON do GigFlow.'); }
    };
    r.readAsText(file);
  }, []);

  const handleLoad = useCallback((p: Proposal) => {
    setEventInfo(p.eventInfo); setTeamComposition(p.teamComposition);
    setEnergyReqs(p.energyReqs); setContractClauses(p.contractClauses);
    setBudgetItems(p.budgetItems); setProfitMargin(p.profitMargin);
    if (isMobile) setMobileTab('budget'); else setDesktopTab('calculator');
    toast.success('Proposta carregada!');
  }, [isMobile]);

  const handleDelete = useCallback((id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
    toast.success('Proposta removida.');
  }, []);

  const handleReset = useCallback(() => {
    if (confirm('Resetar todos os campos?')) {
      setBudgetItems(DEF_ITEMS.map(i => ({ ...i })));
      setEventInfo({ ...DEF_EVENT }); setTeamComposition({ ...DEF_TEAM });
      setEnergyReqs({ ...DEF_ENERGY }); setContractClauses({ ...DEF_CLAUSES });
      setProfitMargin(30);
      toast.success('Formulário resetado!');
    }
  }, []);

  /* Shared props */
  const summaryProps = {
    totalCost, profitAmount, proposedFee, profitMargin, setProfitMargin,
    onGenerateBudget: () => { setContractType('budget'); setShowContractModal(true); },
    onGenerateContract: () => { setContractType('contract'); setShowContractModal(true); },
    onSave: handleSave, onReset: handleReset,
  };

  const historyProps = {
    proposals, onLoad: handleLoad, onDelete: handleDelete,
    onExport: handleExport, onImport: handleImport,
  };

  const sidebarProps = {
    eventInfo, setEventInfo, teamComposition, setTeamComposition,
    energyReqs, setEnergyReqs, contractClauses, setContractClauses,
  };

  /* ────────────────────────────────────────────
   * RENDER
   * ──────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#0f0f0f',
        color: '#e5e5e5',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          height: 56,
          background: '#141414',
          borderBottom: '1px solid #232323',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Logo + sidebar toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{ width: 34, height: 34, borderRadius: 8, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src={logo}
              alt="GigFlow logo"
              style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: isMobile ? 15 : 15, fontWeight: 800, color: '#f0f0f0', lineHeight: 1.1 }}>GigFlow</div>
              {!isMobile && <div style={{ fontSize: 10, color: '#777', lineHeight: 1.1 }}>Calculadora de Cachê</div>}
            </div>
          </div>
        </div>

        {/* Desktop nav tabs */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1e1e1e', borderRadius: 12, padding: 4 }}>
            {(['calculator', 'history'] as const).map(tab => {
              const active = desktopTab === tab;
              const Icon = tab === 'calculator' ? Calculator : History;
              const label = tab === 'calculator' ? 'Calculadora' : 'Histórico';
              return (
                <button
                  key={tab}
                  onClick={() => setDesktopTab(tab)}
                  style={{
                    position: 'relative',
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 16px', borderRadius: 9,
                    background: active ? '#e00000' : 'transparent',
                    color: active ? '#fff' : '#888',
                    border: 'none', cursor: 'pointer',
                    fontWeight: active ? 700 : 400, fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={15} />
                  {label}
                  {tab === 'history' && proposals.length > 0 && (
                    <span style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 16, height: 16, borderRadius: 8,
                      background: '#22c55e', color: '#fff',
                      fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {proposals.length > 9 ? '9+' : proposals.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isMobile && (
            proposedFee > 0 ? (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cachê</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#e00000' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposedFee)}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#555' }}>Aditivo Media</div>
            )
          )}
          {!isMobile && (
            <div style={{ fontSize: 12, color: '#555' }}>
              Desenvolvido por <span style={{ color: '#e00000', fontWeight: 600 }}>Aditivo Media</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: isMobile ? 'calc(100dvh - 56px - 64px)' : 'calc(100dvh - 56px)' }}>

        {/* Desktop sidebar (toggled) */}
        {!isMobile && sidebarOpen && (
          <Sidebar {...sidebarProps} isMobile={false} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main scroll area */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          {isMobile ? (
            /* ── Mobile content ── */
            <>
              {mobileTab === 'budget' && (
                <div style={{ paddingTop: 16 }}>
                  <div style={{ padding: '0 16px 12px' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>💼 Orçamento</h2>
                    <p style={{ fontSize: 12, color: '#777', marginTop: 3 }}>
                      Toque em um item para editar. Ative o toggle para incluir no cálculo.
                    </p>
                  </div>
                  <BudgetTable items={budgetItems} setItems={setBudgetItems} />
                </div>
              )}
              {mobileTab === 'summary' && (
                <div style={{ paddingTop: 16 }}>
                  <div style={{ padding: '0 16px 12px' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>📊 Resumo</h2>
                    <p style={{ fontSize: 12, color: '#777', marginTop: 3 }}>
                      Ajuste a margem e gere seus documentos.
                    </p>
                  </div>
                  <SummaryPanel {...summaryProps} />
                </div>
              )}
              {mobileTab === 'history' && (
                <HistoryPanel {...historyProps} />
              )}
            </>
          ) : (
            /* ── Desktop content ── */
            <>
              {desktopTab === 'calculator' ? (
                <div style={{ padding: 24, maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0' }}>💼 Itens do Orçamento</h1>
                    <p style={{ fontSize: 13, color: '#777', marginTop: 4 }}>
                      Adicione, edite ou remova itens. Marque "Incluir" para considerar no cálculo.
                    </p>
                  </div>
                  <BudgetTable items={budgetItems} setItems={setBudgetItems} />
                  <SummaryPanel {...summaryProps} />
                </div>
              ) : (
                <HistoryPanel {...historyProps} />
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {isMobile && sidebarOpen && (
        <Sidebar {...sidebarProps} isMobile={true} onClose={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile bottom nav ── */}
      {isMobile && (
        <BottomNav
          activeTab={mobileTab}
          onChange={tab => {
            setMobileTab(tab);
          }}
          proposalCount={proposals.length}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      )}

      {/* ── Contract Modal ── */}
      {showContractModal && (
        <ContractModal
          type={contractType}
          eventInfo={eventInfo} teamComposition={teamComposition}
          budgetItems={budgetItems} profitMargin={profitMargin}
          totalCost={totalCost} profitAmount={profitAmount} proposedFee={proposedFee}
          contractClauses={contractClauses}
          onClose={() => setShowContractModal(false)}
        />
      )}

      <Toaster position={isMobile ? 'top-center' : 'bottom-right'} theme="dark" richColors />
    </div>
  );
}