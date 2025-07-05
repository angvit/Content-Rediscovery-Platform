from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    created_at: datetime = None  # Optional: you can default this to now on the server-side

class UserGoogleCreate(BaseModel):
    username: str
    email: str
    google_id: str

class UserSignIn(BaseModel):
    username: str
    password: str

class UserGoogleSignIn(BaseModel):
    google_id: str
