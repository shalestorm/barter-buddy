from pydantic import BaseModel
from server.schemas.categories import CategoryOut


class SkillBase(BaseModel):
    name: str
    category_id: int


class SkillCreate(SkillBase):
    pass


class SkillOut(BaseModel):
    id: int
    name: str
    category_id: int
    category: CategoryOut

    class Config:
        orm_mode = True
