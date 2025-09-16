# backend/crud.py

from typing import List
from decimal import Decimal
from fastapi import HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from backend.auth import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException, status

# ----- ASSET & TRADE CRUD (unchanged) -----

def get_assets(db: Session, current_user: models.User, skip: int = 0, limit: int = 100) -> List[models.Asset]:
    # Admin sees all
    if any(role.name == "admin" for role in current_user.roles):
        return db.query(models.Asset).offset(skip).limit(limit).all()
    
    # Trader sees only their own assets
    return db.query(models.Asset)\
             .filter(models.Asset.created_by == current_user.id)\
             .offset(skip)\
             .limit(limit)\
             .all()

def get_asset(db: Session, asset_id: int) -> models.Asset | None:
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()

# def create_asset(db: Session, asset: schemas.AssetCreate) -> models.Asset:
#     db_asset = models.Asset(**asset.dict())
#     db.add(db_asset)
#     db.commit()
#     db.refresh(db_asset)
#     return db_asset

def create_asset(db: Session, asset: schemas.AssetCreate, created_by: int) -> models.Asset:
    db_asset = models.Asset(**asset.dict(exclude={"created_by"}), created_by=created_by)
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset(db: Session, asset_id: int, asset: schemas.AssetCreate) -> models.Asset:
    db_asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if not db_asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    for field, value in asset.dict().items():
        setattr(db_asset, field, value)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: int) -> None:
    db_asset = db.query(models.Asset).filter(models.Asset.id == asset_id).first()
    if db_asset:
        db.delete(db_asset)
        db.commit()

def get_trades(db: Session, skip: int = 0, limit: int = 100) -> List[models.Trade]:
    return db.query(models.Trade).offset(skip).limit(limit).all()

def get_trade(db: Session, trade_id: int) -> models.Trade | None:
    return db.query(models.Trade).filter(models.Trade.id == trade_id).first()

def create_trade(db: Session, trade: schemas.TradeCreate) -> models.Trade:
    db_trade = models.Trade(**trade.dict())
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

def update_trade(db: Session, trade_id: int, trade: schemas.TradeCreate) -> models.Trade:
    db_trade = db.query(models.Trade).filter(models.Trade.id == trade_id).first()
    if not db_trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    for field, value in trade.dict().items():
        setattr(db_trade, field, value)
    db.commit()
    db.refresh(db_trade)
    return db_trade

def delete_trade(db: Session, trade_id: int) -> None:
    db_trade = db.query(models.Trade).filter(models.Trade.id == trade_id).first()
    if db_trade:
        db.delete(db_trade)
        db.commit()

# ----- HOLDINGS AGGREGATION -----

BOND_LIKE_TYPES = [
    "Corporate Bond",
    "Government Bond",
    "Term Loan",
    "Revolver",
    "Delayed Draw Term Loan",
]

def get_holdings(db: Session) -> List[schemas.Holding]:
    """
    Build list of current holdings with:
      - position
      - average cost (per 100 for bond-like)
      - mark (market price)
      - market value
      - PnL (MtM)
    """
    holdings: List[schemas.Holding] = []
    all_assets = db.query(models.Asset).all()

    for asset in all_assets:
        trds = db.query(models.Trade).filter(models.Trade.asset_id == asset.id).all()

        # net raw notional position
        position = sum(
            t.quantity if t.direction in ("Buy Long", "Cover Short") else -t.quantity
            for t in trds
        )
        pos_dec = Decimal(position)

        # total cost and avg cost (per unit or per 100 for bonds)
        total_cost = sum(
            Decimal(t.quantity) * Decimal(t.price)
            for t in trds
            if t.direction in ("Buy Long", "Sell Short")
        )
        avg_cost = (total_cost / pos_dec) if pos_dec != 0 else Decimal(0)

        # mark price
        mark_dec = Decimal(asset.mark) if asset.mark is not None else Decimal(0)

        # market value & PnL
        if asset.type in BOND_LIKE_TYPES:
            # quoted per 100
            market_value = (mark_dec / Decimal(100)) * pos_dec
            pnl = ((mark_dec - avg_cost) / Decimal(100)) * pos_dec
        else:
            # quoted per unit
            market_value = mark_dec * pos_dec
            pnl = market_value - (avg_cost * pos_dec)

        holdings.append(
            schemas.Holding(
                id=asset.id,
                fund=trds[0].fund_alloc if trds else "",
                sub_alloc=trds[0].sub_alloc if trds else "",
                display_name=asset.display_name,
                position=float(pos_dec),
                mark=float(mark_dec),
                market_value=float(market_value),
                cost_basis=float(avg_cost),
                mtm_pnl=float(pnl),
                type=asset.type,
                issuer=asset.issuer or "",
            )
        )

    return holdings





def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user

