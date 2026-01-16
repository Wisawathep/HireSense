from langchain_community.vectorstores import FAISS
from app.services.embedding.embeddings import get_embedding_model
from typing import List
from langchain_core.documents import Document
import numpy as np
from pathlib import Path

class ResumeVectorStore:
    def __init__(self):
        self.embedding = get_embedding_model()
        self.store = None

    def add_documents(self, documents: List[Document]):
        if self.store is None:
            self.store = FAISS.from_documents(documents, self.embedding)
        else:
            self.store.add_documents(documents)

    def as_retriever(self, k: int = 5):
        return self.store.as_retriever(
            search_kwargs={"k": k}
        )

    def show_info(self):
        if self.store:
            print(f"Number of vectors in store: {self.store.index.ntotal}")
            print(f"Vector dimension: {self.store.index.d}")
            print("List of vectors in store:")
            print("No.\tVector")
            for i in range(self.store.index.ntotal):
                print(f"{i + 1}\t{self.store.index.reconstruct(i)}")
        else:
            print("The vector store is empty.")

    def reset(self):
        self.store = None

    def save(self, dir_path: str):
        if self.store is None:
            return
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        self.store.save_local(dir_path)

    def load(self, dir_path: str):
        p = Path(dir_path)
        if not p.exists():
            return False

        self.store = FAISS.load_local(
            dir_path,
            self.embedding,
            allow_dangerous_deserialization=True,
        )
        return True