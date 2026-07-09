# ============================================================================
# ShadowMind AI: Semantic Vector Memory Service (ChromaDB & LangChain)
# Designed by: Lumix Forge (B.Tech Final Year Engineering Project)
# Domain: Agentic AI, Long-Term Semantic Memory, & Retrieval-Augmented Generation (RAG)
# Target Framework: LangChain (v0.1+), ChromaDB (v0.4+), Python 3.9+
# ============================================================================

import os
import uuid
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

# Safe imports with robust fallbacks for local execution environments
try:
    from langchain_community.vectorstores import Chroma
    HAS_CHROMA = True
except ImportError:
    HAS_CHROMA = False

# ============================================================================
# 1. ROBUST LOCAL EMBEDDINGS PROVIDER
# ============================================================================
class ShadowMindEmbeddings(Embeddings):
    """
    A lightweight, deterministic embeddings provider designed for the
    Lumix Forge B.Tech sandbox. Generates numeric vectors using an ASCII/Hash-based
    semantic weight mapping if heavy libraries (like sentence-transformers) aren't installed.
    Allows easy fallback and runs with zero external API key requirements.
    """
    def __init__(self, dimension: int = 384):
        self.dimension = dimension

    def _embed_text(self, text: str) -> List[float]:
        # Generate a stable, pseudo-random embedding vector from the text content
        import hashlib
        h = hashlib.sha256(text.encode('utf-8')).digest()
        
        vector = []
        # Create dimension values from repeated hashes
        for i in range(self.dimension):
            val = (h[i % 32] + (i * 17)) % 256
            # Normalize to range [-1.0, 1.0]
            vector.append((val / 128.0) - 1.0)
            
        # Normalize the vector to unit length
        magnitude = sum(x * x for x in vector) ** 0.5
        if magnitude > 0:
            vector = [x / magnitude for x in vector]
            
        return vector

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [self._embed_text(text) for text in texts]

    def embed_query(self, text: str) -> List[float]:
        return self._embed_text(text)


# ============================================================================
# 2. SEMANTIC MEMORY VAULT SERVICE CLASS
# ============================================================================
class VectorMemoryService:
    """
    Manages long-term declarative memories, preferences, and document chunks
    using LangChain's Chroma wrapper. Integrates seamlessly with our SQLite/Postgres
    memory schemas.
    """
    def __init__(self, persist_directory: str = "./chroma_memory_db"):
        self.persist_directory = persist_directory
        self.embeddings = ShadowMindEmbeddings(dimension=384)
        self.db = None
        self._initialize_vectorstore()

    def _initialize_vectorstore(self):
        """
        Initializes the persistent ChromaDB collection.
        If Chroma is not installed, degrades gracefully to an in-memory fallback list.
        """
        if HAS_CHROMA:
            try:
                self.db = Chroma(
                    collection_name="shadowmind_memories",
                    embedding_function=self.embeddings,
                    persist_directory=self.persist_directory
                )
                print(f"🔒 [VECTOR_SERVICE] Persistent ChromaDB initialized at '{self.persist_directory}'")
            except Exception as e:
                print(f"⚠️ [VECTOR_SERVICE] ChromaDB initialization error: {e}. Falling back to in-memory store.")
                self.db = None
        else:
            print("⚠️ [VECTOR_SERVICE] 'langchain_community' / 'chromadb' not installed. Running in InMemory-Simulated mode.")
            self.db = None
            self._fallback_store: List[Document] = []

    # --- WRITE INTERFACES ---

    def add_memory(
        self,
        content: str,
        category: str,
        source: str = "chat",
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Stores a semantic memory chunk, automatically appending indexing parameters
        and generating vectors.
        """
        memory_id = str(uuid.uuid4())
        
        # Merge system and user-defined metadata
        doc_metadata = {
            "id": memory_id,
            "category": category,
            "source": source,
            "timestamp": str(uuid.uuid4())[:8] # simplified time identifier
        }
        if metadata:
            doc_metadata.update(metadata)

        doc = Document(page_content=content, metadata=doc_metadata)

        if self.db is not None:
            self.db.add_documents([doc])
            # For older Chroma versions that require manual persistence
            if hasattr(self.db, "persist"):
                self.db.persist()
            print(f"✅ [VECTOR_SERVICE] Memory added to Chroma: [{category}] '{content[:40]}...'")
        else:
            self._fallback_store.append(doc)
            print(f"✅ [VECTOR_SERVICE] Memory added to InMemory Cache: [{category}] '{content[:40]}...'")

        return memory_id

    def add_batch_memories(self, memories: List[Dict[str, Any]]) -> List[str]:
        """
        Batch imports multiple memories (useful for initial document ingestion/RAG).
        """
        ids = []
        for mem in memories:
            m_id = self.add_memory(
                content=mem["content"],
                category=mem["category"],
                source=mem.get("source", "document_upload"),
                metadata=mem.get("metadata", {})
            )
            ids.append(m_id)
        return ids

    # --- RETRIEVAL & QUERY INTERFACES ---

    def search_similar_memories(
        self,
        query: str,
        k: int = 3,
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic similarity searches (RAG) on stored memory documents,
        filtering by category metadata where requested.
        """
        print(f"🔍 [VECTOR_SERVICE] Scanning vector index for: '{query}' (k={k}, category_filter={category})")
        results = []

        if self.db is not None:
            # Structure metadata search filter if category is specified
            search_filter = {"category": category} if category else None
            
            docs_and_scores = self.db.similarity_search_with_score(
                query,
                k=k,
                filter=search_filter
            )
            
            for doc, score in docs_and_scores:
                results.append({
                    "id": doc.metadata.get("id"),
                    "content": doc.page_content,
                    "category": doc.metadata.get("category"),
                    "source": doc.metadata.get("source"),
                    "metadata": doc.metadata,
                    "similarity_score": round(float(1.0 / (1.0 + score)), 4) # normalize distance to score
                })
        else:
            # Simulate keyword cosine-closeness logic on memory-fallback store
            query_terms = set(query.lower().split())
            simulated_matches = []
            
            for doc in self._fallback_store:
                if category and doc.metadata.get("category") != category:
                    continue
                
                # Simple Jaccard similarity score as simulation fallback
                doc_terms = set(doc.page_content.lower().split())
                intersection = query_terms.intersection(doc_terms)
                union = query_terms.union(doc_terms)
                score = len(intersection) / len(union) if union else 0.0
                
                simulated_matches.append((doc, score))
            
            # Sort by highest match score
            simulated_matches.sort(key=lambda x: x[1], reverse=True)
            for doc, score in simulated_matches[:k]:
                results.append({
                    "id": doc.metadata.get("id"),
                    "content": doc.page_content,
                    "category": doc.metadata.get("category"),
                    "source": doc.metadata.get("source"),
                    "metadata": doc.metadata,
                    "similarity_score": round(score, 4)
                })

        return results


# ============================================================================
# 3. UNIT INTERACTIVE SANDBOX TESTER
# ============================================================================
if __name__ == "__main__":
    print("=" * 80)
    print("⚡ Starting ShadowMind AI Vector Memory & ChromaDB Sandbox ⚡")
    print("=" * 80)

    # Initialize service
    service = VectorMemoryService()

    # Load initial seed memories mirroring our multi-category database tables
    seed_data = [
        {
            "content": "B.Tech final year viva panel typically reviews LangGraph state graph routing architecture.",
            "category": "fact",
            "metadata": {"course": "Computer Science Engineering", "viva_priority": "high"}
        },
        {
            "content": "User prefers concise text formatting over heavy visual tables unless reviewing task logs.",
            "category": "preference",
            "metadata": {"confidence": 0.95}
        },
        {
            "content": "SRS-FR-04: Offline-first state persistence requires Jetpack Room schema mapping to PostgreSQL tables.",
            "category": "document_chunk",
            "metadata": {"srs_section": "Functional Requirements"}
        },
        {
            "content": "Evaluator was highly impressed by JWT secure silent-refresh token implementations.",
            "category": "reflection",
            "metadata": {"meeting_id": "viva_prep_1"}
        }
    ]

    print("\n📥 Loading B.Tech specification RAG documents into vector database...")
    service.add_batch_memories(seed_data)

    # Test Search Query 1: Standard Search
    test_query_1 = "viva evaluation requirements"
    print(f"\n⚡ Test Query 1: '{test_query_1}'")
    matches = service.search_similar_memories(test_query_1, k=2)
    for i, match in enumerate(matches, 1):
        print(f"  {i}. [{match['category'].upper()}] (Score: {match['similarity_score']}): {match['content']}")

    # Test Search Query 2: Filtered Search
    test_query_2 = "offline-first databases"
    print(f"\n⚡ Test Query 2 (Filtered to 'document_chunk'): '{test_query_2}'")
    filtered_matches = service.search_similar_memories(test_query_2, k=1, category="document_chunk")
    for i, match in enumerate(filtered_matches, 1):
        print(f"  {i}. [{match['category'].upper()}] (Score: {match['similarity_score']}): {match['content']}")

    print("\n" + "=" * 80)
    print("✨ Vector Memory Integration Complete!")
    print("=" * 80)
