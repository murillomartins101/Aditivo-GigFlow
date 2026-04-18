import React from 'react';
import { ListChecks, BarChart2, Clock, Settings } from 'lucide-react';

export type MobileTab = 'budget' | 'summary' | 'history';

interface BottomNavProps {
  activeTab: MobileTab;
  onChange: (tab: MobileTab) => void;
  proposalCount: number;
  onOpenSidebar: () => void;
}

export function BottomNav({ activeTab, onChange, proposalCount, onOpenSidebar }: BottomNavProps) {
  const tabs = [
    { id: 'budget' as MobileTab, icon: ListChecks, label: 'Orçamento' },
    { id: 'summary' as MobileTab, icon: BarChart2, label: 'Resumo' },
    { id: 'history' as MobileTab, icon: Clock, label: 'Histórico' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{
        background: '#141414',
        borderTop: '1px solid #2a2a2a',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Sidebar trigger */}
      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center justify-center gap-1 px-4 transition-colors"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#666',
          minHeight: 60,
          minWidth: 56,
        }}
      >
        <Settings size={21} />
        <span style={{ fontSize: 9, fontWeight: 500 }}>Detalhes</span>
      </button>

      {/* divider */}
      <div style={{ width: 1, background: '#2a2a2a', margin: '8px 0' }} />

      {/* Main tabs */}
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="relative flex flex-col items-center justify-center gap-1 flex-1 transition-all"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              minHeight: 60,
            }}
          >
            {/* Active indicator bar at top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '25%',
                right: '25%',
                height: 2,
                background: active ? '#e00000' : 'transparent',
                borderRadius: '0 0 4px 4px',
                transition: 'background 0.2s',
              }}
            />

            <Icon size={22} color={active ? '#e00000' : '#666'} strokeWidth={active ? 2.2 : 1.8} />
            <span
              style={{
                fontSize: 10,
                color: active ? '#e00000' : '#666',
                fontWeight: active ? 700 : 400,
                transition: 'color 0.2s',
              }}
            >
              {label}
            </span>

            {/* Badge for history */}
            {id === 'history' && proposalCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: '22%',
                  minWidth: 16,
                  height: 16,
                  background: '#22c55e',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                }}
              >
                {proposalCount > 9 ? '9+' : proposalCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}