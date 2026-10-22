import React from 'react';
import { CANDIDATE_METRICS } from '../data/benchmarkData';
import { computeResiduals } from '../utils/mlEngine';
import { AdvertisingRecord, ResidualPoint } from '../types/sales';

interface ModelBenchmarkerProps {
  records: AdvertisingRecord[];
  activeModel: string;
  setActiveModel: (model: string) => void;
}

export const ModelBenchmarker: React.FC<ModelBenchmarkerProps> = ({
  records,
  activeModel,
  setActiveModel
}) => {
  const residualsData: ResidualPoint[] = computeResiduals(records.slice(0, 40), activeModel);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="brutal-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Model Evaluation & Leaderboard
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Standardized evaluation on an independent 20% holdout test sample (40 markets).
          </p>
        </div>
      </div>

      {/* Model Benchmark Table */}
      <div className="brutal-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#e2e8f0] border-b-2 border-[#0f172a] text-xs font-mono text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-5">Rank</th>
                <th className="py-3 px-5">Model Architecture</th>
                <th className="py-3 px-5 text-right">R² Score</th>
                <th className="py-3 px-5 text-right">RMSE Error</th>
                <th className="py-3 px-5 text-right">MAE Error</th>
                <th className="py-3 px-5 text-center">Engine Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]">
              {CANDIDATE_METRICS.map((model) => {
                const isSelected = activeModel === model.name;
                const isTop = model.rank === 1;

                return (
                  <tr
                    key={model.name}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-amber-100/60 text-slate-950 font-medium'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <td className="py-4 px-5 font-mono font-bold">
                      <span className={`inline-flex items-center justify-center w-8 h-8 font-mono text-xs font-bold border-2 ${
                        isTop 
                          ? 'bg-amber-400 text-slate-950 border-[#0f172a] shadow-[2px_2px_0px_#0f172a]' 
                          : 'bg-white text-slate-700 border-[#0f172a]'
                      }`}>
                        #{model.rank}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 text-sm">
                        {model.name}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {model.description}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-black text-slate-900 text-base">
                      {(model.testR2 * 100).toFixed(1)}%
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-slate-700 text-sm">
                      {model.testRmse.toFixed(2)}k
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-slate-700 text-sm">
                      {model.cvMae.toFixed(2)}k
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => setActiveModel(model.name)}
                        className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          isSelected
                            ? 'mech-btn mech-btn-active'
                            : 'mech-btn'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Deploy'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Diagnostic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Plot (7 cols): Predicted vs Actual */}
        <div className="lg:col-span-7 brutal-card p-6 space-y-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Predicted vs. Actual Holdout Sales
            </h3>
            <p className="text-xs text-slate-600">
              Evaluation on unseen test markets. Proximity to the dashed identity line reflects accuracy.
            </p>
          </div>

          <div className="neu-bay p-4 overflow-hidden rounded">
            <svg viewBox="0 0 500 220" className="w-full h-56">
              {/* Grid Lines */}
              <line x1="40" y1="50" x2="480" y2="50" stroke="#cbd5e1" strokeDasharray="2 2" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#cbd5e1" strokeDasharray="2 2" />
              <line x1="40" y1="150" x2="480" y2="150" stroke="#cbd5e1" strokeDasharray="2 2" />

              {/* Ideal 45-degree Line */}
              <line x1="40" y1="190" x2="460" y2="20" stroke="#d97706" strokeWidth="2" strokeDasharray="4 4" />

              {/* Scatter Points */}
              {residualsData.map((pt, i) => {
                const cx = 40 + (pt.actual / 30) * 420;
                const cy = 190 - (pt.predicted / 30) * 170;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}

              <line x1="40" y1="190" x2="480" y2="190" stroke="#475569" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="190" stroke="#475569" strokeWidth="1.5" />
              <text x="40" y="208" fill="#475569" fontSize="10" className="font-mono font-bold">0k</text>
              <text x="250" y="208" fill="#1e293b" fontSize="11" textAnchor="middle" className="font-mono font-bold">Actual Sales (Holdout)</text>
              <text x="460" y="208" fill="#475569" fontSize="10" textAnchor="end" className="font-mono font-bold">30k</text>
            </svg>
          </div>
        </div>

        {/* Right Plot (5 cols): Feature Importance */}
        <div className="lg:col-span-5 brutal-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Model Feature Importance
            </h3>
            <p className="text-xs text-slate-600">
              Permutation feature weight in Random Forest & Gradient Boosting.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                <span className="text-slate-900">TV Advertising</span>
                <span className="text-amber-700">58.4%</span>
              </div>
              <div className="neu-bay h-4 p-0.5 overflow-hidden rounded">
                <div className="bg-amber-500 h-full border border-[#0f172a]" style={{ width: '58.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                <span className="text-slate-900">Radio Advertising</span>
                <span className="text-amber-700">38.6%</span>
              </div>
              <div className="neu-bay h-4 p-0.5 overflow-hidden rounded">
                <div className="bg-amber-500 h-full border border-[#0f172a]" style={{ width: '38.6%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-1.5">
                <span className="text-slate-600">Newspaper Advertising</span>
                <span className="text-slate-600">3.0%</span>
              </div>
              <div className="neu-bay h-4 p-0.5 overflow-hidden rounded">
                <div className="bg-slate-400 h-full border border-[#0f172a]" style={{ width: '3.0%' }} />
              </div>
            </div>
          </div>

          <div className="neu-bay p-3 mt-4 text-xs font-mono text-slate-700 rounded border border-[#cbd5e1]">
            Note: Non-linear trees capture TV × Radio synergy without manual interaction engineering.
          </div>
        </div>
      </div>
    </div>
  );
};
