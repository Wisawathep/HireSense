from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class AnalyzeRequest(BaseModel):
    query: str = Field(min_length=1)
    resume_ids: List[str] = Field(min_length=1)
    max_items: int = 5  

class ResumeSummary(BaseModel):
    resume_id: str
    filename: str
    summary: str
    status: Literal["ok", "failed"]
    error: Optional[str] = None

class AnalyzeResponse(BaseModel):
    results: List[ResumeSummary]
