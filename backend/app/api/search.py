from fastapi import APIRouter
from typing import Dict, List
from app.schemas.search import SearchRequest, SearchResponse, SearchResult
from app.api.resumes import RESUMES, vector_store

router = APIRouter(prefix="/search", tags=["search"])

MIN_HITS = 2
RETRIEVER_K = 60

def _normalize(text: str) -> str:
    return text.lower().replace(".", "").replace(" ", "")

def _resume_by_id():
    return {r.id: r for r in RESUMES}

@router.post("", response_model=SearchResponse)
def search(req: SearchRequest):
    query = req.query.strip()
    if not query:
        return SearchResponse(results=[])

    norm_query = _normalize(query)

    retriever = vector_store.as_retriever(k=RETRIEVER_K)
    docs = retriever.invoke(query)

    counts: Dict[str, int] = {}
    for d in docs:
        rid = (d.metadata or {}).get("resume_id")
        if not rid:
            continue

        content_norm = _normalize(d.page_content)
        if norm_query not in content_norm:
            continue

        counts[rid] = counts.get(rid, 0) + 1

    related_ids = [rid for rid, c in counts.items() if c >= MIN_HITS]
    if not related_ids:
        return SearchResponse(results=[])

    related_ids.sort(key=lambda rid: counts[rid], reverse=True)

    by_id = _resume_by_id()
    results: List[SearchResult] = []

    for rid in related_ids[: req.top_k]:
        r = by_id.get(rid)
        if not r:
            continue
        results.append(SearchResult(
            id=r.id,
            name=r.name,
            uploadDate=r.uploadDate,
            status=r.status,
        ))

    return SearchResponse(results=results)
