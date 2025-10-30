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

@router.get("", response_model=List[WatchItem])
async def list_watch(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    # check_permission(current_user, "VIEW_WATCHLIST")
    # items = (
    #     db.query(models.WatchListItem)
    #     .filter(models.WatchListItem.user_id == current_user.id)
    #     .all()
    # )

    # return items
    return JSONResponse(content=jsonable_encoder(dummy_watchlist))

# @router.get("/", response_model=List[schemas.Trade])
# def read_trades(
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user)
#     ):
#     check_permission(current_user, "VIEW_TRADE")
#     return crud.get_trades(db)