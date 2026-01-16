from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.health import router as health_router
from app.api.resumes import router as resumes_router
from app.api.search import router as search_router
from app.api.analyze import router as analyze_router
from app.api.resumes import vector_store

logger = setup_logging(settings.log_level)

app = FastAPI(
    title=settings.app_name,
    description="API for HireSense application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(resumes_router, prefix="/api")
app.include_router(search_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    t0 = time.perf_counter()
    ok = vector_store.load("storage/faiss_index")
    dt = time.perf_counter() - t0
    logger.info(f"FAISS load ok={ok} took {dt:.2f}s")

@app.get("/")
def root():
    return JSONResponse({"message": "HireSense API is running. Go to /docs"})

@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"Shutting down {settings.app_name}")