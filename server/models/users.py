from sqlalchemy import Column, Integer, String, Date, Text
from server.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstName = Column(String)
    lastName = Column(String)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    bio = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)
    profile_pic = Column(String, nullable=True)
    create_date = Column(Date)
