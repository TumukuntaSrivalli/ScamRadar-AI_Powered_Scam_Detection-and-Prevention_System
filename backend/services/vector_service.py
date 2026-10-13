import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

# Initialize Pinecone Client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Use an existing index name, e.g., 'scamradar'
# In Pinecone dashboard, ensure you created a serverless index named 'scamradar'
INDEX_NAME = "scamradar"

def check_scam_pattern(text_vector: list) -> bool:
    """Check if a vectorized conversation matches known scams in Pinecone."""
    try:
        index = pc.Index(INDEX_NAME)
        # Query top 1 most similar scam pattern
        result = index.query(
            vector=text_vector,
            top_k=1,
            include_metadata=True
        )
        
        # If a match has a similarity score > 0.85, it's highly likely a known scam
        if result['matches'] and result['matches'][0]['score'] > 0.85:
            return True
        return False
    except Exception as e:
        print(f"Pinecone Vector Error: {e}")
        return False