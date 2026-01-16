from app.services.vector_store.faiss_store import ResumeVectorStore

def main():
    vs = ResumeVectorStore()
    ok = vs.load("storage/faiss_index")
    if not ok or vs.store is None:
        print("Vector store is empty (no saved index). Upload resumes first.")
        return

    retriever = vs.as_retriever(k=3)
    docs = retriever.invoke("AngularJS")
    print("FOUND:", len(docs))
    for d in docs:
        md = d.metadata or {}
        print("-", md.get("filename"), md.get("resume_id"))

if __name__ == "__main__":
    main()
