from pydantic import BaseModel
from datetime import datetime


class MessageBase(BaseModel):
    sender_id: int
    receiver_id: int
    content: str
    connection_id: int


class MessageCreate(MessageBase):
    pass


class MessageOut(MessageBase):
    id: int
    timestamp: datetime
    is_read: bool

    class Config:
        orm_mode = True
