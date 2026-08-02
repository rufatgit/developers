from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
import uvicorn

# Import all models
from .models.user import User
from .models.project import Project
from .models.application import Application
from .models.review import Review
from .models.task import Task
from .models.skill import Skill
from .models.user_skill import UserSkill
from .models.notification import Notification
from .routers import (
    auth,
    users,
    projects,
    skills,
    applications,
    tasks,
    reviews,
    notifications,
)

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Developer Collaboration Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(applications.router)
app.include_router(tasks.router)
app.include_router(reviews.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"message": "Developer Collaboration Platform API is running 🚀"}


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
