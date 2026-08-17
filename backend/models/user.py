from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, index=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

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

    # User owns many projects
    projects = relationship(
        "Project", back_populates="owner", cascade="all, delete-orphan"
    )

    # User can apply to many projects
    applications = relationship(
        "Application", back_populates="user", cascade="all, delete-orphan"
    )

    # Reviews written by this user
    reviews_given = relationship(
        "Review",
        foreign_keys="Review.reviewer_id",
        back_populates="reviewer",
        cascade="all, delete-orphan",
    )

    # Reviews received by this user
    reviews_received = relationship(
        "Review",
        foreign_keys="Review.reviewee_id",
        back_populates="reviewee",
        cascade="all, delete-orphan",
    )

    # Tasks assigned to this user
    tasks = relationship("Task", back_populates="assignee")

    # Skills of this user (through the user_skills join table)
    user_skills = relationship(
        "UserSkill", back_populates="user", cascade="all, delete-orphan"
    )

    # Notifications for this user
    notifications = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )
