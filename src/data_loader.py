"""
Data Loader & Validation Module for Sales Prediction.
CodeAlpha Data Science Internship Project.
"""

from pathlib import Path
from typing import Tuple, List, Optional
import pandas as pd
import numpy as np


EXPECTED_COLUMNS = ["TV", "Radio", "Newspaper", "Sales"]
FEATURE_COLUMNS = ["TV", "Radio", "Newspaper"]
TARGET_COLUMN = "Sales"


def load_dataset(file_path: Optional[str] = None) -> pd.DataFrame:
    """
    Loads and validates the sales advertising dataset.
    
    Args:
        file_path: Path to the CSV file. If None, defaults to 'data/advertising.csv'.
        
    Returns:
        pd.DataFrame: Cleaned and validated dataset.
        
    Raises:
        FileNotFoundError: If the specified file does not exist.
        ValueError: If required columns are missing or data types are invalid.
    """
    if file_path is None:
        file_path = str(Path(__file__).parent.parent / "data" / "advertising.csv")
        
    path = Path(file_path)
    if not path.is_file():
        raise FileNotFoundError(f"Sales dataset file not found at: {file_path}")
        
    df = pd.read_csv(path)
    
    # Check for legacy unnamed index column (e.g., 'Unnamed: 0') and drop if present
    unnamed_cols = [c for c in df.columns if "Unnamed" in c]
    if unnamed_cols:
        df = df.drop(columns=unnamed_cols)
        
    validate_dataset(df)
    return df


def validate_dataset(df: pd.DataFrame) -> None:
    """
    Validates dataset structure, column presence, types, and values.
    
    Args:
        df: Input pandas DataFrame.
        
    Raises:
        ValueError: On schema violations or corrupted data.
    """
    missing_cols = [col for col in EXPECTED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset missing mandatory columns: {missing_cols}")
        
    if df.empty:
        raise ValueError("Dataset contains 0 rows.")
        
    null_counts = df[EXPECTED_COLUMNS].isnull().sum().to_dict()
    if any(count > 0 for count in null_counts.values()):
        raise ValueError(f"Dataset contains null values: {null_counts}")
        
    # Check numeric types
    for col in EXPECTED_COLUMNS:
        if not np.issubdtype(df[col].dtype, np.number):
            raise ValueError(f"Column '{col}' must be numeric, got {df[col].dtype}")
            
    # Check for negative values (ad spend and sales cannot be negative)
    for col in EXPECTED_COLUMNS:
        if (df[col] < 0).any():
            raise ValueError(f"Column '{col}' contains negative values, which is physically invalid.")


def split_features_target(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Separates independent feature predictors from the sales target.
    
    Args:
        df: Cleaned sales DataFrame.
        
    Returns:
        Tuple of (X: pd.DataFrame, y: pd.Series).
    """
    validate_dataset(df)
    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()
    return X, y
