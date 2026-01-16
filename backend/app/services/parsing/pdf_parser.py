import pdfplumber
from typing import Optional

class PDFResumeParser:
    def __init__(self, min_line_length: int = 2):
        self.min_line_length = min_line_length

    def parse(self, file_path: str) -> str:
        extracted_text = []

        with pdfplumber.open(file_path) as pdf:
            for page_number, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()

                if not text:
                    continue

                lines = text.split("\n")
                cleaned_lines = self._clean_lines(lines)
                extracted_text.append("\n".join(cleaned_lines))
        return "\n\n".join(extracted_text)
    
    def parse_with_metadata(self, file_path: str) -> dict:
        pages = []

        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                pages.append({
                    "page": i + 1,
                    "text": text
                })

        return {
            "file_name": file_path.split("/")[-1],
            "pages": pages
        }

    def _clean_lines(self, lines: list[str]) -> list[str]:
        cleaned = []

        for line in lines:
            line = line.strip()

            if len(line) < self.min_line_length:
                continue

            cleaned.append(line)
        return cleaned
