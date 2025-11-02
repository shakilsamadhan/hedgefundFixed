# backend/routers/watchlist.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Any, Dict
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import math

from ..database import get_db
from ..models import WatchListItem
from ..schemas import WatchItemCreate, WatchItem, WatchItemWithData
from backend.auth import get_current_user, check_permission
from backend import crud, schemas, database, models
# from ..services.bloomberg import fetch_watchlist_data

router = APIRouter(prefix="/api/watchlist", tags=["WatchList"])


@router.post("", response_model=WatchItem)
def add_to_watch(
    payload: WatchItemCreate,
    db: Session = Depends(get_db),
):
    """
    Add a new CUSIP to the watch list.
    """
    existing = db.query(WatchListItem).filter_by(cusip=payload.cusip).first()
    if existing:
        raise HTTPException(400, f"{payload.cusip} is already on your watch list")
    
    bloomberg_data = crud.get_item_bloombergdata(payload.cusip, payload.asset_type)
    if not bloomberg_data:
        raise HTTPException(
            404,
            detail=f"No Bloomberg data found for {payload.cusip} ({payload.asset_type})"
        )
    item = WatchListItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def remove_from_watch(
    item_id: int,
    db: Session = Depends(get_db),
):
    """
    Remove a CUSIP from the watch list.
    """
    item = db.get(WatchListItem, item_id)
    if not item:
        raise HTTPException(404, "Watch list item not found")
    db.delete(item)
    db.commit()
    return

# Temporary dummy dataset
dummy_watchlist = [
    {
        "id": 1,
        "cusip": "123456AB",
        "asset_type": "Corporate Bond",
        "issuer": "ACME Corp",
        "deal_name": "ACME 2030 Notes",
        "spread_coupon": 250,
        "maturity": "2030-06-15",
        "px_bid": 99.2,
        "px_ask": 100.1,
        "yld_cnv_bid": 5.1,
        "dm_zspread": 280,
        "chg_net_1d": -0.3,
        "chg_net_5d": 0.5,
        "chg_net_1m": 1.2,
        "chg_net_6m": 3.8,
        "chg_net_ytd": 6.5,
        "interval_high": 105.3,
        "interval_low": 95.4,
        "payment_rank": "Senior Unsecured",
        "rtg_moody_long_term": "Baa2",
        "rtg_moody": "Baa3",
        "rtg_sp_lt_lc_issuer_credit": "BBB",
        "rtg_sp": "BBB-",
        "amt_outstanding": 500000000,
        "error": None,
    },
    {
        "id": 2,
        "cusip": "987654ZY",
        "asset_type": "Term Loan",
        "issuer": "Global Energy Ltd",
        "deal_name": "Global Energy TL B",
        "spread_coupon": 350,
        "maturity": "2029-12-01",
        "px_bid": 97.8,
        "px_ask": 98.5,
        "yld_cnv_bid": 6.2,
        "dm_zspread": 410,
        "chg_net_1d": 0.4,
        "chg_net_5d": 0.9,
        "chg_net_1m": 2.3,
        "chg_net_6m": -1.1,
        "chg_net_ytd": 4.7,
        "interval_high": 102.0,
        "interval_low": 92.0,
        "payment_rank": "Secured",
        "rtg_moody_long_term": "Ba2",
        "rtg_moody": "Ba3",
        "rtg_sp_lt_lc_issuer_credit": "BB",
        "rtg_sp": "BB-",
        "amt_outstanding": 750000000,
        "error": None,
    },
]

@router.get("")
async def list_watch(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    skip: int = 0, limit: int = 100
    ):
   # Get WatchListItems from DB
    watchListItems = db.query(models.WatchListItem).offset(skip).limit(limit).all()

    result = []

    # # Loop through each WatchListItem
    for item in watchListItems:
        # Fetch dynamic data from Bloomberg
        bloomberg_data = crud.get_item_bloombergdata(item.cusip, item.asset_type)
        #print(bloomberg_data)
        # Merge static DB fields with dynamic Bloomberg data
        item_data = {
            "id": item.id,
            "cusip": item.cusip,
            "asset_type": item.asset_type.value,
            "issuer": bloomberg_data.get('Issuer') if bloomberg_data else None,
            "deal_name": bloomberg_data.get('Asset (Deal Name)') if bloomberg_data else None,
            "spread_coupon": bloomberg_data.get('Spread/Coupon') if bloomberg_data else None,
            "maturity": bloomberg_data.get('Maturity') if bloomberg_data else None,
            "px_bid": bloomberg_data.get('Bid Price') if bloomberg_data else None,
            "px_ask": bloomberg_data.get('Offer Price') if bloomberg_data else None,
            "yld_cnv_bid": bloomberg_data.get('YTW') if bloomberg_data else None,
            "dm_zspread": bloomberg_data.get('DM/Zspread') if bloomberg_data else None,
            "chg_net_1d": bloomberg_data.get('1d Net Px Chg') if bloomberg_data else None,
            "chg_net_5d": bloomberg_data.get('5d Net Px Chg') if bloomberg_data else None,
            "chg_net_1m": bloomberg_data.get('30d Net Px Chg') if bloomberg_data else None,
            "chg_net_6m": bloomberg_data.get('6m Net Px Chg') if bloomberg_data else None,
            "chg_net_ytd": bloomberg_data.get('YTD Net Px Chg') if bloomberg_data else None,
            "interval_high": bloomberg_data.get('12m High') if bloomberg_data else None,
            "interval_low": bloomberg_data.get('12m Low') if bloomberg_data else None,
            "payment_rank": bloomberg_data.get('Payment Rank') if bloomberg_data else None,
            "rtg_moody_long_term": bloomberg_data.get('Moody CFR') if bloomberg_data else None,
            "rtg_moody": bloomberg_data.get('Moody Asset') if bloomberg_data else None,
            "rtg_sp_lt_lc_issuer_credit": bloomberg_data.get('S&P CFR') if bloomberg_data else None,
            "rtg_sp": bloomberg_data.get('S&P Asset') if bloomberg_data else None,
            "amt_outstanding": bloomberg_data.get('Amount Outstanding') if bloomberg_data else None,

            # Bloomberg error fallback
           "error": None if bloomberg_data else f"{item.id} Bloomberg data not found"  
        }
        result.append(item_data)
    #print(result)
    return result

# @router.get("/", response_model=List[schemas.Trade])
# def read_trades(
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user)
#     ):
#     check_permission(current_user, "VIEW_TRADE")
#     return crud.get_trades(db)