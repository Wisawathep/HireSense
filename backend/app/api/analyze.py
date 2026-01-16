from fastapi import APIRouter
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse, ResumeSummary
from app.services.rag.rag_chain import ResumeRAGAgent
from app.api.resumes import vector_store, RESUMES

router = APIRouter(prefix="/analyze", tags=["analyze"])

rag_agent: ResumeRAGAgent | None = None

def get_rag_agent() -> ResumeRAGAgent:
    global rag_agent
    if rag_agent is None:
        rag_agent = ResumeRAGAgent(vector_store)
    return rag_agent

def _get_filename(resume_id: str) -> str:
    for r in RESUMES:
        if r.id == resume_id:
            return r.name
    return resume_id

@router.post("", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    results = []
    resume_ids = req.resume_ids[: req.max_items]
    rag_agent = get_rag_agent()
    
    for rid in resume_ids:
        try:
            query = (
                f"Job requirement / keyword:\n{req.query}\n\n"
                "Please analyze this candidate based on the resume context. "
                "Return concise HR screening summary in Thai."
            )

            resp = rag_agent.run(query, resume_id=rid)

            results.append(ResumeSummary(
                resume_id=rid,
                filename=_get_filename(rid),
                summary=resp.get("answer") or "",
                status="ok"
            ))

        except Exception as e:
            results.append(ResumeSummary(
                resume_id=rid,
                filename=_get_filename(rid),
                summary="",
                status="failed",
                error=str(e)
            ))

    return AnalyzeResponse(results=results)
