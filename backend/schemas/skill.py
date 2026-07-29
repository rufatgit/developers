from typing import Optional

from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    name: str
    level: str


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = None


class SkillOut(SkillBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
