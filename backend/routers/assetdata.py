# backend/routers/assetdata.py

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any
from fastapi.responses import JSONResponse

from ..schemas import AssetFetchRequest
# from ..services.bloomberg import fetch_watchlist_data

router = APIRouter(prefix="/assetdata", tags=["AssetData"])


# @router.post(
#     "/fetch",
#     response_model=Dict[str, Any],
#     status_code=status.HTTP_200_OK,
# )
# def fetch_asset_data(payload: AssetFetchRequest):
#     """
#     Fetch Bloomberg data for a single CUSIP + asset_type,
#     returning only the fields needed to create an Asset.
#     """
#     try:
#         data = fetch_watchlist_data(payload.cusip, payload.asset_type)
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
#             detail=f"Bloomberg fetch error for {payload.cusip}: {e}",
#         )

#     if not data:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No data returned")

#     return JSONResponse(content=data)
