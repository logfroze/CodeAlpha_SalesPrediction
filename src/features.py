"""
Feature Engineering & Transformation Pipeline.
CodeAlpha Data Science Internship Project.
"""

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from sklearn.compose import ColumnTransformer


def build_preprocessor(include_synergy: bool = False) -> ColumnTransformer:
    """
    Builds a scikit-learn preprocessing ColumnTransformer.
    
    Args:
        include_synergy: If True, adds interaction terms (e.g. TV * Radio synergy).
        
    Returns:
        ColumnTransformer preprocessor instance.
    """
    feature_cols = ["TV", "Radio", "Newspaper"]
    
    if include_synergy:
        pipe = Pipeline([
            ("poly", PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)),
            ("scaler", StandardScaler()),
        ])
    else:
        pipe = Pipeline([
            ("scaler", StandardScaler()),
        ])
        
    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", pipe, feature_cols),
        ],
        remainder="drop"
    )
    return preprocessor
