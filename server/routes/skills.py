from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server.db.database import SessionLocal
from server.models.skill import Skill
from server.schemas.skills import SkillCreate, SkillOut
from server.models.category import Category

router = APIRouter(prefix="/skills", tags=["Skills"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# create a new skill


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


# get all skills


@router.get("/", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()
