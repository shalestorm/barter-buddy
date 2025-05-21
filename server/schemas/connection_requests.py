from pydantic import BaseModel
from typing import Optional


class ConnectionRequestBase(BaseModel):
    sender_id: int
    receiver_id: int
    message: Optional[str] = None


class ConnectionRequestCreate(ConnectionRequestBase):
    pass


class ConnectionRequestOut(ConnectionRequestBase):
    id: int

    class Config:
        orm_mode = True
