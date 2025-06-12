from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey
from datetime import datetime, timezone
from db.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_read = Column(Boolean, default=False)
    connection_id = Column(Integer, ForeignKey("connections.id"))
