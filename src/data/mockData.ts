import { FileItem } from '../context/AppContext';

export const mockCodebase: FileItem[] = [
  {
    id: 'src',
    name: 'src',
    path: 'src',
    type: 'directory',
    children: [
      {
        id: 'retriever.py',
        name: 'retriever.py',
        path: 'src/retriever.py',
        type: 'file',
        language: 'python',
        content: `from typing import List, Dict, Any, Optional
import qdrant_client
from qdrant_client.http import models
from openai import OpenAI
import os

class CodeRetriever:
    def __init__(self):
        """Initialize the code retriever with vector database connection"""
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Connect to Qdrant
        self.qdrant = qdrant_client.QdrantClient(
            url=os.getenv("QDRANT_URL", "localhost"),
            port=6333,
            api_key=os.getenv("QDRANT_API_KEY", "")
        )
        
        # Ensure collection exists
        self._create_collection_if_not_exists()
    
    def _create_collection_if_not_exists(self):
        """Create vector collection if it doesn't exist"""
        collections = self.qdrant.get_collections().collections
        collection_names = [collection.name for collection in collections]
        
        if "code_chunks" not in collection_names:
            self.qdrant.create_collection(
                collection_name="code_chunks",
                vectors_config=models.VectorParams(
                    size=1536,  # OpenAI embedding size
                    distance=models.Distance.COSINE
                )
            )
    
    def retrieve(self, query: str, top_k: int = 5, file_path: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve relevant code chunks for the given query"""
        response = self.client.embeddings.create(
            model="text-embedding-3-small",
            input=query
        )
        query_embedding = response.data[0].embedding
        
        filter_condition = None
        if file_path:
            filter_condition = models.Filter(
                must=[
                    models.FieldCondition(
                        key="file_path",
                        match=models.MatchValue(value=file_path)
                    )
                ]
            )
        
        search_result = self.qdrant.search(
            collection_name="code_chunks",
            query_vector=query_embedding,
            query_filter=filter_condition,
            limit=top_k
        )
        
        results = []
        for scored_point in search_result:
            results.append({
                "id": scored_point.id,
                "score": scored_point.score,
                "file_path": scored_point.payload["file_path"],
                "code": scored_point.payload["code"],
                "line_start": scored_point.payload["line_start"],
                "line_end": scored_point.payload["line_end"],
                "type": scored_point.payload["type"],
            })
            
        return results
        
    def list_files(self) -> List[str]:
        return [
            "src/app.py",
            "src/retriever.py",
            "src/rag_engine.py"
        ]
        
    def hybrid_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        vector_results = self.retrieve(query, top_k=top_k*2)
        return vector_results[:top_k]
`
      },
      {
  id: 'rag_engine.py',
  name: 'rag_engine.py',
  path: 'src/rag_engine.py',
  type: 'file',
  language: 'python',
  content: `from typing import Dict, List, Any, Optional
from openai import OpenAI
import os

class RAGEngine:
    def __init__(self, retriever):
        """Initialize the RAG engine with the code retriever"""
        self.retriever = retriever
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def answer_query(self, query: str, file_path: Optional[str] = None, top_k: int = 5) -> Dict[str, Any]:
        """Answer a query about the codebase using RAG"""
        chunks = self.retriever.retrieve(query, top_k=top_k, file_path=file_path)
        context = self._format_context(chunks)
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
            formatted += f"[{i+1}] {chunk['file_path']} (lines {chunk['line_start']}-{chunk['line_end']}):\\n"
            formatted += f"\\n{chunk['code']}\\n\\n"
        return formatted

    def generate_documentation(self, file_path: str) -> Dict[str, Any]:
        chunks = self.retriever.retrieve("", top_k=20, file_path=file_path)
        full_code = ""
        for chunk in sorted(chunks, key=lambda x: x["line_start"]):
            full_code += chunk["code"] + "\\n"

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
        chunks = self.retriever.retrieve("", top_k=20, file_path=file_path)
        full_code = ""
        for chunk in sorted(chunks, key=lambda x: x["line_start"]):
            full_code += chunk["code"] + "\\n"

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
`
}
,



      {
        id: 'app.py',
        name: 'app.py',
        path: 'src/app.py',
        type: 'file',
        language: 'python',
        content: `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from retriever import CodeRetriever
from rag_engine import RAGEngine

app = FastAPI(title="Code Understanding API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
retriever = CodeRetriever()
rag_engine = RAGEngine(retriever)

class QueryRequest(BaseModel):
    query: str
    file_path: Optional[str] = None
    top_k: int = 5

class QueryResponse(BaseModel):
    answer: str
    references: List[dict]

@app.post("/query", response_model=QueryResponse)
async def query_code(request: QueryRequest):
    """Query the codebase with natural language"""
    try:
        result = rag_engine.answer_query(
            query=request.query,
            file_path=request.file_path,
            top_k=request.top_k
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/files")
async def list_files():
    """List all files in the codebase"""
    return {"files": retriever.list_files()}

@app.get("/docs/{file_path:path}")
async def generate_docs(file_path: str):
    """Generate documentation for a specific file"""
    try:
        docs = rag_engine.generate_documentation(file_path)
        return {"documentation": docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/refactor/{file_path:path}")
async def suggest_refactoring(file_path: str):
    """Get refactoring suggestions for a file"""
    try:
        suggestions = rag_engine.suggest_refactoring(file_path)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)`
      }
    ]
  }
];