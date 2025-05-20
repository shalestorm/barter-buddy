from sqlalchemy import Column, Integer, Boolean, ForeignKey
from server.db.database import Base


class Connection(Base):

    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    user_a_id = Column(Integer, ForeignKey("users.id"))
    user_b_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
