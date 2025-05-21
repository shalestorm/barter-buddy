from pydantic import BaseModel


class ConnectionBase(BaseModel):
    user_a_id: int
    user_b_id: int
    is_active: bool = True


class ConnectionCreate(ConnectionBase):
    pass


class ConnectionOut(ConnectionBase):
    id: int

    class Config:
        orm_mode = True
