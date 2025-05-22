from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.db.database import engine, Base
from server.routes import users, skills, connections, auth_routes, messages, categories, connection_requests, user_skills


app = FastAPI()
Base.metadata.create_all(bind=engine)

ORIGINS = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
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
