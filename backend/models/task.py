from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text)

    status = Column(String(20), default="Pending", nullable=False)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    project = relationship("Project", back_populates="tasks")

    assignee = relationship("User", back_populates="tasks")
