from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    description: str


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class ProjectOut(ProjectBase):
    id: int
    owner_id: int
    owner_full_name: str

    model_config = ConfigDict(from_attributes=True)
