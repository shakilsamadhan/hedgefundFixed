"""
Router for Asset endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend import crud, schemas, database, models
# from backend.bloomberg import BloombergClient
from ..database import get_db
from backend.auth import get_current_user, check_permission


router = APIRouter()


@router.get("/", response_model=list[schemas.Asset])
def read_assets(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    #return [current_user]
    check_permission(current_user, "VIEW_ASSET")
    return crud.get_assets(db, current_user=current_user)

# @router.post("/fetch", response_model=schemas.Asset)
# def fetch_asset(data: schemas.AssetFetch, client: BloombergClient = Depends()):
#     # wrap bloomberg fetch by CUSIP/type
#     fetched = client.bulk_fetch([data.cusip], data.fields)
#     if not fetched:
#         raise HTTPException(404, "Asset not found")
#     return schemas.Asset(**{**fetched[data.cusip], "cusip": data.cusip})

@router.post("/", response_model=schemas.Asset)
def create_asset(
    asset: schemas.AssetCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user) 
    ):
    check_permission(current_user, "CREATE_ASSET")
    return crud.create_asset(db, asset, created_by=current_user.id)

@router.put("/{asset_id}/", response_model=schemas.Asset)
def update_asset(
    asset_id: int, asset: schemas.AssetCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    check_permission(current_user, "UPDATE_ASSET")
    return crud.update_asset(db, asset_id, asset)

@router.delete("/{asset_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: int, db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
    ):
    check_permission(current_user, "DELETE_ASSET")
    return crud.delete_asset(db, asset_id)