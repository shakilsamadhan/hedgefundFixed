from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db
from typing import List


router = APIRouter()

@router.get("/", response_model=List[schemas.Trade])
def read_trades(db: Session = Depends(get_db)):
    return crud.get_trades(db)

@router.post("/", response_model=schemas.Trade)
def create_trade(trade: schemas.TradeCreate, db: Session = Depends(get_db)):
    return crud.create_trade(db, trade)

@router.put("/{trade_id}/", response_model=schemas.Trade)
def update_trade(trade_id: int, trade: schemas.TradeCreate, db: Session = Depends(get_db)):
    return crud.update_trade(db, trade_id, trade)

@router.delete("/{trade_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(trade_id: int, db: Session = Depends(get_db)):
    crud.delete_trade(db, trade_id)
