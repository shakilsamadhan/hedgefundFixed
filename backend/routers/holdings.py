# backend/routers/holdings.py

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas, database, models
from backend.auth import get_current_user, check_permission

router = APIRouter(
    tags=["holdings"],
)

@router.get("/", response_model=List[schemas.Holding])
def read_holdings(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    """
    Fetch the current portfolio holdings.
    """
    # print(current_user)
    # check_permission(current_user,"VIEW_HOLDING")
    return crud.get_holdings(db)
