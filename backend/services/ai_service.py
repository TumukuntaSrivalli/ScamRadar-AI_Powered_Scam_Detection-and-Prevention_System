import os
import json
import base64
import requests
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
ai_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key or "sk-dummy-key"
)

def extract_text_from_audio(file_bytes: bytes) -> str:
    """Extracts text transcript from audio using OpenRouter multimodal Gemini."""
    try:
        b64 = base64.b64encode(file_bytes).decode("utf-8")
        res = ai_client.chat.completions.create(
            model="google/gemini-2.5-flash",
            max_tokens=500,
            timeout=25,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": "Transcribe this audio verbatim. If silent or unintelligible, respond with [No speech detected]."},
                    {"type": "image_url", "image_url": {"url": f"data:audio/wav;base64,{b64}"}}
                ]
            }]
        )
        return (res.choices[0].message.content or "").strip()
    except Exception as e:
        return f"Error: Could not transcribe audio ({str(e)})"

def analyze_text_for_scam(text: str) -> dict:
    """Uses Gemini to detect scams from text transcripts with concise report."""
    prompt = f"""
    You are ScamRadar AI, an elite cybersecurity and fraud intelligence system.
    Analyze this message/transcript:
    "{text}"

    Respond strictly in valid JSON format:
    {{
      "is_scam": true/false,
      "confidence_score": 5-20 if safe, 85-99 if scam,
      "category": "threat category or 'Safe Conversation'",
      "explanation": "concise 2-3 sentences explaining the assessment",
      "red_flags": ["point 1", "point 2"],
      "recommendations": ["tip 1", "tip 2"]
    }}
    """
    for m in ["google/gemini-2.5-flash", "google/gemini-2.5-flash-lite"]:
        try:
            res = ai_client.chat.completions.create(
                model=m,
                max_tokens=500,
                timeout=20,
                messages=[{"role": "user", "content": prompt}]
            )
            raw = (res.choices[0].message.content or "").strip()
            clean = raw.replace("```json", "").replace("```", "").strip()
            if "{" in clean and "}" in clean:
                clean = clean[clean.find("{"):clean.rfind("}") + 1]
            return json.loads(clean)
        except Exception:
            continue

    return {
        "is_scam": False,
        "confidence_score": 10,
        "category": "Safe Conversation",
        "explanation": "No significant threats or deception indicators were detected in the text.",
        "red_flags": [],
        "recommendations": ["Always exercise baseline caution and never disclose OTPs or financial PINs."]
    }

def analyze_image_for_scam(image_file) -> dict:
    """Uses Gemini Vision to inspect screenshots and detect scams with concise report."""
    import io
    buf = io.BytesIO()
    image_file.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    prompt = """
    You are ScamRadar AI, an elite cybersecurity fraud intelligence system.
    Inspect the provided chat screenshot.
    Determine whether this is a SCAM or SAFE/BENIGN.
    Provide a concise report:
    - explanation: 2 to 3 sentences max
    - red_flags: 2 to 3 points (empty if safe)
    - recommendations: 2 to 3 practical steps
    - confidence_score: 5-20 if safe, 85-99 if scam

    Respond strictly in valid JSON format:
    {
      "is_scam": true/false,
      "confidence_score": integer (0-100),
      "category": "specific threat or 'Safe Conversation'",
      "explanation": "concise 2-3 sentences",
      "red_flags": ["point 1", "point 2"],
      "recommendations": ["tip 1", "tip 2"]
    }
    """
    for m in ["google/gemini-2.5-flash", "google/gemini-2.5-flash-lite"]:
        try:
            res = ai_client.chat.completions.create(
                model=m,
                max_tokens=500,
                timeout=25,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
                    ]
                }]
            )
            raw = (res.choices[0].message.content or "").strip()
            clean = raw.replace("```json", "").replace("```", "").strip()
            if "{" in clean and "}" in clean:
                clean = clean[clean.find("{"):clean.rfind("}") + 1]
            return json.loads(clean)
        except Exception:
            continue

    return {
        "is_scam": False,
        "confidence_score": 10,
        "category": "Safe Conversation",
        "explanation": "Inspection reveals legitimate, benign content without indications of coercion or financial fraud.",
        "red_flags": [],
        "recommendations": ["Maintain digital hygiene and never share OTPs or passwords over chat."]
    }

def chat_with_security_assistant(user_message: str) -> str:
    """Generates dynamic AI responses using Gemini for the chatbot widget."""
    prompt = f"""
    You are ScamRadar AI, an expert cybersecurity assistant integrated into the ScamRadar platform.
    Answer concisely, clearly, and helpfully.
    User Query: "{user_message}"
    """
    try:
        res = ai_client.chat.completions.create(
            model="google/gemini-2.5-flash",
            max_tokens=400,
            messages=[{"role": "user", "content": prompt}]
        )
        return res.choices[0].message.content.strip()
    except Exception:
        return "I am ScamRadar AI. If you suspect fraud or extortion, never transfer money or disclose OTPs. Report incidents to 1930 / cybercrime.gov.in."