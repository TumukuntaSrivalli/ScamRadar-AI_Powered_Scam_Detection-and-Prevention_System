from pydantic import BaseModel, Field

class ScamAnalysisResponse(BaseModel):
    is_scam: bool = Field(..., description="Whether the input is classified as a scam")
    confidence_score: float = Field(..., ge=0, le=100, description="Confidence percentage")
    category: str = Field(..., description="Type of scam (e.g., Phishing, Impersonation)")
    recommendations: list[str] = Field(..., description="Actionable safety tips")