from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server.db.database import SessionLocal
from server.models.message import Message
from server.schemas.messages import MessageCreate, MessageOut

router = APIRouter(prefix="/messages", tags=["Messages"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# create a new message


@router.post("/", response_model=MessageOut)
def send_Message(mes: MessageCreate, db: Session = Depends(get_db)):
    db_message = Message(**mes.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


# get all messages by user


@router.get("/connection/{connection_id}", response_model=List[MessageOut])
def get_user_messages(
    connection_id: int,
    skip: int = 0,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    messages = (
        db.query(Message)
        .filter(Message.connection_id == connection_id)
        .order_by(Message.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return messages


# mark message as read


@router.patch("/{message_id}/read", response_model=MessageOut)
def mark_read(message_id: int, db: Session = Depends(get_db)):
    db_message = db.query(Message).filter(Message.id == message_id).first()
    db_message.is_read = True  # type: ignore
    db.commit()
    db.refresh(db_message)
    return db_message
