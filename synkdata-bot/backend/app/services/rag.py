import chromadb
from chromadb.config import Settings
from app.core.config import settings
from typing import List, Optional
import uuid

class RAGService:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=Settings(anonymized_telemetry=False)
        )
        # Collection principal
        self.collection = self.client.get_or_create_collection(
            name="synkdata_knowledge",
            metadata={"description": "Base de conocimiento de SynkData"}
        )

    def add_document(self, title: str, content: str, category: str = "general", tags: List[str] = []) -> str:
        """Agrega documento al índice"""
        doc_id = str(uuid.uuid4())

        self.collection.add(
            documents=[content],
            metadatas=[{
                "title": title,
                "category": category,
                "tags": ",".join(tags),
                "source": "upload"
            }],
            ids=[doc_id]
        )

        return doc_id

    def add_texts(self, texts: List[str], metadatas: List[dict]) -> List[str]:
        """Agrega múltiples textos con metadatos"""
        ids = [str(uuid.uuid4()) for _ in texts]

        self.collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

        return ids

    def search(self, query: str, n_results: int = 5, category: Optional[str] = None) -> dict:
        """Busca documentos relevantes"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where={"category": category} if category else None
        )

        return results

    def get_relevant_context(self, query: str, max_chars: int = 3000) -> str:
        """Obtiene contexto relevante formateado para el LLM"""
        results = self.search(query, n_results=5)

        if not results["documents"]:
            return ""

        context_parts = []
        for doc in results["documents"][0]:
            context_parts.append(doc)

        context = "\n\n".join(context_parts)
        # Limitar caracteres
        if len(context) > max_chars:
            context = context[:max_chars] + "\n\n..."

        return context

    def get_all_documents(self) -> List[dict]:
        """Obtiene todos los documentos"""
        results = self.collection.get()

        documents = []
        for i, doc_id in enumerate(results["ids"]):
            documents.append({
                "id": doc_id,
                "content": results["documents"][i],
                "metadata": results["metadatas"][i]
            })

        return documents

    def delete_document(self, doc_id: str) -> bool:
        """Elimina documento"""
        try:
            self.collection.delete(ids=[doc_id])
            return True
        except:
            return False

    def delete_collection(self) -> bool:
        """Elimina toda la collection"""
        try:
            self.client.delete_collection("synkdata_knowledge")
            return True
        except:
            return False

    def get_stats(self) -> dict:
        """Obtiene estadísticas"""
        try:
            count = self.collection.count()
            # Get unique categories
            all_docs = self.collection.get()
            categories = set()
            for meta in all_docs["metadatas"]:
                if meta and "category" in meta:
                    categories.add(meta["category"])

            return {
                "total_documents": count,
                "categories": list(categories)
            }
        except:
            return {"total_documents": 0, "categories": []}

rag_service = RAGService()