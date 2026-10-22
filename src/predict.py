"""
Inference Module for Sales Prediction.
CodeAlpha Data Science Internship Project.
"""

from pathlib import Path
from typing import Union, List, Dict
import joblib
import pandas as pd
import numpy as np


MODEL_PATH = Path(__file__).parent.parent / "models" / "sales_model_pipeline.joblib"


def load_model(model_path: Union[str, Path] = MODEL_PATH):
    """Loads the serialized Scikit-learn pipeline."""
    path = Path(model_path)
    if not path.is_file():
        raise FileNotFoundError(
            f"Trained model not found at {path}. Run `python src/train.py` first."
        )
    return joblib.load(path)


def predict_sales(
    tv: float,
    radio: float,
    newspaper: float,
    model=None
) -> Dict[str, float]:
    """
    Predicts sales for given advertising spends with validation.
    
    Args:
        tv: TV advertising spend (in thousands of dollars, >= 0).
        radio: Radio advertising spend (in thousands of dollars, >= 0).
        newspaper: Newspaper advertising spend (in thousands of dollars, >= 0).
        model: Optional preloaded scikit-learn model pipeline.
        
    Returns:
        Dict with predicted sales in thousands of units and estimated revenue.
        
    Raises:
        ValueError: If spends are negative or invalid.
    """
    if tv < 0 or radio < 0 or newspaper < 0:
        raise ValueError("Advertising expenditures cannot be negative.")
        
    if model is None:
        model = load_model()
        
    input_df = pd.DataFrame([{
        "TV": float(tv),
        "Radio": float(radio),
        "Newspaper": float(newspaper)
    }])
    
    predicted_sales = float(model.predict(input_df)[0])
    
    # Sales cannot be negative in physical retail
    bounded_sales = max(0.0, round(predicted_sales, 3))
    
    return {
        "predicted_sales_units_k": bounded_sales,
        "tv_spend_k": float(tv),
        "radio_spend_k": float(radio),
        "newspaper_spend_k": float(newspaper),
        "total_ad_spend_k": float(tv + radio + newspaper)
    }


if __name__ == "__main__":
    import sys
    # Example test run
    sample_tv = 150.0
    sample_radio = 25.0
    sample_newspaper = 15.0
    print("Testing inference with sample input: TV=150k, Radio=25k, Newspaper=15k")
    try:
        res = predict_sales(sample_tv, sample_radio, sample_newspaper)
        print(f"Prediction: {res['predicted_sales_units_k']}k units (Spend: ${res['total_ad_spend_k']}k)")
    except Exception as e:
        print(f"Prediction failed: {e}")
