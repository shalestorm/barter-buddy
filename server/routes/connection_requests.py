from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.db.database import SessionLocal
from server.models.connection_request import ConnectionRequest
from server.schemas.connection_requests import (
    ConnectionRequestCreate,
    ConnectionRequestOut,
)

router = APIRouter(prefix="/connection_requests", tags=["Connection Requests"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ConnectionRequestOut)
def send_connection_request(
    con_req: ConnectionRequestCreate, db: Session = Depends(get_db)
):
    db_con_req = ConnectionRequest(**con_req.model_dump())
    db.add(db_con_req)
    db.commit()
    db.refresh(db_con_req)
    return db_con_req


@router.get("/received/{user_id}", response_model=List[ConnectionRequestOut])
def get_received_requests(user_id: int, db: Session = Depends(get_db)):
    received = (
        db.query(ConnectionRequest)
        .filter(ConnectionRequest.receiver_id == user_id)
        .all()
    )
    return received


@router.get("/sent/{user_id}", response_model=List[ConnectionRequestOut])
def get_sent_requests(user_id: int, db: Session = Depends(get_db)):
    sent = (
        db.query(ConnectionRequest).filter(ConnectionRequest.sender_id == user_id).all()
    )
    return sent


@router.delete("/{request_id}")
def delete_connection_request(request_id: int, db: Session = Depends(get_db)):
    request = db.query(ConnectionRequest).filter(ConnectionRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    db.delete(request)
    db.commit()
    return {"message": "Request deleted"}
