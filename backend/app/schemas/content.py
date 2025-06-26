from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class NoteContentUpdate(BaseModel):
    notes: str
    bookmarkID: UUID

class ContentCreate(BaseModel):
    url: str
    title: Optional[str]
    source: Optional[str]
    email: str
    notes: Optional[str]

class TabRemover(BaseModel):
    content_id: UUID 

class DBContent(BaseModel):
    url: str
    title: Optional[str]
    source: Optional[str]


class ContentWithSummary(BaseModel):
    content_id: UUID
    title: Optional[str]
    url: str
    source: Optional[str]
    first_saved_at: datetime 
    ai_summary: Optional[str]

    class Config:
        from_attributes = True

class UserSavedContent(BaseModel):
    content_id: UUID
    url: str
    title: Optional[str]
    source: Optional[str]
    ai_summary: Optional[str]
    first_saved_at: datetime
    notes: Optional[str]
