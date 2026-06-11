from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.gemini_service import GeminiService
from typing import Dict, Any

router = APIRouter(prefix="/ai", tags=["Gemini AI Assistant"])

class AIExplanationRequest(BaseModel):
    type: str = Field(..., description="Context type: signal, forecast, portfolio", example="signal")
    data: Dict[str, Any] = Field(..., description="Data dictionary containing metrics to analyze")

@router.post("/explain", response_model=Dict[str, Any])
def generate_ai_commentary(request: AIExplanationRequest):
    if request.type not in ["signal", "forecast", "portfolio"]:
        raise HTTPException(status_code=422, detail="Type must be one of: signal, forecast, portfolio")
        
    try:
        explanation = GeminiService.generate_explanation(
            context_type=request.type,
            data=request.data
        )
        return {
            "type": request.type,
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating AI explanation: {str(e)}")
