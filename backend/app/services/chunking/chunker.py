import re
from typing import List, Dict, Optional
from langchain_core.documents import Document

class ResumeChunker:
    SECTION_MAP = {
        "summary": [
            "summary",
            "professional summary",
            "profile",
            "about me"
        ],
        "skills": [
            "skills",
            "skill",
            "technical skills",
            "core competencies",
            "tech stack"
        ],
        "experience": [
            "experience",
            "experiences",
            "work experience",
            "professional experience",
            "employment history",
            "career highlights"
        ],
        "education": [
            "education",
            "educations",
            "educational background",
            "academic background"
        ],
        "projects": [
            "projects",
            "project",
            "personal projects",
            "selected projects"
        ],
        "certifications": [
            "certifications",
            "certification",
            "credentials",
            "licenses"
        ],
        "achievements": [
            "achievements",
            "achievement",
            "awards",
            "award",
            "honors"
        ]
    }

    def chunk(self, text: str) -> List[Dict]:
        chunks = []
        current_section = "general"
        buffer = []

        lines = text.split("\n")

        for line in lines:
            line_clean = line.strip()
            if not line_clean:
                continue

            section = self._match_section(line_clean)
            if section:
                if buffer:
                    chunks.append(self._build_chunk(current_section, buffer))
                    buffer = []

                current_section = section
            else:
                buffer.append(line_clean)

        if buffer:
            chunks.append(self._build_chunk(current_section, buffer))

        return chunks

    def _match_section(self, line: str) -> Optional[str]:
        line_norm = line.lower().strip()

        for section, keywords in self.SECTION_MAP.items():
            for kw in keywords:
                if line_norm == kw or line_norm.startswith(kw):
                    return section

        if self._looks_like_header(line):
            return "unknown_section"

        return None

    def _looks_like_header(self, line: str) -> bool:
        """
        Heuristic-based section detection
        """

        if not line.isupper():
            return False

        if len(line.split()) > 4:
            return False

        if re.search(r"[0-9•\-–—]", line):
            return False

        return True

    def _build_chunk(self, section: str, lines: List[str]) -> Dict:
        content = " ".join(lines)

        return {
            "section": section,
            "content": content,
            "length": len(content.split())
        }

    def chunks_to_documents(resume_id, chunks):
        return [
            Document(
                page_content=c["content"],
                metadata={
                    "resume_id": resume_id,
                    "section": c["section"]
                }
            )
            for c in chunks
        ]