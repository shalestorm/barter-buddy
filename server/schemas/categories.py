from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    name: str


class CategoryOut(CategoryBase):
    id: int

    class Config:
        orm_mode = True
