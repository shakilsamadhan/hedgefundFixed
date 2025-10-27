# backend/routers/assetdata.py

import pandas as pd
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any
from fastapi.responses import JSONResponse
from pathlib import Path
import math

from ..schemas import AssetFetchRequest
# from ..services.bloomberg import fetch_watchlist_data

router = APIRouter(prefix="/assetdata", tags=["AssetData"])

@router.post(
    "/fetch",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def fetch_asset_data(payload: AssetFetchRequest):
    # Map asset types to files
    file_map = {
        "Corporate Bond": "backend/data/bonds.xlsx",
        "Government Bond": "backend/data/bonds.xlsx",
        "Term Loan": "backend/data/loans.xlsx",
        "Revolver": "backend/data/loans.xlsx",
    }

    file_path = file_map.get(payload.asset_type)

    if not file_path or not Path(file_path).exists():
        raise HTTPException(status_code=404, detail="File not found for given asset type")

    # Load Excel file
    df = pd.read_excel(file_path, header=2)

    # Filter by CUSIP
    filtered = df.loc[df['ID'] == payload.cusip]

    if filtered.empty:
        raise HTTPException(status_code=404, detail=f"CUSIP {payload.cusip} not found")

    # Convert DataFrame to dict
    record = filtered.iloc[0].to_dict()  # Get first matching row

    # Replace NaN / inf with None
    for k, v in record.items():
        if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))):
            record[k] = None

    print(record)
    # Map Excel column names to front-end expected fields
    response_data = {
        "deal_name": record.get("Asset (Deal Name)", ""),
        "issuer": record.get("Issuer", ""),
        "spread_coupon": record.get("Spread/Coupon", 0),
        "maturity": record.get("Maturity", ""),
        "payment_rank": record.get("Payment Rank", ""),
        "rtg_moody_long_term": record.get("Moody CFR", ""),
        "rtg_moody": record.get("Moody Asset", ""),
        "rtg_sp_lt_lc_issuer_credit": record.get("S&P CFR", 0),
        "rtg_sp": record.get("S&P Asset", ""),
        "amt_outstanding": record.get("Amount Outstanding", 0),
    }

    return JSONResponse(content=response_data)
