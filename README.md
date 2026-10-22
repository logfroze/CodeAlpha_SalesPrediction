# CodeAlpha Sales Prediction (CodeAlpha_SalesPrediction)

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Tests: Pytest Passing](https://img.shields.io/badge/tests-pytest%20passing-brightgreen.svg)](tests/)

A portfolio-quality machine learning and econometric marketing mix modeling project developed for the **CodeAlpha Data Science Internship**. This project analyzes historical advertising expenditures across multiple broadcast and print media channels, evaluates candidate regression and ensemble models, inspects residual behavior, and delivers evidence-based marketing optimization strategies with strict causal discipline.

---

## Table of Contents
1. [Project Overview & Internship Goal](#project-overview--internship-goal)
2. [Dataset Inspection & Citation](#dataset-inspection--citation)
3. [Exploratory Data Analysis Findings](#exploratory-data-analysis-findings)
4. [Modeling Strategy & Preprocessing](#modeling-strategy--preprocessing)
5. [Evaluation Results & Model Comparison](#evaluation-results--model-comparison)
6. [Residual Diagnostics & Error Analysis](#residual-diagnostics--error-analysis)
7. [Actionable Business Insights & Causal Honesty](#actionable-business-insights--causal-honesty)
8. [Project Structure](#project-structure)
9. [Installation & Reproduction Workflow](#installation--reproduction-workflow)
10. [Automated Testing](#automated-testing)
11. [Web Simulator & Interactive Interface](#web-simulator--interactive-interface)
12. [Limitations & Future Improvements](#limitations--future-improvements)

---

## 1. Project Overview & Internship Goal
The objective of this project is to build an end-to-end, reproducible regression modeling pipeline to predict product sales from multi-channel advertising budgets. Beyond achieving high predictive accuracy ($R^2 > 0.95$), the project investigates channel sensitivity, interaction synergies, diminishing marginal returns, and the distinction between observational correlation and causal attribution.

---

## 2. Dataset Inspection & Citation
- **Benchmark Source**: The canonical ISLR Advertising dataset from Gareth James, Daniela Witten, Trevor Hastie, and Robert Tibshirani (2013), *An Introduction to Statistical Learning: with Applications in R*.
- **License**: CC BY-NC 4.0 (Educational and academic research use).
- **Official Documentation**: See `data/README.md`.
- **Records**: 200 cross-sectional market observations, 0 missing/null values, 0 duplicate entries.

### Feature & Target Schema
| Column | Type | Units | Description |
|:---|:---|:---|:---|
| `TV` | Numeric (Float64) | \$1,000s USD | Advertising expenditure allocated to television. |
| `Radio` | Numeric (Float64) | \$1,000s USD | Advertising expenditure allocated to radio broadcast. |
| `Newspaper` | Numeric (Float64) | \$1,000s USD | Advertising expenditure allocated to print newspapers. |
| `Sales` | Numeric (Float64) | 1,000s Units | **Target Outcome**: Unit sales of the product line. |

---

## 3. Exploratory Data Analysis Findings
1. **Target Distribution**: Unit sales range between $1.6\text{k}$ and $27.0\text{k}$ units ($\mu = 14.02\text{k}, \sigma = 5.22\text{k}$). The distribution is approximately bell-shaped and unimodal with no severe skew.
2. **Univariate Channel Correlations**:
   - $\text{TV} \leftrightarrow \text{Sales}$: $r = +0.782$ (Strong positive linear association).
   - $\text{Radio} \leftrightarrow \text{Sales}$: $r = +0.576$ (Moderate positive linear association).
   - $\text{Newspaper} \leftrightarrow \text{Sales}$: $r = +0.228$ (Weak positive linear association).
3. **Collinearity Detection**:
   - Correlation between TV and Radio is nearly zero ($r = 0.055$), allowing clean coefficient estimation without collinearity instability between these two primary drivers.
   - Correlation between Radio and Newspaper is mild ($r = 0.354$), which creates an omitted variable trap in univariate analysis.

---

## 4. Modeling Strategy & Preprocessing
- **Validation Design**: Because the 200 market entries are independent cross-sectional regional observations (not sequential time series), an 80/20 train/test split with fixed random seed (`random_state=42`) and 5-Fold Cross Validation on the training split is employed.
- **Preprocessing Pipeline**: A Scikit-learn `ColumnTransformer` standardizes features with `StandardScaler` to ensure regularized penalty terms operate symmetrically across channel scales.

### Candidate Models
1. **Baseline Dummy Regressor**: Predicts the training target mean for all observations ($R^2 = 0.000$).
2. **OLS Linear Regression**: Standard parametric linear model for interpretable coefficients.
3. **Ridge Regression**: L2-penalized linear regression ($\alpha = 1.0$) to stabilize variance.
4. **Random Forest Regressor**: 100 trees, `max_depth=6`, non-parametric partitioning.
5. **HistGradientBoosting Regressor**: Gradient-boosted decision trees capable of capturing non-linear saturation thresholds and cross-channel synergy.

---

## 5. Evaluation Results & Model Comparison

Evaluated on the 20% holdout test partition (40 unseen regional markets) and 5-Fold Cross Validation on the training partition:

| Model | 5-Fold CV MAE | 5-Fold CV RMSE | 5-Fold CV $R^2$ | Holdout Test RMSE | Holdout Test $R^2$ |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Baseline (Dummy Mean)** | 4.281 | 5.242 | -0.012 | 5.084 | 0.000 |
| **OLS Linear Regression** | 1.253 | 1.662 | 0.892 | 1.405 | 0.899 |
| **Ridge Regression ($\alpha=1.0$)** | 1.254 | 1.661 | 0.892 | 1.408 | 0.899 |
| **Random Forest Regressor** | 0.792 | 1.124 | 0.949 | 0.984 | 0.951 |
| **HistGradientBoosting** | **0.741** | **1.048** | **0.956** | **0.887** | **0.960** |

*HistGradientBoosting delivers the highest explanatory power ($R^2 = 0.960$, Holdout RMSE = $0.887\text{k}$ units), improving upon linear models by modeling the multiplicative interaction between TV and Radio campaigns.*

---

## 6. Residual Diagnostics & Error Analysis
- **Residual Distribution**: Centered around zero with symmetric tails, indicating no systematic under- or over-prediction bias across the sales spectrum.
- **Heteroskedasticity**: In pure linear regression, residual spread increases slightly at higher sales volumes. Ensemble gradient boosting significantly contracts this spread.
- **Residual vs. Fitted**: Random scatter confirms that non-linear patterns have been absorbed by the boosting trees.

---

## 7. Actionable Business Insights & Causal Honesty

### Empirical Takeaways
1. **TV Advertising is the Core Volume Driver**: Provides consistent, high-volume reach across all market sizes.
2. **Radio Advertising is the Most Efficient Per-Dollar Lever**: Has the highest marginal derivative per \$1,000 up to approximately \$35k–\$40k spend, after which saturation begins.
3. **Newspaper Advertising is Non-Significant**: When controlling for TV and Radio spend, the OLS p-value for Newspaper is $p = 0.86$. Allocating marketing budgets to print newspaper ads provides zero statistically validated sales lift in this dataset.
4. **Channel Synergy (Multiplicative Effect)**: Combining TV and Radio campaigns produces higher sales than the sum of both running independently.

### Causal Inference Warning
> Observational data alone cannot prove causal relationships. Regression coefficients represent historical correlations under existing operational practices. Before executing large-scale marketing budget reallocation, marketing organizations must perform randomized geo-split holdout experiments (A/B testing) to establish true incremental causal lift.

---

## 8. Project Structure
```
CodeAlpha_SalesPrediction/
├── data/
│   ├── advertising.csv          # Canonical benchmark dataset (200 records)
│   └── README.md                # Data documentation, units, and licensing
├── notebooks/
│   └── sales_prediction_analysis.ipynb # Interactive Jupyter analysis
├── src/
│   ├── __init__.py
│   ├── data_loader.py           # Ingestion, validation, and type guards
│   ├── features.py              # Preprocessing & feature pipelines
│   ├── models.py                # Candidate model definitions
│   ├── train.py                 # Training, CV, metrics, and serialization
│   └── predict.py               # Inference module with input validation
├── models/
│   └── sales_model_pipeline.joblib # Saved best model artifact
├── reports/
│   ├── business_insights_report.md # Executive business memo
│   └── metrics.json             # Serialized benchmark metrics
├── tests/
│   ├── test_data.py             # Schema, type, and boundary tests
│   └── test_models.py           # Model fitting and invariance tests
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation
```

---

## 9. Installation & Reproduction Workflow

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/CodeAlpha/CodeAlpha_SalesPrediction.git
cd CodeAlpha_SalesPrediction
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Data Ingestion & Training
```bash
python3 src/train.py
```

### 3. Run Predictions from CLI
```bash
python3 src/predict.py
```

### 4. Launch Jupyter Notebook
```bash
jupyter notebook notebooks/sales_prediction_analysis.ipynb
```

---

## 10. Automated Testing
Run the test suite using pytest:
```bash
pytest -v tests/
```

---

## 11. Web Simulator & Interactive Interface
An executive dashboard is integrated into the web client, featuring:
- **Dark Slate Skeuomorphic & Neumorphic Design**: Recessed well plates, tactile debossed sliders, rotary dial controls, and LED state beacons.
- **Real-Time Ad Spend Scenario Simulator**: Test budget combinations across TV, Radio, and Newspaper with dynamic confidence intervals.
- **Exploratory Data Studio**: Interactive scatter plots, correlation heatmaps, and outlier distributions.
- **Custom CSV Ingestion**: Upload any marketing or sales CSV to run on-the-fly model fitting and analysis.

---

## 12. Limitations & Future Improvements
1. **Cross-Sectional Limitation**: Lacks date timestamps; future iterations should incorporate temporal marketing mix modeling (MMM) with ad-stock decay and carryover lags.
2. **Channel Omission**: Modern digital channels (Meta, Google Search, TikTok) are not represented in this legacy dataset.
3. **Macroeconomic Confounders**: Competitor pricing, seasonality, and promotional discounts are unobserved.
