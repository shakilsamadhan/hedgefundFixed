from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
from backend.auth import get_password_hash, verify_password, create_access_token
import os
from fastapi.responses import RedirectResponse
import requests

router = APIRouter(prefix="/access", tags=["Access"])

from dotenv import load_dotenv

#BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
load_dotenv()

@router.get("/roles", response_model=list[schemas.Role])
def get_roles(db: Session = Depends(get_db)):
    return db.query(models.Role).all()

@router.get("/actions", response_model=list[schemas.Action])
def get_actions(db: Session = Depends(get_db)):
    return db.query(models.Action).all()

# @router.post("/roles/{role_id}/actions")
# def assign_actions_to_role(role_id: int, action_ids: List[int], db: Session = Depends(get_db)):
#     role = db.query(models.Role).get(role_id)
#     if not role:
#         raise HTTPException(status_code=404, detail="Role not found")
#     role.actions = db.query(models.Action).filter(models.Action.id.in_(action_ids)).all()
#     db.commit()
#     return {"message": f"Actions updated for role {role.name}"}