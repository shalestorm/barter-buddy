from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.db.database import SessionLocal
from server.models.user_skill import UserSkill
from server.schemas.user_skills import UserSkillCreate, UserSkillOut
from server.models.skill import Skill
from server.schemas.skills import SkillOut

router = APIRouter(prefix="/user-skills", tags=["User Skill Links"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=UserSkillOut)
def assign_skill(user_skill: UserSkillCreate, db: Session = Depends(get_db)):
    db_link = UserSkill(**user_skill.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


@router.get("/user/{user_id}/skills", response_model=List[SkillOut])
def get_user_skills(user_id: int, db: Session = Depends(get_db)):
    skills = (
        db.query(Skill)
        .join(UserSkill, Skill.id == UserSkill.skill_id)
        .filter(UserSkill.user_id == user_id)
        .all()
    )
    return skills


@router.delete("/user/{user_id}/skill/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_skill_by_user_and_skill(user_id: int, skill_id: int, db: Session = Depends(get_db)):
    link = (
        db.query(UserSkill)
        .filter(UserSkill.user_id == user_id, UserSkill.skill_id == skill_id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=404, detail="Skill link not found")

    db.delete(link)
    db.commit()
