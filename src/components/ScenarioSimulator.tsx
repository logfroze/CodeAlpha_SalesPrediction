import React, { useState } from 'react';
import { PredictionResult, ChannelCurvePoint } from '../types/sales';
import { runInference, generateDiminishingCurves } from '../utils/mlEngine';
import { CANDIDATE_METRICS } from '../data/benchmarkData';

interface ScenarioSimulatorProps {
  activeModel: string;
  setActiveModel: (model: string) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  activeModel,
  setActiveModel
}) => {
  const [tvSpend, setTvSpend] = useState<number>(147.0);
  const [radioSpend, setRadioSpend] = useState<number>(23.2);
  const [newsSpend, setNewsSpend] = useState<number>(30.5);

  const result: PredictionResult = runInference(tvSpend, radioSpend, newsSpend, activeModel);
  const curves: ChannelCurvePoint[] = generateDiminishingCurves(tvSpend, radioSpend, newsSpend);

  const handleResetAverages = () => {
    setTvSpend(147.0);
    setRadioSpend(23.2);
    setNewsSpend(30.5);
  };

  const handleOptimalPreset = () => {
    setTvSpend(190.0);
    setRadioSpend(45.0);
    setNewsSpend(0.0);
  };

  return (
    <div className="space-y-6">
      {/* Top Console Deck */}
      <div className="brutal-panel p-6 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0f172a] text-amber-400 font-mono text-xs px-2 py-0.5 font-bold border border-[#0f172a]">MOD.01</span>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-mono">
              Marketing Allocation Console
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            Adjust channel faders to calculate sales outcomes in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#e2e8f0] px-3 py-1.5 rounded border-2 border-[#0f172a] shadow-[inset_1px_1px_3px_rgba(15,23,42,0.15)]">
            <span className="text-xs text-slate-700 font-mono font-bold">ESTIMATOR:</span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {CANDIDATE_METRICS.map(m => (
                <option key={m.name} value={m.name} className="bg-white text-slate-900 font-mono">
                  {m.name.replace(' Regressor', '')}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOptimalPreset}
            className="mech-btn-primary px-3.5 py-1.5 text-xs font-mono font-bold rounded uppercase cursor-pointer"
          >
            Optimal Preset
          </button>

          <button
            onClick={handleResetAverages}
            className="mech-btn px-3.5 py-1.5 text-xs font-mono font-bold rounded uppercase cursor-pointer text-slate-800 hover:text-black"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Grid: Faders on Left, Readout on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3 Channel Mechanical Faders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* TV Slider */}
          <div className="brutal-card p-5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-sky-700 uppercase tracking-wider block">Channel A · Television</span>
                <span className="text-base font-black text-slate-900 font-mono">TV AD EXPENDITURE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="neu-bay px-3 py-1 rounded font-mono font-black text-slate-900 text-base">
                  ${tvSpend.toFixed(0)}k
                </div>
                <button
                  onClick={() => setTvSpend(Math.max(0, tvSpend - 10))}
                  className="mech-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                >
                  -10
                </button>
                <button
                  onClick={() => setTvSpend(Math.min(300, tvSpend + 10))}
                  className="mech-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                >
                  +10
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="300"
              step="1"
              value={tvSpend}
              onChange={(e) => setTvSpend(parseFloat(e.target.value))}
              className="w-full cursor-pointer py-3"
            />

            <div className="flex justify-between text-[11px] text-slate-600 font-mono font-bold">
              <span>$0k (MIN)</span>
              <span>$150k</span>
              <span>$300k (MAX)</span>
            </div>
          </div>

          {/* Radio Slider */}
          <div className="brutal-card p-5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-amber-700 uppercase tracking-wider block">Channel B · Radio</span>
                <span className="text-base font-black text-slate-900 font-mono">RADIO AD EXPENDITURE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="neu-bay px-3 py-1 rounded font-mono font-black text-amber-700 text-base">
                  ${radioSpend.toFixed(0)}k
                </div>
                <button
                  onClick={() => setRadioSpend(Math.max(0, radioSpend - 5))}
                  className="mech-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                >
                  -5
                </button>
                <button
                  onClick={() => setRadioSpend(Math.min(50, radioSpend + 5))}
                  className="mech-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                >
                  +5
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={radioSpend}
              onChange={(e) => setRadioSpend(parseFloat(e.target.value))}
              className="w-full cursor-pointer py-3"
            />

            <div className="flex justify-between text-[11px] text-slate-600 font-mono font-bold">
              <span>$0k (MIN)</span>
              <span>$25k</span>
              <span>$50k (CAP)</span>
            </div>
          </div>

          {/* Newspaper Slider */}
          <div className="brutal-card p-5 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-extrabold text-slate-600 uppercase tracking-wider block">Channel C · Newspaper</span>
                <span className="text-base font-black text-slate-900 font-mono">PRINT NEWSPAPER SPEND</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="neu-bay px-3 py-1 rounded font-mono font-black text-slate-800 text-base">
                  ${newsSpend.toFixed(0)}k
                </div>
                <button
                  onClick={() => setNewsSpend(Math.max(0, newsSpend - 5))}
                  className="mech-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                >
                  -5
                </button>
                <button
                  onClick={() => setNewsSpend(Math.min(100, newsSpend + 5))}
                  className="mech-btn px-2.5 py-1 rounded text-xs font-mono font-bold"
                >
                  +5
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={newsSpend}
              onChange={(e) => setNewsSpend(parseFloat(e.target.value))}
              className="w-full cursor-pointer py-3"
            />

            <div className="flex justify-between text-[11px] text-slate-600 font-mono font-bold">
              <span>$0k (RECOMMENDED)</span>
              <span>$50k</span>
              <span>$100k (MAX)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Brutalist Hardware Readout Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="brutal-panel p-6 rounded-lg space-y-5">
            <div className="flex items-center justify-between border-b-2 border-[#0f172a] pb-2">
              <span className="text-xs font-bold font-mono text-slate-600 uppercase tracking-widest">
                ESTIMATED OUTPUT
              </span>
              <span className="text-xs font-mono text-emerald-800 font-bold bg-[#e2e8f0] px-2 py-0.5 border border-[#0f172a]">
                ACTIVE
              </span>
            </div>

            {/* Debossed Readout Well with Solid High-Contrast Number */}
            <div className="neu-bay p-6 rounded border-2 border-[#0f172a] text-center">
              <div className="text-xs uppercase font-mono font-bold text-slate-600 tracking-wider">
                Sales Forecast
              </div>
              <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-slate-900 mt-1">
                {result.predictedSales.toFixed(1)}k
              </div>
              <div className="text-xs font-mono font-bold text-emerald-700 mt-2">
                {Math.round(result.predictedSales * 1000).toLocaleString()} Physical Units
              </div>
            </div>

            {/* Budget & Revenue Slabs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="neu-bay p-3.5 rounded border border-[#cbd5e1]">
                <div className="text-[11px] font-mono font-bold text-slate-600 uppercase">Total Budget</div>
                <div className="text-lg font-black font-mono text-slate-900 mt-1">
                  ${result.totalBudget.toFixed(0)}k
                </div>
              </div>

              <div className="neu-bay p-3.5 rounded border border-[#cbd5e1]">
                <div className="text-[11px] font-mono font-bold text-slate-600 uppercase">Gross Revenue</div>
                <div className="text-lg font-black font-mono text-amber-700 mt-1">
                  ${result.estimatedRevenue.toFixed(0)}k
                </div>
              </div>
            </div>

            {/* Error Bound Note */}
            <div className="neu-bay p-2.5 rounded text-center text-xs font-mono text-slate-600 border border-[#cbd5e1]">
              Bounds: <span className="text-slate-900 font-bold">{result.lowerBound.toFixed(1)}k</span> to <span className="text-slate-900 font-bold">{result.upperBound.toFixed(1)}k</span> units (95% CI)
            </div>
          </div>

          {/* Simple Clean Response Curves */}
          <div className="brutal-card p-5 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
                Channel Response Curves
              </span>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-sky-700">■ TV</span>
                <span className="text-amber-700">■ Radio</span>
                <span className="text-slate-600">┄ News</span>
              </div>
            </div>

            <div className="neu-bay p-3 rounded border border-[#cbd5e1]">
              <svg viewBox="0 0 320 120" className="w-full h-32">
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  points={curves.map((pt) => {
                    const x = 20 + (pt.spend / 300) * 280;
                    const y = 105 - ((pt.tvSales - 0) / 28) * 90;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  points={curves.map((pt) => {
                    const x = 20 + (pt.spend / 300) * 280;
                    const y = 105 - ((pt.radioSales - 0) / 28) * 90;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                <polyline
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  points={curves.map((pt) => {
                    const x = 20 + (pt.spend / 300) * 280;
                    const y = 105 - ((pt.newspaperSales - 0) / 28) * 90;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                <line x1="20" y1="110" x2="300" y2="110" stroke="#94a3b8" />
                <text x="20" y="119" fill="#475569" fontSize="9" className="font-mono font-bold">$0k</text>
                <text x="300" y="119" fill="#475569" fontSize="9" textAnchor="end" className="font-mono font-bold">$300k</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
