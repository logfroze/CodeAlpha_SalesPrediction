"""
Tests for Model Architectures, Training Pipeline, and Prediction Invariance.
CodeAlpha Data Science Internship Project.
"""

import pytest
import numpy as np
import pandas as pd
from src.data_loader import load_dataset, split_features_target
from src.models import get_candidate_models
from src.train import run_training_pipeline
from src.predict import predict_sales, load_model


def test_candidate_models_instantiation():
    models = get_candidate_models()
    assert "Linear Regression (OLS)" in models
    assert "Ridge Regression" in models
    assert "Random Forest Regressor" in models
    assert "HistGradientBoosting" in models
    
    for name, pipe in models.items():
        assert hasattr(pipe, "fit")
        assert hasattr(pipe, "predict")


def test_fit_and_monotonicity_sanity():
    """Verify that models fit and higher TV spend generally correlates with higher sales."""
    df = load_dataset()
    X, y = split_features_target(df)
    
    models = get_candidate_models()
    lin_reg = models["Linear Regression (OLS)"]
    lin_reg.fit(X, y)
    
    # Compare TV = 20 vs TV = 250 with constant Radio/Newspaper
    low_spend = pd.DataFrame([{"TV": 20.0, "Radio": 20.0, "Newspaper": 20.0}])
    high_spend = pd.DataFrame([{"TV": 250.0, "Radio": 20.0, "Newspaper": 20.0}])
    
    pred_low = lin_reg.predict(low_spend)[0]
    pred_high = lin_reg.predict(high_spend)[0]
    
    assert pred_high > pred_low, "Expected higher TV spend to predict higher sales in OLS."


def test_predict_sales_negative_input_raises():
    with pytest.raises(ValueError, match="cannot be negative"):
        predict_sales(tv=-5.0, radio=10.0, newspaper=10.0)
