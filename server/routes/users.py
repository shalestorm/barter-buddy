from fastapi import APIRouter, Depends, HTTPException, Cookie, status, UploadFile, File
from sqlalchemy.orm import Session
import pathlib
from jose import jwt, JWTError
from typing import List, Optional
from db.database import SessionLocal
from models.users import User
from schemas.users import UserCreate, UserOut, UpdateBio, UpdateNames
from passlib.context import CryptContext
from datetime import date
import shutil
import os

SECRET_KEY = "user_secret_key"
ALGORITHM = "HS256"

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
DEFAULT_PROFILE_PIC = f"{BASE_URL}/static/profile_pics/default.png"

router = APIRouter(prefix="/users", tags=["Users"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    access_token: Optional[str] = Cookie(None), db: Session = Depends(get_db)
) -> User:
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter((User.username == user.username) | (User.email == user.email))
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=400, detail="Username or email already registered"
        )
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        bio=user.bio,
        profile_pic=f"{os.getenv('API_BASE_URL', 'http://localhost:8000')}/static/profile_pics/default.png",
        create_date=date.today(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/", response_model=List[UserOut])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/me/profile_pic", response_model=UserOut)
async def update_user_profile_pic(
    profile_pic: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not profile_pic.filename:
        raise HTTPException(status_code=400, detail="Invalid file upload.")
    extension = os.path.splitext(profile_pic.filename)[-1].lower()
    if extension not in [".png", ".jpg", ".jpeg", ".gif"]:
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    filename = f"profile_{current_user.username}{extension}"
    BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
    media_path = BASE_DIR / "static" / "profile_pics"
    media_path.mkdir(parents=True, exist_ok=True)
    file_path = media_path / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(profile_pic.file, buffer)
    current_user.profile_pic = f"{BASE_URL}/static/profile_pics/{filename}"  # type: ignore
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me/bio", response_model=UserOut)
def update_user_bio(
    update: UpdateBio,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.bio = update.bio  # type: ignore
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me/names", response_model=UserOut)
def update_user_names(
    update: UpdateNames,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.first_name = update.first_name  # type: ignore
    current_user.last_name = update.last_name  # type: ignore
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me", response_model=UserOut, name="auth:me")
@router.get("/auth/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
