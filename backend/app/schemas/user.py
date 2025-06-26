from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    
    @validator('current_password')
    def validate_current_password(cls, v):
        if not v:
            raise ValueError('Current password is required')
        return v
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if not v:
            raise ValueError('New password is required')
        if len(v) < 8:
            raise ValueError('New password must be at least 8 characters long')
        return v 