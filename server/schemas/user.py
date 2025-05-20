from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr
    firstName: str
    lastName: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    rating: Optional[float]
    creation_date: datetime

    class Config:
        orm_mode = True
