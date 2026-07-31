from typing import Optional

from pydantic import BaseModel, ConfigDict

from .skill import SkillOut


class UserSkillBase(BaseModel):
    level: str


class UserSkillCreate(UserSkillBase):
    skill_id: int


class UserSkillUpdate(BaseModel):
    level: Optional[str] = None


class UserSkillOut(UserSkillBase):
    user_id: int
    skill_id: int
    skill: SkillOut

    model_config = ConfigDict(from_attributes=True)
