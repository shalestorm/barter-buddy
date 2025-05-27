from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from server.db.database import engine, Base
from server.routes import (
    users,
    skills,
    connections,
    auth_routes,
    messages,
    categories,
    connection_requests,
    user_skills,
)
import os


app = FastAPI()

Base.metadata.create_all(bind=engine)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(skills.router)
app.include_router(connections.router)
app.include_router(auth_routes.router)
app.include_router(messages.router)
app.include_router(categories.router)
app.include_router(connection_requests.router)
app.include_router(user_skills.router)


@app.get("/")
def root():
    return {"message": "you finally made it"}
