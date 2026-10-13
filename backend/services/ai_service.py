import os
import json
import requests
from google import genai # The new SDK
from dotenv import load_dotenv

load_dotenv()

# Initialize the new unified Client
# It automatically picks up GEMINI_API_KEY from your .env file
client = genai.Client()

# Hugging Face config stays exactly the same
HF_API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo"
HF_HEADERS = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}

def extract_text_from_audio(file_bytes: bytes) -> str:
    """Sends audio to Hugging Face and returns text."""
    response = requests.post(HF_API_URL, headers=HF_HEADERS, data=file_bytes)
    if response.status_code != 200:
        return "Error: Could not transcribe audio. Ensure HF_API_KEY is correct."
    return response.json().get("text", "")

def analyze_text_for_scam(text: str) -> dict:
    """Uses Gemini to detect scams from text transcripts."""
    prompt = f"""
    You are ScamRadar, a cybersecurity AI. Analyze this text for scams:
    "{text}"
    Respond strictly in valid JSON format:
    {{"is_scam": true/false, "confidence_score": 0-100, "category": "phishing/financial/etc", "recommendations": ["tip1", "tip2"]}}
    """
    
    # New syntax for generation
    response = client.models.generate_content(
        model='gemini-2.5-flash', # Upgraded to the newer, faster 2.5 flash model
        contents=prompt
    )
    
    clean_text = response.text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean_text)

def analyze_image_for_scam(image_file) -> dict:
    """Uses Gemini Vision to read WhatsApp screenshots and detect scams."""
    prompt = """
    Read the text in this screenshot (likely a WhatsApp message). 
    Identify if it is a scam.
    Respond strictly in valid JSON format:
    {"is_scam": true/false, "confidence_score": 0-100, "category": "phishing/financial/etc", "recommendations": ["tip1", "tip2"]}
    """
    
    # New syntax seamlessly supports passing the PIL image directly in a list
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=[prompt, image_file]
    )
    
    clean_text = response.text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean_text)
def chat_with_security_assistant(user_message: str) -> str:
    """Generates dynamic AI responses using Gemini for the chatbot widget."""
    prompt = f"""
    You are ScamRadar AI, an expert cybersecurity assistant integrated into the ScamRadar platform.
    Answer the user's question concisely, clearly, and helpfully.

    Platform Knowledge:
    - ScamRadar analyzes WhatsApp screenshots (via Gemini Vision OCR) and Call Recordings (via Hugging Face Whisper Speech-to-Text).
    - It predicts scam risk, confidence scores, and safety recommendations.
    - Official reporting portal in India: cybercrime.gov.in (National Cyber Crime Reporting Portal / 1930).

    User Query: "{user_message}"
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    return response.text