from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentBase(BaseModel):
    filename: str
    content: str

class DocumentCreate(DocumentBase):
    file_path: str

class DocumentResponse(DocumentBase):
    id: int
    upload_date: datetime

    class Config:
        from_attributes = True

class Document(DocumentResponse):
    file_path: str
    user_id: int

    class Config:
        from_attributes = True

class DocumentList(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_size: int
    page_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class SearchResult(BaseModel):
    id: int
    filename: str
    original_filename: str
    excerpt: str
    relevance_score: float 