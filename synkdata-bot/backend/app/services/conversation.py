from typing import Dict, List
from datetime import datetime
import uuid
import json
import os

class ConversationService:
    """Maneja memoria de conversaciones por sesión"""

    def __init__(self, storage_path: str = "./conversations"):
        self.storage_path = storage_path
        os.makedirs(storage_path, exist_ok=True)

    def get_session_path(self, session_id: str) -> str:
        return f"{self.storage_path}/{session_id}.json"

    def get_or_create_session(self, session_id: str = None) -> str:
        if not session_id:
            session_id = str(uuid.uuid4())
        return session_id

    def add_message(self, session_id: str, role: str, content: str):
        """Agrega mensaje a la sesión"""
        filepath = self.get_session_path(session_id)

        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                conversation = json.load(f)
        else:
            conversation = {"messages": [], "created_at": datetime.now().isoformat()}

        conversation["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(conversation, f, ensure_ascii=False, indent=2)

    def get_conversation(self, session_id: str, max_messages: int = 10) -> str:
        """Obtiene historial formateado para contexto"""
        filepath = self.get_session_path(session_id)

        if not os.path.exists(filepath):
            return ""

        with open(filepath, "r", encoding="utf-8") as f:
            conversation = json.load(f)

        messages = conversation["messages"][-max_messages:]

        history = []
        for msg in messages:
            role_label = "Usuario" if msg["role"] == "user" else "Asistente"
            history.append(f"{role_label}: {msg['content']}")

        return "\n".join(history)

    def get_stats(self) -> dict:
        """Estadísticas de conversaciones"""
        if not os.path.exists(self.storage_path):
            return {"total_conversations": 0}

        files = [f for f in os.listdir(self.storage_path) if f.endswith(".json")]
        return {"total_conversations": len(files)}

conversation_service = ConversationService()