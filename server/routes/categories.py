from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.database import SessionLocal
from models.category import Category
from schemas.categories import CategoryOut

router = APIRouter(prefix="/categories", tags=["Categories"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories
