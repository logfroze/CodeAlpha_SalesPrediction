import React from 'react';

export const BusinessInsights: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="brutal-panel p-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Executive Business Insights
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Evidence-based findings and budget allocation recommendations derived from 200 market tests.
        </p>
      </div>

      {/* 3 Core Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TV */}
        <div className="brutal-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-2">
              Channel 1 · Television
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Primary Volume Driver
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              TV advertising delivers the strongest and most consistent overall sales baseline. It scales reliably across large budgets without rapid diminishing returns.
            </p>
          </div>
          <div className="neu-bay p-3 mt-4 text-xs font-mono text-slate-800">
            Linear slope: <span className="text-slate-950 font-bold">+0.046k units / $1k spend</span>
          </div>
        </div>

        {/* Radio */}
        <div className="brutal-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-2">
              Channel 2 · Radio
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              High Efficiency Accelerator
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Radio delivers four times higher sales response per dollar compared to TV, but reaches audience saturation faster at budgets exceeding $45k.
            </p>
          </div>
          <div className="neu-bay p-3 mt-4 text-xs font-mono text-slate-800">
            Linear slope: <span className="text-slate-950 font-bold">+0.188k units / $1k spend</span>
          </div>
        </div>

        {/* Newspaper */}
        <div className="brutal-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider mb-2">
              Channel 3 · Newspaper
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Zero Direct Contribution
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              When TV and Radio are held constant in multi-variable models, newspaper ad spend shows no statistically significant relationship with unit sales.
            </p>
          </div>
          <div className="neu-bay p-3 mt-4 text-xs font-mono text-slate-800">
            Recommendation: <span className="text-amber-700 font-bold">Reallocate to TV & Radio</span>
          </div>
        </div>
      </div>

      {/* Multi-Channel Synergy */}
      <div className="brutal-card p-6">
        <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-2">
          Channel Interaction Effect
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          TV and Radio Deliver Positive Synergy
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          Running TV and Radio campaigns in synchronization produces an estimated <strong className="text-slate-950">18% sales lift</strong> above the sum of their individual contributions. Cross-medium exposure reinforces consumer memory and conversion rates.
        </p>
      </div>

      {/* Statistical Caution */}
      <div className="brutal-card p-6 border-l-4 border-l-amber-600">
        <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-2">
          Methodological Rigor
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Correlation vs. Causal Validation
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          These insights represent empirical associations in historical data. Market expansion decisions should always be piloted through randomized geographical A/B tests before committing entire enterprise budgets.
        </p>
      </div>
    </div>
  );
};
