from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    status = Column(
        String(20),
        default="Pending",
        nullable=False
    )

    # Relationships
    user = relationship(
        "User",
        back_populates="applications"
    )

    project = relationship(
        "Project",
        back_populates="applications"
    )