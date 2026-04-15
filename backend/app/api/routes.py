from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import (
    ChatRequest, ChatResponse,
    DocumentUpload, DocumentResponse,
    LeadCapture, LeadResponse,
    StatsResponse
)
from app.core.llm import llm_service
from app.services.rag import rag_service
from app.services.conversation import conversation_service
from typing import List, Optional
import uuid
import os

router = APIRouter()

# === SYSTEM PROMPT para el Asistente Senior de SynkData ===
SYSTEM_PROMPT = """Eres el Asistente Senior de SynkData. Tu nombre es SynkBot.

IDENTIDAD:
- Eres el asistente virtual de SynkData, una empresa mexicana de desarrollo de software.
- Tu tagline: "Código a Medida. Inteligencia en cada Dato."
- Hablas en español de manera natural, casual pero profesional.
- Usas emojis de forma moderada y estratégica (🚀, 💡, 📊, ✅).
- NUNCA dices "Como modelo de IA" o "Mi capacidad". Hablas como humano.

PERSONALIDAD:
- Eres proactivo, te interesa ayudar genuinamente al cliente.
- Haces preguntas para entender mejor lo que necesitan.
- Explicas conceptos técnicos de forma sencilla.
- Das ejemplos concretos cuando explicas.
- Cuando dudas, prefieres ser honesto y ofrecer alternatives.

SERVICIOS QUE CONOCES:
1. VentasPro - Sistema de gestión de ventas con CRM, reportes y automatizaciones
2. Laboratorio IMSS-Intel - Integración con sistemas gubernamentales (IMSS, SAT, INFONAVIT)
3. DevOps y Migraciones - Migración Firebase→Railway, optimizaciones de infraestructura
4. Desarrollo de APIS - REST/GraphQL, integraciones con bancos, gobierno
5. Agentes de IA - Asistentes virtuales para calificación de leads y atención 24/7

DIFERENCIALES DE SYKDATA:
- 60 días de cobertura post-lanzamiento
- Expertos sénior multidisciplinarios
- Código fuente 100% entregado al cliente
- Pagos a plazos, sin presión
- Respuesta en menos de 24 horas

PROCESO DE VENTA NATURAL:
1. Primero escucha y entiende el problema
2. Pregunta detalles para dar una respuesta más precisa
3. Sugiere soluciones basadas en lo que el cliente necesita
4. Si parecen interesados, pregunta si quieren agendar una llamada o les compartes el calendario
5. Para agendar: pide nombre, email, empresa, teléfono y qué servicio les interesa

COTIZACIONES:
- MVP simple: 7-14 días
- MVP con integraciones: 14-30 días
- Sistema completo: 30-60+ días
- Siempre aclaras que son estimaciones y dependen del scope

REGLAS:
- No inventas información que no tengas
- Si no sabes algo, lo dices honestamente
- Siempre puedes derivar a contacto@synkdata.online o +52 990 295 63 52
- Mantienes un tono amigable pero profesional
- Usas frases como "¿Te parece si...?", "¿Qué te parece si...?", "Cuéntame más sobre..."

INSTRUCCIONES DE FORMATO:
- No uses listas largas con bullets
- Usa párrafos fluidos
- Máximo 2-3 oraciones por párrafo
- Saltos de línea para separar ideas principales"""

# === CHAT ENDPOINTS ===
@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Endpoint principal del chat"""
    session_id = conversation_service.get_or_create_session(request.session_id)

    # Obtener contexto de RAG
    context = rag_service.get_relevant_context(request.message)

    # Obtener respuesta del LLM
    response = llm_service.get_response(
        system_prompt=SYSTEM_PROMPT,
        user_message=request.message,
        context=context
    )

    # Guardar conversación
    conversation_service.add_message(session_id, "user", request.message)
    conversation_service.add_message(session_id, "assistant", response)

    # Obtener sources del RAG
    results = rag_service.search(request.message, n_results=3)
    sources = []
    if results and results["metadatas"]:
        for meta in results["metadatas"][0]:
            if meta and "title" in meta:
                sources.append(meta["title"])

    return ChatResponse(
        response=response,
        sources=sources if sources else None,
        session_id=session_id
    )

# === RAG ENDPOINTS ===
@router.post("/rag/documents", response_model=DocumentResponse)
async def upload_document(doc: DocumentUpload):
    """Agrega documento a la base de conocimiento"""
    doc_id = rag_service.add_document(
        title=doc.title,
        content=doc.content,
        category=doc.category,
        tags=doc.tags
    )

    return DocumentResponse(
        id=doc_id,
        title=doc.title,
        category=doc.category,
        tags=doc.tags,
        created_at=datetime.now()
    )

@router.post("/rag/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    category: str = Form("general")
):
    """Sube archivo de texto para indexar"""
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    # Split por párrafos o líneas
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    if not lines:
        raise HTTPException(status_code=400, detail="Archivo vacío o no pudo leerse")

    # Indexar cada línea o grupo de líneas
    docs = []
    current_doc = []
    for line in lines:
        if len("\n".join(current_doc) + line) > 1000:
            docs.append("\n".join(current_doc))
            current_doc = []
        current_doc.append(line)
    if current_doc:
        docs.append("\n".join(current_doc))

    metadatas = [{"title": file.filename, "category": category, "source": file.filename} for _ in docs]

    ids = rag_service.add_texts(docs, metadatas)

    return {"message": f"Indexados {len(ids)} fragmentos", "ids": ids}

@router.get("/rag/documents")
async def list_documents():
    """Lista todos los documentos"""
    docs = rag_service.get_all_documents()
    return {"documents": docs, "total": len(docs)}

@router.delete("/rag/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Elimina documento"""
    success = rag_service.delete_document(doc_id)
    return {"success": success}

@router.get("/rag/stats", response_model=StatsResponse)
async def get_stats():
    """Estadísticas de la base de conocimiento"""
    rag_stats = rag_service.get_stats()
    conv_stats = conversation_service.get_stats()

    return StatsResponse(
        total_documents=rag_stats.get("total_documents", 0),
        total_conversations=conv_stats.get("total_conversations", 0),
        categories=rag_stats.get("categories", [])
    )

# === LEAD ENDPOINTS ===
@router.post("/lead", response_model=LeadResponse)
async def capture_lead(lead: LeadCapture):
    """Captura lead al final de la conversación"""
    # Aquí podrías guardar en DB, enviar email, etc.
    lead_id = str(uuid.uuid4())

    # Log para debugging (en producción usar DB)
    print(f"NEW LEAD: {lead.nombre} | {lead.email} | {lead.interes}")

    return LeadResponse(
        success=True,
        message=f"¡Perfecto {lead.nombre}! Te contactaremos pronto. ¿Quieres agendar una llamada directamente?",
        lead_id=lead_id
    )

# === HEALTH ===
@router.get("/health")
async def health():
    return {"status": "ok", "service": "synkbot-api"}

from datetime import datetime