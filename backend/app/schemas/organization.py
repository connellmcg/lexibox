from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .user import UserResponse

class OrganizationBase(BaseModel):
    name: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationResponse(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class UserInvitationBase(BaseModel):
    email: EmailStr
    organization_id: int

class UserInvitationCreate(UserInvitationBase):
    invited_by_user_id: int

class UserInvitationResponse(UserInvitationBase):
    id: int
    accepted: bool
    created_at: datetime
    accepted_at: Optional[datetime] = None

    class Config:
        from_attributes = True 