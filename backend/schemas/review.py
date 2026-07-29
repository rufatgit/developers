from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    reviewee_id: int
    project_id: int


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(ReviewBase):
    id: int
    reviewer_id: int
    reviewee_id: int
    project_id: int

    model_config = ConfigDict(from_attributes=True)
