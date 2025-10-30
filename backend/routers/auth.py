from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
from backend.auth import get_password_hash, verify_password, create_access_token
import os
from fastapi.responses import RedirectResponse
import requests

from dotenv import load_dotenv

#BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
load_dotenv()
#os.path.join(BASE_DIR, ".env"

router = APIRouter(prefix="/auth", tags=["Auth"])
 
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# -------- Local Signup --------
@router.post("/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = models.User(
        username=user.username,
        email=user.email,
        password=get_password_hash(user.password),
    )

    # Assign default "trader" role
    trader_role = db.query(models.Role).filter(models.Role.name == "admin").first()
    if not trader_role:
        trader_role = models.Role(name="admin")
        db.add(trader_role)
        db.commit()
        db.refresh(trader_role)

    db_user.roles.append(trader_role)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# -------- Local Signin --------
@router.post("/signin", response_model=schemas.Token)
def signin(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    roles = [
        {
            "id": role.id,
            "name": role.name,
            "actions": [{"id": action.id, "name": action.name} for action in role.actions]
        }
        for role in db_user.roles
    ]

    token = create_access_token({"sub": db_user.email, "roles": [r["name"] for r in roles]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "username": db_user.username,
            "roles": roles,
        }
    }


@router.get("/google")
def login_with_google():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=email%20profile"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(google_auth_url)

@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    #Exchange code for access token
    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": "http://localhost:8000/auth/google/callback",
            "grant_type": "authorization_code",
        },
    )
    token_res.raise_for_status()
    access_token = token_res.json()["access_token"]

    # Fetch user info
    user_res = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    user_info = user_res.json()
    userId = user_info["id"]
    email = user_info["email"]
    username = user_info.get("name", email.split("@")[0])

    # Create or fetch user in DB
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(
            username=username,
            email=email,
            password=get_password_hash("google_oauth_default"),
        )

        # assign default "trader" role
        trader_role = db.query(models.Role).filter(models.Role.name == "trader").first()
        if not trader_role:
            trader_role = models.Role(name="trader")
            db.add(trader_role)
            db.commit()
            db.refresh(trader_role)

        user.roles.append(trader_role)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Prepare user + roles
    roles_data = [{"id": r.id, "name": r.name} for r in user.roles]

    # Create JWT
    token = create_access_token({"sub": user.email, "roles": [r["name"] for r in roles_data]})

    # 6Redirect popup to frontend with token + user
    frontend_url = (
        f"http://localhost:5173/auth/google/callback"
        f"?token={token}"
        f"&user_id={user.id}"
        f"&email={user.email}"
        f"&username={user.username}"
        f"&roles={','.join([r['name'] for r in roles_data])}"
    )
    return RedirectResponse(frontend_url)

@router.get("/userlist", response_model=list[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

