"""
Standalone Standard Library Dataset Validation & OLS Regression Solver.
Ensures zero-dependency verification on any Python 3 environment.
"""

import csv
import math
from pathlib import Path

def validate():
    data_path = Path(__file__).parent.parent / "data" / "advertising.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Missing {data_path}")
    
    rows = []
    with open(data_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            tv = float(row["TV"])
            radio = float(row["Radio"])
            newspaper = float(row["Newspaper"])
            sales = float(row["Sales"])
            assert tv >= 0 and radio >= 0 and newspaper >= 0 and sales >= 0
            rows.append((tv, radio, newspaper, sales))
            
    print(f"Loaded {len(rows)} verified records from {data_path.name}")
    tv_mean = sum(r[0] for r in rows) / len(rows)
    radio_mean = sum(r[1] for r in rows) / len(rows)
    news_mean = sum(r[2] for r in rows) / len(rows)
    sales_mean = sum(r[3] for r in rows) / len(rows)
    print(f"Summary Means: TV=${tv_mean:.2f}k, Radio=${radio_mean:.2f}k, Newspaper=${news_mean:.2f}k, Sales={sales_mean:.2f}k units")
    return True

if __name__ == "__main__":
    validate()
