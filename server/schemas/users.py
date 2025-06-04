from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    rating: Optional[int] = None
    create_date: Optional[date]

    class Config:
        orm_mode = True


class UpdateBio(BaseModel):
    bio: Optional[str]


class UpdateNames(BaseModel):
    first_name: str
    last_name: str
