from fastapi import APIRouter, UploadFile, File, HTTPException
import io
from PIL import Image
from services.ai_service import extract_text_from_audio, analyze_text_for_scam, analyze_image_for_scam

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("/audio")
async def analyze_audio_endpoint(file: UploadFile = File(...)):
    """Processes call recordings and detects scams."""
    if not file.filename.endswith(('.mp3', '.wav', '.m4a')):
        raise HTTPException(status_code=400, detail="Unsupported audio format")
    
    audio_bytes = await file.read()
    transcript = extract_text_from_audio(audio_bytes)
    
    if "Error" in transcript:
        raise HTTPException(status_code=500, detail=transcript)
        
    analysis = analyze_text_for_scam(transcript)
    return {"status": "success", "transcript": transcript, "analysis": analysis}

@router.post("/image")
async def analyze_image_endpoint(file: UploadFile = File(...)):
    """Processes WhatsApp screenshots via OCR and detects scams."""
    if not file.filename.endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Unsupported image format")
        
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    analysis = analyze_image_for_scam(image)
    return {"status": "success", "analysis": analysis}

from pydantic import BaseModel
from services.ai_service import chat_with_security_assistant # Add this import

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """Handles chat messages from the floating ScamRadar AI Assistant."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    reply = chat_with_security_assistant(request.message)
    return {"status": "success", "reply": reply}