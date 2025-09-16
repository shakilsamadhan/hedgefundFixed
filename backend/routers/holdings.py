# backend/routers/holdings.py

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter(
    tags=["holdings"],
)

@router.get("/", response_model=List[schemas.Holding])
def read_holdings(db: Session = Depends(database.get_db)):
    """
    Fetch the current portfolio holdings.
    """
    return crud.get_holdings(db)
