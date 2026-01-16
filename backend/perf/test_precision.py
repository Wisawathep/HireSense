from app.services.vector_store.faiss_store import ResumeVectorStore

def main():
    vs = ResumeVectorStore()

    ok = vs.load("storage/faiss_index")
    if not ok or vs.store is None:
        print("Vector store is empty. Make sure you uploaded resumes and index was saved to storage/faiss_index.")
        return

    retriever = vs.as_retriever(k=5)
    tests = [
        ("AngularJS", {"frontend.pdf"}),
        ("editing", {"photographer.pdf"}),
        ("Software", {"software_eng.pdf", "software_dev"}),
    ]

    total = 0
    correct = 0

    for query, expected_files in tests:
        docs = retriever.invoke(query)
        retrieved_files = []
        for d in docs:
            md = d.metadata or {}
            fn = md.get("filename")
            if fn:
                retrieved_files.append(fn)

        top_files = list(dict.fromkeys(retrieved_files))[:5]

        hit = any(f in expected_files for f in top_files)

        total += 1
        correct += 1 if hit else 0

        print(f"\nQuery: {query}")
        print("Top files:", top_files)
        print("Expected:", list(expected_files))
        print("Hit:", hit)

    precision_at_5 = correct / total if total else 0
    print("\n====================")
    print(f"Precision@5 (hit-rate style): {precision_at_5:.3f}")
    print("====================\n")

if __name__ == "__main__":
    main()
