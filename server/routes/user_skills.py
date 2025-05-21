from fastapi import APIRouter, Depends, HTTPException
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


# assign skill to a user


@router.post("/", response_model=UserSkillOut)
def assign_skill(user_skill: UserSkillCreate, db: Session = Depends(get_db)):
    db_link = UserSkill(**user_skill.dict())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


# get all user's skills


@router.get("/user/{user_id}/skills", response_model=List[SkillOut])
def get_user_skills(user_id: int, db: Session = Depends(get_db)):
    user_skill_link = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    skill_ids = [link.skill_id for link in user_skill_link]
    skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
    return skills


# delete a user's skill link


@router.delete("/{user_skill_id}")
def delete_user_skill(user_skill_id: int, db: Session = Depends(get_db)):
    link = db.query(UserSkill).filter(UserSkill.id == user_skill_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Skill link not found")
    db.delete(link)
    db.commit()
    return "Skill link deleted succesfully"
