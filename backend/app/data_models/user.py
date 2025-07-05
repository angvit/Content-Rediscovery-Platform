from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default="NOW()")
    username = Column(String,  nullable=False)
    password = Column(String, nullable=False)
    google_id = Column(String, nullable=True)



# class UserCreate(BaseModel):
#     email: EmailStr  # email field is validated as a proper email format
#     created_at: datetime = None  # Optional: you can default this to now on the server-side

#     class Config:
#         orm_mode = True