import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.services.parsing.pdf_parser import PDFResumeParser
from app.services.chunking.chunker import ResumeChunker
from app.services.vector_store.faiss_store import ResumeVectorStore
from app.services.rag.rag_chain import ResumeRAGAgent

parser = PDFResumeParser()
chunker = ResumeChunker()
vector_store = ResumeVectorStore()

text = parser.parse("D:\\CODESTATION\\HireSense\\backend\\app\\sample_resume.pdf")
chunks = chunker.chunk(text)
documents = chunker.chunks_to_documents(chunks)
vector_store.add_documents(documents)

rag = ResumeRAGAgent(vector_store)
query = "Experience with AngularJS."
response = rag.run(query)
print("Response:", response["answer"])