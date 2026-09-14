from fastapi import FastAPI
from pydantic import BaseModel
from services.sentiment import analyze_text_sentiment

app = FastAPI(
    title="Global Pulse ML Backend",
    description="Machine Learning Microservice for Global Pulse Project",
    version="1.0.0"
)

class SentimentRequest(BaseModel):
    title: str = ""
    content: str = ""

@app.get("/")
def read_root():
    return {"status": "success", "message": "ML Backend is up and running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze-sentiment")
def analyze_sentiment_endpoint(request: SentimentRequest):
    full_text = f"{request.title} {request.content}"
    result = analyze_text_sentiment(full_text)
    return result

