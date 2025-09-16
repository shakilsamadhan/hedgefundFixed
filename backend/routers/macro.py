# backend/routers/macro.py

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Tuple
import math

# from ..services.bloomberg import get_raw_bloomberg_data, normalize_macro_df, FIELDS
from ..schemas import MacroResponse

# Router setup: prefix and disable automatic slash-redirect
router = APIRouter(
    prefix="/api/macro",
    tags=["macro"],
    redirect_slashes=False,
)

# Define your logical groups and tickers
MACRO_GROUPS: List[Tuple[str, List[str]]] = [
    ("Equities",    ["ESA Index", "NQA Index", "RTYA Index"]),
    ("Volatility",  ["VIX Index", "MOVE Index"]),
    ("Credit",      ["IG/Gen Corp", "HY/GEN SPRD Corp"]),
    ("Rates",       ["GT2 Govt", "GT5 Govt", "GT10 Govt", "GT30 Govt"]),
    ("Commodities", ["CLA Comdty", "GCA Comdty"]),
    ("Currencies",  ["DXY Curncy", "EUR Curncy", "GBP Curncy", "JPY Curncy", "BTC Curncy"]),
]

@router.get("/", response_model=List[dict])
async def get_macro_indicators():
    # Temporary dummy data until Bloomberg service is implemented
    demo_data = [
        {"ticker": "ESA Index", "last_price": 5000, "chg_net_1d": 12, "chg_pct_1d": 0.24, "chg_pct_5d": 1.2, "chg_pct_1m": 3.1, "chg_pct_6m": 8.4, "chg_pct_ytd": 12.3, "group": "Equities"},
        {"ticker": "VIX Index", "last_price": 16.3, "chg_net_1d": -0.4, "chg_pct_1d": -2.4, "chg_pct_5d": -5.1, "chg_pct_1m": -8.3, "chg_pct_6m": -12.7, "chg_pct_ytd": -20.1, "group": "Volatility"},
        {"ticker": "DXY Curncy", "last_price": 104.7, "chg_net_1d": 0.2, "chg_pct_1d": 0.19, "chg_pct_5d": 0.8, "chg_pct_1m": -0.5, "chg_pct_6m": 1.1, "chg_pct_ytd": 2.3, "group": "Currencies"},
    ]
    return JSONResponse(content=jsonable_encoder(demo_data))
# @router.get("/", response_model=List[MacroResponse])
# async def get_macro_indicators():
#     all_results = []

#     for group_name, tickers in MACRO_GROUPS:
#         try:
#             # Fetch each group's data off the main thread
#             raw_df = await run_in_threadpool(get_raw_bloomberg_data, tickers, FIELDS)
#             df = normalize_macro_df(raw_df)
#         except Exception as e:
#             raise HTTPException(
#                 status_code=503,
#                 detail=f"Error fetching {group_name} data: {e}"
#             )

#         # Attach the group label to each record
#         for record in df.to_dict(orient="records"):
#             record["group"] = group_name
#             all_results.append(record)

#     # Sanitize NaNs by converting float('nan') to None
#     sanitized = []
#     for rec in all_results:
#         clean = {}
#         for key, val in rec.items():
#             if isinstance(val, float) and math.isnan(val):
#                 clean[key] = None
#             else:
#                 clean[key] = val
#         sanitized.append(clean)

#     # Encode and return the JSON-safe payload
#     return JSONResponse(
#         content=jsonable_encoder(sanitized),
#         media_type="application/json",
#     )
