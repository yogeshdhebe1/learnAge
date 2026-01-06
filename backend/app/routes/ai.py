from fastapi import APIRouter, HTTPException
from app.models.schemas import AIChatRequest
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/api/ai", tags=["AI"])

@router.post("/chat")
async def chat_with_ai(chat_request: AIChatRequest):
    """Get AI response from Gemini"""
    try:
        response = GeminiService.get_ai_response(
            question=chat_request.question,
            context=chat_request.context
        )
        
        return {
            "question": chat_request.question,
            "answer": response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
