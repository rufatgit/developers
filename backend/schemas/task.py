from typing import Optional

from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None


class TaskCreate(TaskBase):
    assigned_to: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None


class TaskOut(TaskBase):
    id: int
    status: str
    project_id: int
    assigned_to: Optional[int] = None
    assignee_full_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
