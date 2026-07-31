from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class UserSkill(Base):
    """
    Join table for the many-to-many relationship between User and Skill.
    'level' lives here (not on Skill) because it's specific to each
    user-skill pairing, not to the skill itself.
    """

    __tablename__ = "user_skills"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)

    level = Column(String(50), nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
