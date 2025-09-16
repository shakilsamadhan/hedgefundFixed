"""
Database setup and session dependency.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1) Define Base here, before any models import it
Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./oms.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite-specific
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2) Import all models so they register themselves against Base
from . import models  # noqa: E402

# 3) Create tables
Base.metadata.create_all(bind=engine)
