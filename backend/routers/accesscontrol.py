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
from backend.auth import get_current_user

#BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
load_dotenv()

def admin_required(current_user: models.User = Depends(get_current_user)):
    # check if user has role "Admin"
    if not any(role.name.lower() == "admin" for role in current_user.roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return current_user

@router.get("/users", response_model=list[schemas.User])
def get_actions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    return db.query(models.User).all()


@router.get("/roles", response_model=list[schemas.Role])
def get_roles(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    return db.query(models.Role).all()


@router.get("/actions", response_model=list[schemas.Action])
def get_actions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    return db.query(models.Action).all()

@router.post("/roles/{role_id}/actions")
def assign_actions_to_role(role_id: int, action_ids: list[int], db: Session = Depends(get_db)):
    role = db.query(models.Role).get(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    role.actions = db.query(models.Action).filter(models.Action.id.in_(action_ids)).all()
    db.commit()
    return {"message": f"Actions updated for role {role.name}"}

@router.post("/users/{user_id}/roles")
def assign_roles_to_user(user_id: int, role_ids: list[int], db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    roles = db.query(models.Role).filter(models.Role.id.in_(role_ids)).all()
    user.roles = roles
    db.commit()
    db.refresh(user)
    return user