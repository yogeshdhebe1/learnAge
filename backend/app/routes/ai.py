# from fastapi import APIRouter, HTTPException
# from app.models.schemas import AIChatRequest
# from app.services.gemini_service import GeminiService

# router = APIRouter(prefix="/api/ai", tags=["AI"])

# @router.post("/chat")
# async def chat_with_ai(chat_request: AIChatRequest):
#     """Get AI response from Gemini"""
#     try:
#         response = GeminiService.get_ai_response(
#             question=chat_request.question,
#             context=chat_request.context
#         )
        
#         return {
#             "question": chat_request.question,
#             "answer": response
#         }
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/ai", tags=["AI"])

class ChatRequest(BaseModel):
    question: str
    context: str = None

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI tutor"""
    try:
        response = GeminiService.get_ai_response(
            question=request.question,
            context=request.context
        )
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))