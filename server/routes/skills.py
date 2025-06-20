from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.database import SessionLocal
from models.skill import Skill
from schemas.skills import SkillCreate, SkillOut


router = APIRouter(prefix="/skills", tags=["Skills"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=SkillOut)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db)):
    db_skill = Skill(
        name=skill.name,
        category_id=skill.category_id,
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.get("/", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()
