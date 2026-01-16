from pydantic import BaseModel
from typing import Literal, Optional
from datetime import date

class ResumeUploadResponse(BaseModel):
    filename: str
    text_length: int
    status: str

class ResumeListItem(BaseModel):
    id: str
    name: str
    uploadDate: str
    status: Literal["processing", "indexed", "failed"]
