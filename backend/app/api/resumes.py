from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import List, Dict
import uuid
import os

from app.schemas.resume import ResumeUploadResponse, ResumeListItem
from app.utils.file_handler import save_upload_file
from app.services.parsing.pdf_parser import PDFResumeParser
from app.services.chunking.chunker import ResumeChunker
from app.services.vector_store.faiss_store import ResumeVectorStore

router = APIRouter(prefix="/resumes", tags=["resumes"])

RESUMES: List[ResumeListItem] = []
FILE_PATHS: Dict[str, str] = {}
parser = PDFResumeParser()
chunker = ResumeChunker()
vector_store = ResumeVectorStore()

def rebuild_vector_index():
    vector_store.reset()  

    for r in RESUMES:
        rid = r.id
        path = FILE_PATHS.get(rid)
        if not path or not os.path.exists(path):
            continue

        text = parser.parse(path)
        chunks = chunker.chunk(text)
        documents = chunker.chunks_to_documents(chunks)

        for d in documents:
            d.metadata = {**(d.metadata or {}), "resume_id": rid, "filename": r.name}

        vector_store.add_documents(documents)

@router.get("", response_model=List[ResumeListItem])
def list_resumes():
    return RESUMES

@router.post("/upload", response_model=ResumeUploadResponse)
def upload_resume(file: UploadFile = File(...)):
    # Add to list as processing
    resume_id = str(uuid.uuid4())
    today = datetime.now().date().isoformat()

    RESUMES.insert(
        0,
        ResumeListItem(
            id=resume_id,
            name=file.filename,
            uploadDate=today,
            status="processing",
        )
    )

    file_path = save_upload_file(file)
    FILE_PATHS[resume_id] = file_path
    text = parser.parse(file_path)
    chunks = chunker.chunk(text)
    documents = chunker.chunks_to_documents(chunks)

    for d in documents:
        d.metadata = {**(d.metadata or {}), "resume_id": resume_id, "filename": file.filename}
    
    vector_store.add_documents(documents)
    vector_store.save("storage/faiss_index")

    for i, r in enumerate(RESUMES):
        if r.id == resume_id:
            RESUMES[i] = ResumeListItem(
                id = r.id,
                name = r.name,
                uploadDate = r.uploadDate,
                status = "indexed"
            )
            break

    return ResumeUploadResponse(
        filename=file.filename,
        text_length=len(text),
        status="Successfully Uploaded Resume!"
    )

@router.delete("/{resume_id}")
def delete_resume(resume_id: str):
    idx = next((i for i, r in enumerate(RESUMES) if r.id == resume_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Resume not found")

    path = FILE_PATHS.pop(resume_id, None)
    if path and os.path.exists(path):
        os.remove(path)

    deleted = RESUMES.pop(idx)
    rebuild_vector_index()

    return JSONResponse({
        "status": "ok",
        "deleted_resume_id": resume_id,
        "deleted_filename": deleted.name
    })