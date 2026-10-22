"""
Model Training, Cross-Validation, Evaluation, and Serialization Pipeline.
CodeAlpha Data Science Internship Project.
"""

from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_validate
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

from src.data_loader import load_dataset, split_features_target
from src.models import get_candidate_models


def evaluate_model_holdout(pipeline, X_train, y_train, X_test, y_test) -> dict:
    """Fits on train and evaluates holdout test set."""
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = root_mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    return {
        "MAE": float(mae),
        "RMSE": float(rmse),
        "R2": float(r2),
        "y_pred": [float(p) for p in y_pred]
    }


def run_training_pipeline(random_state: int = 42) -> dict:
    """
    Executes end-to-end training:
    1. Loads data
    2. Performs 80/20 train/test split
    3. Runs 5-Fold Cross Validation across all candidate models
    4. Evaluates on holdout test set
    5. Saves best performing model to models/sales_model_pipeline.joblib
    6. Writes reports/metrics.json
    """
    base_dir = Path(__file__).parent.parent
    models_dir = base_dir / "models"
    reports_dir = base_dir / "reports"
    models_dir.mkdir(parents=True, exist_ok=True)
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    # Ingest data
    df = load_dataset()
    X, y = split_features_target(df)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_state
    )
    
    candidate_models = get_candidate_models(random_state=random_state)
    cv = KFold(n_splits=5, shuffle=True, random_state=random_state)
    
    results = {}
    best_model_name = None
    best_rmse = float("inf")
    best_pipeline = None
    
    for name, pipeline in candidate_models.items():
        # 5-Fold Cross-Validation
        scoring = {
            "neg_mae": "neg_mean_absolute_error",
            "neg_rmse": "neg_root_mean_squared_error",
            "r2": "r2"
        }
        cv_scores = cross_validate(pipeline, X_train, y_train, cv=cv, scoring=scoring)
        
        cv_mae_mean = float(-cv_scores["test_neg_mae"].mean())
        cv_rmse_mean = float(-cv_scores["test_neg_rmse"].mean())
        cv_r2_mean = float(cv_scores["test_r2"].mean())
        
        # Holdout test set evaluation
        holdout_metrics = evaluate_model_holdout(pipeline, X_train, y_train, X_test, y_test)
        
        results[name] = {
            "cv_metrics": {
                "MAE_mean": round(cv_mae_mean, 4),
                "RMSE_mean": round(cv_rmse_mean, 4),
                "R2_mean": round(cv_r2_mean, 4)
            },
            "holdout_metrics": {
                "MAE": round(holdout_metrics["MAE"], 4),
                "RMSE": round(holdout_metrics["RMSE"], 4),
                "R2": round(holdout_metrics["R2"], 4)
            }
        }
        
        # Track best model by test RMSE
        if holdout_metrics["RMSE"] < best_rmse:
            best_rmse = holdout_metrics["RMSE"]
            best_model_name = name
            best_pipeline = pipeline
            
    # Save the best model artifact
    best_model_path = models_dir / "sales_model_pipeline.joblib"
    joblib.dump(best_pipeline, best_model_path)
    
    summary = {
        "dataset_shape": list(df.shape),
        "random_state": random_state,
        "best_model": best_model_name,
        "best_model_test_rmse": round(best_rmse, 4),
        "models": results
    }
    
    # Save metrics JSON for reproducibility and web integration
    with open(reports_dir / "metrics.json", "w") as f:
        json.dump(summary, f, indent=2)
        
    print(f"Training complete. Best model: {best_model_name} (Holdout RMSE: {best_rmse:.4f})")
    print(f"Saved pipeline to: {best_model_path}")
    return summary


if __name__ == "__main__":
    run_training_pipeline()
