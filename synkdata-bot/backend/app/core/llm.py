from groq import Groq
from app.core.config import settings
import json

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.llm_model

    def get_response(self, system_prompt: str, user_message: str, context: str = "") -> str:
        """
        Obtiene respuesta del modelo con context de RAG
        """
        full_prompt = f"""CONTEXTO DE SYKDATA (Información de productos y servicios):
{context}

CONVERSACIÓN ANTERIOR (para mantener memoria):
{self._get_conversation_history()}

---"""

        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": f"{full_prompt}\n\nPregunta del usuario: {user_message}"
            }
        ]

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=settings.llm_temperature,
            max_tokens=settings.llm_max_tokens
        )

        return response.choices[0].message.content

    def _get_conversation_history(self) -> str:
        """Placeholder para historial de conversación - se implementa en ConversationService"""
        return ""

llm_service = LLMService()