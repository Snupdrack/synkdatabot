from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# === Chat ===
class Message(BaseModel):
    role: str = Field(..., description="Role: user o assistant")
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None
    session_id: str

# === RAG Documents ===
class DocumentUpload(BaseModel):
    title: str
    content: str
    category: str = Field(default="general", description="Categoría: VentasPro, IMSS-Intel, DevOps, general")
    tags: List[str] = []

class DocumentResponse(BaseModel):
    id: str
    title: str
    category: str
    tags: List[str]
    created_at: datetime
    count: int = 0

# === Contact / Lead ===
class LeadCapture(BaseModel):
    nombre: str
    empresa: Optional[str] = None
    email: str
    telefono: Optional[str] = None
    interes: str = Field(default="Consulta general", description="Servicio de interés")
    mensaje: Optional[str] = None

class LeadResponse(BaseModel):
    success: bool
    message: str
    lead_id: Optional[str] = None

# === Stats ===
class StatsResponse(BaseModel):
    total_documents: int
    total_conversations: int
    categories: List[str]