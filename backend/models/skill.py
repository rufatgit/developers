from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), unique=True, nullable=False)

    # Users who have this skill (through the user_skills join table)
    user_skills = relationship(
        "UserSkill", back_populates="skill", cascade="all, delete-orphan"
    )
