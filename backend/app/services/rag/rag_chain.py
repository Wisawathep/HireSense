from typing import List, Optional, Any

from langchain.agents import AgentState, create_agent
from langchain.agents.middleware import before_model, after_model
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage

from app.services.llm.provider import get_llm
from app.services.vector_store.faiss_store import ResumeVectorStore


class ResumeRAGState(AgentState):
    input: str
    messages: List[Any]
    context: List[Document]
    resume_id: Optional[str] = None 
    answer: Optional[str] = None


def retrieval_middleware(retriever):
    @before_model
    def retrieve(state: ResumeRAGState, runtime):
        documents = retriever.invoke(state["input"])

        rid = state.get("resume_id")
        if rid:
            documents = [
                d for d in documents
                if (d.metadata or {}).get("resume_id") == rid
            ]

        state["context"] = documents

        context_text = "\n\n".join(
            f"- {doc.page_content}" for doc in documents[:12]
        )

        system_message = SystemMessage(
            content=(
                "You are an expert AI HR assistant specializing in technical acquisition.\n"
                "Use ONLY the provided Resume Context. Do not invent facts.\n"
                "If the context does not contain the answer, say you don't know.\n\n"
                "Instructions:\n"
                "1) Identify the candidate's name (if present).\n"
                "2) Identify matching skills related to the requirement.\n"
                "3) Highlight relevant experience.\n"
                "4) Point out any gaps or risks.\n"
                "5) Give concise, professional feedback.\n\n"
                "Resume Context:\n"
                f"{context_text}"
            )
        )

        state["messages"].insert(0, system_message)
        return state

    return retrieve


@after_model
def collect_answer(state: ResumeRAGState, runtime):
    state["answer"] = state["messages"][-1].content
    return state


PROMPT = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="messages")
])


class ResumeRAGAgent:
    def __init__(self, vectorstore: ResumeVectorStore):
        if vectorstore.store is None:
            raise RuntimeError("Vector store is empty. Cannot create RAG Agent.")
        
        base_llm = get_llm()
        self.retriever = vectorstore.as_retriever(k=40)  

        self.agent = create_agent(
            model=PROMPT | base_llm,
            state_schema=ResumeRAGState,
            middleware=[
                retrieval_middleware(self.retriever),
                collect_answer
            ]
        )

    def run(self, query: str, resume_id: Optional[str] = None) -> dict:
        state = self.agent.invoke({
            "input": query,
            "resume_id": resume_id, 
            "messages": [
                HumanMessage(content=query)
            ]
        })

        return {
            "answer": state["answer"],
            "context": [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata
                }
                for doc in state["context"]
            ]
        }
