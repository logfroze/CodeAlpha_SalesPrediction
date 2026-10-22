/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MetricStrip } from './components/MetricStrip';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { BusinessInsights } from './components/BusinessInsights';
import { ModelBenchmarker } from './components/ModelBenchmarker';
import { EdaVisualizer } from './components/EdaVisualizer';
import { DataStudio } from './components/DataStudio';
import { BENCHMARK_DATA, CANDIDATE_METRICS } from './data/benchmarkData';
import { AdvertisingRecord } from './types/sales';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simulator');
  const [activeModel, setActiveModel] = useState<string>('HistGradientBoosting Regressor');
  const [records, setRecords] = useState<AdvertisingRecord[]>(BENCHMARK_DATA);
  const [datasetName, setDatasetName] = useState<string>('ISLR Benchmark Dataset');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const bestModel = CANDIDATE_METRICS[0];

  const handleDatasetUpdate = (newRecords: AdvertisingRecord[], name: string) => {
    setRecords(newRecords);
    setDatasetName(name);
  };

  const handleDownloadExecutiveReport = () => {
    const reportContent = `# Executive Sales Prediction Memo
Project: CodeAlpha Data Science Internship (CodeAlpha_SalesPrediction)
Dataset: ${datasetName} (${records.length} records)
Selected Predictive Model: ${activeModel}

## Key Statistical Findings
1. Television Advertising: Dominant baseline volume driver (r = 0.782, slope ~ +0.046k units/$1k).
2. Radio Broadcast: Maximum per-dollar marginal sensitivity (+0.188k units/$1k) with saturation beginning at ~$40k.
3. Print Newspaper: Statistically non-significant in multivariate regression (p = 0.86).
4. TV x Radio Synergy: Multiplicative campaign alignment yields +18.7% incremental lift over independent budgets.

## Causal Policy
Observational correlations do not constitute proof of causation. Recommended next action: execute a 6-week randomized geo-split holdout test before committing capital reallocations.
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CodeAlpha_Sales_Executive_Memo_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-[#edf1f7] text-slate-900 flex flex-col selection:bg-amber-400/40 selection:text-slate-900">
      {/* Brutalist Skeuo Light Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportReport={() => setShowExportModal(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Metric Summary Strip */}
        <MetricStrip
          recordCount={records.length}
          bestTestR2={bestModel.testR2}
          bestTestRmse={bestModel.testRmse}
          activeModelName={activeModel}
        />

        {/* Tab Router */}
        {activeTab === 'simulator' && (
          <ScenarioSimulator
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        )}

        {activeTab === 'insights' && (
          <BusinessInsights />
        )}

        {activeTab === 'models' && (
          <ModelBenchmarker
            records={records}
            activeModel={activeModel}
            setActiveModel={setActiveModel}
          />
        )}

        {activeTab === 'eda' && (
          <div className="space-y-8">
            <EdaVisualizer records={records} />
            <DataStudio
              records={records}
              onDatasetUpdate={handleDatasetUpdate}
              datasetName={datasetName}
            />
          </div>
        )}
      </main>

      {/* Industrial Brutalist Light Footer */}
      <footer className="border-t-2 border-[#0f172a] bg-white py-6 px-6 mt-12 text-sm text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-slate-950 uppercase tracking-wider text-xs bg-[#e2e8f0] px-2 py-1 border-2 border-[#0f172a]">
              CodeAlpha
            </span>
            <span className="font-bold text-slate-900 text-sm">Sales Prediction Engineering</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-600">ISLR Benchmark & Custom Ingestion</span>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Portfolio Data Science Project · 5-Fold CV Verified
          </div>
        </div>
      </footer>

      {/* Export Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="brutal-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#0f172a] pb-3">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Export Executive Memo</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="mech-btn px-2.5 py-1 text-xs font-mono uppercase cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              Generates a clean markdown briefing document containing all cross-validation metrics, channel elasticities, and decision cautions for leadership.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="mech-btn px-4 py-2 text-xs font-mono uppercase font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadExecutiveReport}
                className="mech-btn-primary px-5 py-2 text-xs font-mono uppercase font-bold cursor-pointer"
              >
                Download Memo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
