from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # ========================
    # Relationships
    # ========================

    # Project owner
    owner = relationship("User", back_populates="projects")

    # Applications for this project
    applications = relationship(
        "Application", back_populates="project", cascade="all, delete-orphan"
    )

    # Reviews for this project
    reviews = relationship(
        "Review", back_populates="project", cascade="all, delete-orphan"
    )

    # Tasks under this project
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
