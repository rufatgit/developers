from typing import Optional

from pydantic import BaseModel, ConfigDict


class NotificationBase(BaseModel):
    message: str


class NotificationCreate(NotificationBase):
    user_id: int


class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None


class NotificationOut(NotificationBase):
    id: int
    is_read: bool
    user_id: int

    model_config = ConfigDict(from_attributes=True)
