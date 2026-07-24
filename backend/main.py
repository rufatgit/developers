from fastapi import FastAPI
from database import Base, engine

# Import all models
from models.user import User
from models.project import Project
from models.application import Application
from models.review import Review
from models.task import Task
from models.skill import Skill
from models.notification import Notification

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Developer Collaboration Platform")


@app.get("/")
def root():
    return {"message": "Developer Collaboration Platform API is running 🚀"}