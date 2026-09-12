from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.services.ai_analyst import AIAnalystService

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Dict[str, str]]] = None

@router.post("/chat")
def chat_with_analyst(payload: ChatRequest):
    return AIAnalystService.answer_query(query=payload.query, history=payload.history)

@router.post("/analyze")
def analyze_query(payload: ChatRequest):
    return AIAnalystService.answer_query(query=payload.query, history=payload.history)

