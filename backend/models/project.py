from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..database import Base
from sqlalchemy.sql import func


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

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

    # Convenience property — reads the name through the relationship,
    # doesn't store it as a separate column
    @property
    def owner_full_name(self) -> str:
        return self.owner.full_name
