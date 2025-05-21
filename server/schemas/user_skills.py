from pydantic import BaseModel


class UserSkillBase(BaseModel):
    user_id: str
    skill_id: int


class UserSkillCreate(UserSkillBase):
    pass


class UserSkillOut(UserSkillBase):
    id: int

    class Config:
        orm_mode = True
