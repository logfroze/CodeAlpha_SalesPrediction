# Advertising Dataset Documentation

## 1. Overview & Source
- **Dataset Name**: ISLR Advertising Dataset (Marketing Mix Analysis)
- **Primary Citation**: Gareth James, Daniela Witten, Trevor Hastie, and Robert Tibshirani (2013). *An Introduction to Statistical Learning: with Applications in R*. Springer New York.
- **Official Open Resource**: https://www.statlearning.com/resources-first-edition
- **License**: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) for academic and educational usage.
- **Substitution Note**: As instructed for the CodeAlpha internship, when an internship-specific private raw dataset is not pre-packaged in the workspace, a clearly cited, verifiable benchmark dataset with full schema transparency is utilized.

## 2. Schema Specification

| Feature Name | Data Type | Units / Scale | Description |
|:---|:---|:---|:---|
| `TV` | Float64 | Thousands of USD ($1,000s) | Advertising budget spent on Television promotion across 200 distinct regional markets. |
| `Radio` | Float64 | Thousands of USD ($1,000s) | Advertising budget spent on Radio broadcast commercials. |
| `Newspaper` | Float64 | Thousands of USD ($1,000s) | Advertising budget spent on Newspaper print advertisements. |
| `Sales` | Float64 | Thousands of Units (1,000s) | **Target Variable**: Sales of a single product line in each market. |

## 3. Data Quality & Distribution Summary
- **Record Count**: 200 observations.
- **Missing / Null Values**: 0 missing values across all columns.
- **Duplicates**: None detected.
- **Target Distribution**: Mean 14.02k units (Std: 5.22k, Min: 1.6k, Max: 27.0k). Normal unimodal distribution without excessive kurtosis.
- **Multicollinearity Checks**: Low correlation between TV and Radio ($r \approx 0.05$), mild correlation between Radio and Newspaper ($r \approx 0.35$).
- **No Temporal Leakage**: This dataset consists of independent cross-sectional regional market observations; therefore, time-series lag features are not applicable and would introduce artificial bias. Standard 5-fold cross-validation and random stratified/shuffled train-test splits are statistically valid.
