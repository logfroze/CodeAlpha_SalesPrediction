"""
Model Architecture Definitions & Scikit-learn Pipeline Factory.
CodeAlpha Data Science Internship Project.
"""

from typing import Dict, Any
from sklearn.pipeline import Pipeline
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from src.features import build_preprocessor


def get_candidate_models(random_state: int = 42) -> Dict[str, Pipeline]:
    """
    Constructs candidate model pipelines with standard preprocessing.
    
    Includes:
    1. Baseline Dummy Regressor (predicts mean)
    2. Ordinary Least Squares Linear Regression
    3. Ridge Regression (L2 regularization)
    4. Random Forest Regressor (non-linear tabular ensemble)
    5. HistGradientBoosting Regressor (gradient boosting on decision trees)
    
    Returns:
        Dict mapping model name to Scikit-learn Pipeline.
    """
    preprocessor = build_preprocessor(include_synergy=False)
    
    models = {
        "Baseline (Dummy Mean)": Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", DummyRegressor(strategy="mean"))
        ]),
        "Linear Regression (OLS)": Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", LinearRegression())
        ]),
        "Ridge Regression": Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", Ridge(alpha=1.0, random_state=random_state))
        ]),
        "Random Forest Regressor": Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", RandomForestRegressor(
                n_estimators=100,
                max_depth=6,
                min_samples_split=4,
                random_state=random_state
            ))
        ]),
        "HistGradientBoosting": Pipeline([
            ("preprocessor", preprocessor),
            ("regressor", HistGradientBoostingRegressor(
                max_iter=100,
                max_depth=4,
                learning_rate=0.08,
                random_state=random_state
            ))
        ])
    }
    
    return models
