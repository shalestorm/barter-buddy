from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server.db.database import SessionLocal
from server.models.connection import Connection
from server.schemas.connections import ConnectionCreate, ConnectionOut

router = APIRouter(prefix="/connections", tags=["connections"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# create a new connection


@router.post("/", response_model=ConnectionOut)
def create_connection(con: ConnectionCreate, db: Session = Depends(get_db)):
    db_connection = Connection(**con.model_dump())
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    return db_connection


# get all connections by user


@router.get("/user/{user_id}", response_model=List[ConnectionOut])
def get_user_connections(user_id: int, db: Session = Depends(get_db)):
    connections = (
        db.query(Connection)
        .filter((Connection.user_a_id == user_id) | (Connection.user_b_id == user_id))
        .all()
    )
    return connections
