from typing import Optional

from pydantic import BaseModel, ConfigDict


class ApplicationBase(BaseModel):
    project_id: int


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    user_id: int
    project_id: int
    status: str
    applicant_full_name: str

    model_config = ConfigDict(from_attributes=True)
