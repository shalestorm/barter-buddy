from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.db.database import SessionLocal
from server.models.users import User
from server.schemas.users import UserCreate, UserOut, UpdateBio, UpdateProfilePic

router = APIRouter(prefix="/users", tags=["Users"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# create a new user


@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=user.password,
        firstName=user.firstName,
        lastName=user.lastName,
        bio=user.bio,
        profile_pic=user.profile_pic,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# get all users


@router.get("/", response_model=List[UserOut])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


# get user by id


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# update user profile pic

@router.put("/{user_id}/profile_pic", response_model=UserOut)
def update_user_profile_pic(user_id: int, update: UpdateProfilePic, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.profile_pic = update.profile_pic  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# update user bio


@router.put("/{user_id}/bio", response_model=UserOut)
def update_user_bio(user_id: int, update: UpdateBio, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.bio = update.bio  # type: ignore
    db.commit()
    db.refresh(user)
    return user
