from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db
from backend import crud, schemas, database, models
from typing import List
from backend.auth import get_current_user, check_permission


router = APIRouter()

@router.get("/", response_model=List[schemas.Trade])
def read_trades(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    check_permission(current_user, "VIEW_TRADE")
    return crud.get_trades(db, current_user=current_user)

@router.post("/", response_model=schemas.Trade)
def create_trade(
    trade: schemas.TradeCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    check_permission(current_user, "CREATE_TRADE")
    return crud.create_trade(db, trade, current_user)

@router.put("/{trade_id}/", response_model=schemas.Trade)
def update_trade(
    trade_id: int, 
    trade: schemas.TradeCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    check_permission(current_user, "UPDATE_TRADE")
    return crud.update_trade(db, trade_id, trade)

@router.delete("/{trade_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(
    trade_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    check_permission(current_user, "DELETE_TRADE")
    crud.delete_trade(db, trade_id)
