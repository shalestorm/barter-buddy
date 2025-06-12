from fastapi import APIRouter, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.database import SessionLocal
from models.message import Message
from schemas.messages import MessageCreate, MessageOut

router = APIRouter(prefix="/messages", tags=["Messages"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MessageOut)
def send_message(mes: MessageCreate = Body(...), db: Session = Depends(get_db)):
    db_message = Message(**mes.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/connection/{connection_id}", response_model=List[MessageOut])
def get_user_messages(
    connection_id: int,
    skip: int = 0,
    limit: int = 500,
    db: Session = Depends(get_db)
):
    messages = (
        db.query(Message)
        .filter(Message.connection_id == connection_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return messages


@router.patch("/{message_id}/read", response_model=MessageOut)
def mark_read(message_id: int, db: Session = Depends(get_db)):
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    db_message.is_read = True  # type: ignore
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/user/{user_id}/unread", response_model=List[int])
def get_unread_connection_ids(user_id: int, db: Session = Depends(get_db)):
    unread_messages = (
        db.query(Message.connection_id)
        .filter(
            Message.receiver_id == user_id,
            Message.is_read.is_(False)
        )
        .distinct()
        .all()
    )
    return [cid[0] for cid in unread_messages]
