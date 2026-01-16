from pydantic import BaseModel, Field
from typing import List, Literal

class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    top_k: int = 10

class SearchResult(BaseModel):
    id: str
    name: str
    uploadDate: str
    status: Literal["processing", "indexed", "failed"]

class SearchResponse(BaseModel):
    results: List[SearchResult]
