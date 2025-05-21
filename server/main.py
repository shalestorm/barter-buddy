from fastapi import FastAPI
from server.db.database import engine, Base
from server.routers import users, skills, connections


app = FastAPI()
Base.metadata.create_all(bind=engine)


app.include_router(users.router)
app.include_router(skills.router)
app.include_router(connections.router)
