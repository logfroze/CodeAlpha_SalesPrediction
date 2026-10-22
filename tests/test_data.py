"""
Tests for Data Loader, Schema Invariants, and Sanity Checks.
CodeAlpha Data Science Internship Project.
"""

import pytest
import pandas as pd
import numpy as np
from src.data_loader import load_dataset, validate_dataset, split_features_target, EXPECTED_COLUMNS


def test_load_dataset_exists_and_loads():
    df = load_dataset()
    assert isinstance(df, pd.DataFrame)
    assert df.shape[0] == 200
    assert df.shape[1] == 4


def test_dataset_columns_and_types():
    df = load_dataset()
    for col in EXPECTED_COLUMNS:
        assert col in df.columns
        assert np.issubdtype(df[col].dtype, np.number)


def test_dataset_no_null_values():
    df = load_dataset()
    assert df.isnull().sum().sum() == 0


def test_dataset_no_negative_values():
    df = load_dataset()
    for col in EXPECTED_COLUMNS:
        assert (df[col] >= 0).all()


def test_split_features_target_shapes():
    df = load_dataset()
    X, y = split_features_target(df)
    assert X.shape == (200, 3)
    assert y.shape == (200,)
    assert set(X.columns) == {"TV", "Radio", "Newspaper"}


def test_validate_dataset_raises_on_invalid():
    # Test missing column
    invalid_df = pd.DataFrame({"TV": [10.0], "Radio": [5.0]})
    with pytest.raises(ValueError, match="missing mandatory columns"):
        validate_dataset(invalid_df)
        
    # Test negative spend
    negative_df = pd.DataFrame({"TV": [-10.0], "Radio": [5.0], "Newspaper": [2.0], "Sales": [12.0]})
    with pytest.raises(ValueError, match="negative values"):
        validate_dataset(negative_df)
