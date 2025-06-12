from sqlalchemy import Column, Integer, String, Date, Text
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    bio = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)
    profile_pic = Column(String, nullable=True, default="static/profile_pics/default.png")
    create_date = Column(Date)
