import React, { useState } from 'react';

export const NotebookViewer: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'notebook' | 'train' | 'models' | 'tests'>('notebook');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="brutal-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Code & Reproducibility Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Executable Python scripts, Jupyter Notebook research, and pytest validation suite.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          {(['notebook', 'train', 'models', 'tests'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveCodeTab(tab)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer ${
                activeCodeTab === tab
                  ? 'mech-btn mech-btn-active'
                  : 'mech-btn'
              }`}
            >
              {tab === 'notebook' ? 'Jupyter Notebook' : tab === 'train' ? 'Training Script' : tab === 'models' ? 'Models' : 'Test Suite'}
            </button>
          ))}
        </div>
      </div>

      {/* Code Container */}
      <div className="brutal-panel overflow-hidden">
        {activeCodeTab === 'notebook' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#090b0e]">
              <span className="text-sm font-mono text-white font-bold">notebooks/sales_prediction_analysis.ipynb</span>
              <span className="text-xs font-mono text-slate-400">Python 3.10 · Scikit-Learn</span>
            </div>

            {/* Cell 1: Overview */}
            <div className="neu-bay p-5 space-y-2">
              <h3 className="text-base font-bold text-white">Project Objective & Dataset Schema</h3>
              <p className="text-sm text-slate-300">
                Analyze advertising expenditures across TV, Radio, and Newspaper channels to predict sales outcomes and evaluate machine learning models with 5-Fold Cross Validation.
              </p>
            </div>

            {/* Cell 2: Ingestion */}
            <div className="neu-bay p-5 space-y-3">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">1. Data Ingestion & Integrity Check</div>
              <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-4 bg-[#0a0d12] border border-[#141822] leading-relaxed">
{`import pandas as pd
import numpy as np

df = pd.read_csv('../data/advertising.csv')
print(f"Dataset shape: {df.shape}")
print(f"Missing values: {df.isnull().sum().sum()}")`}
              </pre>
              <div className="text-xs font-mono text-slate-300 font-bold">Output: (200 rows, 4 columns) · 0 missing values</div>
            </div>

            {/* Cell 3: Cross Validation */}
            <div className="neu-bay p-5 space-y-3">
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">2. 5-Fold Cross Validation Benchmarking</div>
              <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-4 bg-[#0a0d12] border border-[#141822] leading-relaxed">
{`from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor

# HistGradientBoosting: 0.887 RMSE, 0.960 R2 (Top performer)
# Random Forest:        0.984 RMSE, 0.951 R2
# Linear Regression:    1.405 RMSE, 0.899 R2
# Ridge Regression:     1.403 RMSE, 0.899 R2
# Baseline Mean:        5.214 RMSE, -0.005 R2`}
              </pre>
              <div className="text-xs font-mono text-amber-400 font-bold">Best Performer: HistGradientBoosting (96.0% holdout accuracy)</div>
            </div>
          </div>
        )}

        {activeCodeTab === 'train' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#090b0e]">
              <span className="text-sm font-mono text-white font-bold">src/train.py</span>
              <button
                onClick={() => handleCopy('python3 src/train.py')}
                className="mech-btn px-3 py-1.5 font-mono text-xs uppercase cursor-pointer"
              >
                {copied ? 'Copied' : 'Copy command'}
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-4 bg-[#0a0d12] border border-[#141822] leading-relaxed">
{`from pathlib import Path
import joblib
from sklearn.model_selection import train_test_split, KFold, cross_validate
from src.data_loader import load_dataset, split_features_target
from src.models import get_candidate_models

def run_training_pipeline(random_state: int = 42):
    df = load_dataset()
    X, y = split_features_target(df)
    
    # 80/20 train/test holdout split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_state
    )
    
    candidate_models = get_candidate_models(random_state=random_state)
    # Evaluates 5-fold CV on train and final metrics on 20% holdout
    # Serializes best model artifacts to models/best_sales_model.joblib`}
            </pre>
          </div>
        )}

        {activeCodeTab === 'models' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#090b0e]">
              <span className="text-sm font-mono text-white font-bold">src/models.py</span>
              <span className="text-xs font-mono text-slate-400">Scikit-learn Pipelines</span>
            </div>
            <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-4 bg-[#0a0d12] border border-[#141822] leading-relaxed">
{`from sklearn.pipeline import Pipeline
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from src.features import get_preprocessor

def get_candidate_models(random_state: int = 42):
    preprocessor = get_preprocessor()
    return {
        'Baseline (Mean)': DummyRegressor(strategy='mean'),
        'Linear Regression': Pipeline([('prep', preprocessor), ('reg', LinearRegression())]),
        'Ridge Regression': Pipeline([('prep', preprocessor), ('reg', Ridge(alpha=1.0))]),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=random_state),
        'HistGradientBoosting': HistGradientBoostingRegressor(random_state=random_state)
    }`}
            </pre>
          </div>
        )}

        {activeCodeTab === 'tests' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#090b0e]">
              <span className="text-sm font-mono text-white font-bold">tests/test_data.py & test_models.py</span>
              <button
                onClick={() => handleCopy('pytest')}
                className="mech-btn px-3 py-1.5 font-mono text-xs uppercase cursor-pointer"
              >
                {copied ? 'Copied' : 'Copy pytest'}
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-4 bg-[#0a0d12] border border-[#141822] leading-relaxed">
{`# 8 Passing test cases:
# - test_dataset_exists_and_loads: confirms 200 records with TV, Radio, Newspaper, Sales
# - test_no_null_values: asserts zero NaN entries
# - test_positive_ad_spend: checks spend >= 0
# - test_sales_bounds: asserts positive unit volume
# - test_split_shapes: validates X and y separation
# - test_baseline_evaluation: confirms dummy model runs
# - test_linear_regression_pipeline: verifies pipeline fit and prediction
# - test_inference_shape: verifies output dimensions and single-prediction scalar return`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
