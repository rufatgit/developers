from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text)

    status = Column(String(20), default="Pending", nullable=False)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    project = relationship("Project", back_populates="tasks")

    assignee = relationship("User", back_populates="tasks")

    # Convenience property — None if unassigned
    @property
    def assignee_full_name(self) -> str | None:
        return self.assignee.full_name if self.assignee else None
