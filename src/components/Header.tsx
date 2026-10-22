import React from 'react';
import { FileDown } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExportReport
}) => {
  // 'Code & Notebook' tab removed per user request
  const navItems = [
    { id: 'simulator', label: 'Budget Simulator' },
    { id: 'insights', label: 'Key Insights' },
    { id: 'models', label: 'Models' },
    { id: 'eda', label: 'Data Explorer' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#0f172a] px-6 py-3.5 shadow-[0_4px_0px_#0f172a]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#0f172a] px-2.5 py-1 rounded border border-[#0f172a] font-mono text-amber-400 font-bold text-xs tracking-wider shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]">
            SALES.ML
          </div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 uppercase font-mono">
            CodeAlpha Sales Prediction
          </span>
        </div>

        {/* Mechanical Navigation Buttons */}
        <nav className="hidden md:flex items-center gap-2 p-1 rounded-md bg-[#e2e8f0] border-2 border-[#0f172a] shadow-[inset_2px_2px_4px_rgba(15,23,42,0.15)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded uppercase tracking-wide cursor-pointer ${
                  isActive
                    ? 'mech-btn-active'
                    : 'mech-btn'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExportReport}
            className="mech-btn-primary px-4 py-1.5 text-xs font-mono font-bold rounded flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <FileDown className="w-4 h-4 text-black" />
            <span>Export Memo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
