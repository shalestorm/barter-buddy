from pydantic import BaseModel


class SkillBase(BaseModel):
    name: str
    category_id: int


class SkillCreate(SkillBase):
    pass


class SkillOut(SkillBase):
    id: int

    class Config:
        orm_mode = True
