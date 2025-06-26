from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class UpdateSettings(BaseModel):
    username: str
    email: str 
    password: str 