from typing import Dict, List, Any, Optional
from openai import OpenAI
import os

class RAGEngine:
    def __init__(self, retriever):
        """Initialize the RAG engine with the code retriever"""
        self.retriever = retriever
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def answer_query(self, query: str, file_path: Optional[str] = None, top_k: int = 5) -> Dict[str, Any]:
        """Answer a query about the codebase using RAG"""
        # Retrieve relevant code chunks
        chunks = self.retriever.retrieve(query, top_k=top_k, file_path=file_path)

        # Format chunks for prompt context
        context = self._format_context(chunks)

        # Create prompt and get completion
        prompt = f"""You are an expert software engineer assistant. You are given code context retrieved from a codebase and a developer query.
Use the code context to answer the question accurately and concisely.

Code Context:
{context}

Question:
{query}

Answer:"""

        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are an expert code assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1000
        )

        # Format and return the result
        answer = response.choices[0].message.content
        references = [{
            "file_path": chunk["file_path"],
            "line_start": chunk["line_start"],
            "line_end": chunk["line_end"],
            "code_snippet": chunk["code"][:100] + "..." if len(chunk["code"]) > 100 else chunk["code"]
        } for chunk in chunks]

        return {
            "answer": answer,
            "references": references
        }

    def _format_context(self, chunks: List[Dict[str, Any]]) -> str:
        """Format code chunks for context"""
        formatted = ""
        for i, chunk in enumerate(chunks):
            formatted += f"[{i+1}] {chunk['file_path']} (lines {chunk['line_start']}-{chunk['line_end']}):\n"
            formatted += f"```\n{chunk['code']}\n```\n\n"
        return formatted

    def generate_documentation(self, file_path: str) -> Dict[str, Any]:
        """Generate documentation for a file"""
        chunks = self.retriever.retrieve("", top_k=20, file_path=file_path)

        full_code = ""
        for chunk in sorted(chunks, key=lambda x: x["line_start"]):
            full_code += chunk["code"] + "\n"

        prompt = f"""Generate comprehensive documentation for the following code file:

{full_code}

Provide:
1. A high-level overview
2. Core functionality description
3. Important functions/classes with their purposes
4. Dependencies and relationships
5. Usage examples

Format your response in markdown."""

        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are an expert code documentation generator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=2000
        )

        return {
            "file_path": file_path,
            "documentation": response.choices[0].message.content
        }

    def suggest_refactoring(self, file_path: str) -> Dict[str, Any]:
        """Suggest code refactoring improvements"""
        chunks = self.retriever.retrieve("", top_k=20, file_path=file_path)

        full_code = ""
        for chunk in sorted(chunks, key=lambda x: x["line_start"]):
            full_code += chunk["code"] + "\n"

        prompt = f"""Analyze the following code and suggest refactoring improvements:

{full_code}

Focus on:
1. Code quality and readability
2. Performance optimizations
3. Design patterns
4. Error handling
5. Maintainability

Provide specific code examples for your suggestions."""

        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=2000
        )

        return {
            "file_path": file_path,
            "refactoring_suggestions": response.choices[0].message.content
        }
