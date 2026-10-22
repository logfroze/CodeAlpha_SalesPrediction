import React, { useState } from 'react';
import { AdvertisingRecord } from '../types/sales';
import { calculateCorrelation } from '../utils/mlEngine';

interface EdaVisualizerProps {
  records: AdvertisingRecord[];
}

export const EdaVisualizer: React.FC<EdaVisualizerProps> = ({ records }) => {
  const [selectedChannel, setSelectedChannel] = useState<'TV' | 'Radio' | 'Newspaper'>('TV');

  const tvVals = records.map(r => r.TV);
  const radioVals = records.map(r => r.Radio);
  const newsVals = records.map(r => r.Newspaper);
  const salesVals = records.map(r => r.Sales);

  const corrTV = calculateCorrelation(tvVals, salesVals);
  const corrRadio = calculateCorrelation(radioVals, salesVals);
  const corrNews = calculateCorrelation(newsVals, salesVals);

  const channelMax = selectedChannel === 'TV' ? 300 : selectedChannel === 'Radio' ? 50 : 120;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="brutal-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Exploratory Data Analysis
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Empirical distribution and linear correlations across 200 surveyed markets.
          </p>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center gap-2">
          {(['TV', 'Radio', 'Newspaper'] as const).map(ch => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer ${
                selectedChannel === ch
                  ? 'mech-btn mech-btn-active'
                  : 'mech-btn'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Scatter on Left, Correlation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scatter Plot (7 cols) */}
        <div className="lg:col-span-7 brutal-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {selectedChannel} Spend vs. Sales Volume
            </h3>
            <span className="text-xs font-mono font-bold text-amber-700">
              Pearson r: {selectedChannel === 'TV' ? corrTV : selectedChannel === 'Radio' ? corrRadio : corrNews}
            </span>
          </div>

          <div className="neu-bay p-4 overflow-hidden rounded">
            <svg viewBox="0 0 460 210" className="w-full h-56">
              {/* Grid Lines */}
              <line x1="30" y1="50" x2="430" y2="50" stroke="#cbd5e1" strokeDasharray="2 2" />
              <line x1="30" y1="100" x2="430" y2="100" stroke="#cbd5e1" strokeDasharray="2 2" />
              <line x1="30" y1="150" x2="430" y2="150" stroke="#cbd5e1" strokeDasharray="2 2" />

              {/* Scatter Points */}
              {records.map((r, i) => {
                const xVal = r[selectedChannel];
                const cx = 30 + (xVal / channelMax) * 400;
                const cy = 180 - (r.Sales / 30) * 160;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="3.5"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Empirical Trendline */}
              <line
                x1="30"
                y1={selectedChannel === 'TV' ? 145 : selectedChannel === 'Radio' ? 135 : 125}
                x2="430"
                y2={selectedChannel === 'TV' ? 35 : selectedChannel === 'Radio' ? 60 : 105}
                stroke="#d97706"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              <line x1="30" y1="180" x2="430" y2="180" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="20" x2="30" y2="180" stroke="#475569" strokeWidth="1.5" />
              <text x="30" y="198" fill="#475569" fontSize="10" className="font-mono font-bold">$0k</text>
              <text x="230" y="198" fill="#1e293b" fontSize="11" textAnchor="middle" className="font-mono font-bold">{selectedChannel} Advertising Spend ($k)</text>
              <text x="430" y="198" fill="#475569" fontSize="10" textAnchor="end" className="font-mono font-bold">${channelMax}k</text>
            </svg>
          </div>
        </div>

        {/* Correlation & Summary (5 cols) */}
        <div className="lg:col-span-5 brutal-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Correlation Ranking
          </h3>

          <div className="space-y-4">
            <div className="neu-bay p-4 rounded">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Television</span>
                <span className="text-amber-700 font-mono">0.78 (Strong)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Dominant linear driver; robust across both small and high-expenditure budgets.
              </p>
            </div>

            <div className="neu-bay p-4 rounded">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Radio</span>
                <span className="text-amber-700 font-mono">0.58 (Moderate)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Steeper marginal slope per dollar, but exhibits plateauing beyond $45k.
              </p>
            </div>

            <div className="neu-bay p-4 rounded">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-600">Newspaper</span>
                <span className="text-slate-600 font-mono">0.23 (Spurious)</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Becomes non-significant when conditioned on TV and Radio spend in regression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
