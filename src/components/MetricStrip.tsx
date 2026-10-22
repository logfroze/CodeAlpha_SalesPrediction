import React from 'react';

interface MetricStripProps {
  recordCount: number;
  bestTestR2: number;
  bestTestRmse: number;
  activeModelName: string;
}

export const MetricStrip: React.FC<MetricStripProps> = ({
  recordCount,
  bestTestR2,
  bestTestRmse,
  activeModelName
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Metric 1 */}
      <div className="brutal-card p-4 rounded-lg">
        <div className="text-[11px] font-bold font-mono text-slate-600 uppercase tracking-wider">
          Observed Markets
        </div>
        <div className="neu-bay p-2.5 rounded mt-2 text-center">
          <div className="text-2xl font-black font-mono text-slate-900">
            {recordCount}
          </div>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="brutal-card p-4 rounded-lg">
        <div className="text-[11px] font-bold font-mono text-slate-600 uppercase tracking-wider">
          Test Accuracy (R²)
        </div>
        <div className="neu-bay p-2.5 rounded mt-2 text-center">
          <div className="text-2xl font-black font-mono text-emerald-700">
            {(bestTestR2 * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="brutal-card p-4 rounded-lg">
        <div className="text-[11px] font-bold font-mono text-slate-600 uppercase tracking-wider">
          Mean Error (RMSE)
        </div>
        <div className="neu-bay p-2.5 rounded mt-2 text-center">
          <div className="text-2xl font-black font-mono text-amber-700">
            ±{bestTestRmse.toFixed(2)}k
          </div>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="brutal-card p-4 rounded-lg">
        <div className="text-[11px] font-bold font-mono text-slate-600 uppercase tracking-wider">
          Active Estimator
        </div>
        <div className="neu-bay p-2.5 rounded mt-2 text-center">
          <div className="text-sm font-bold font-mono text-slate-900 truncate mt-1">
            {activeModelName.replace(' Regressor', '')}
          </div>
        </div>
      </div>
    </div>
  );
};
