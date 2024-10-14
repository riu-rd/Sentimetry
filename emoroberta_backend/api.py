# Built-in
import os
from pathlib import Path
from dotenv import load_dotenv
import uvicorn
import re

# Dependencies for FastAPI
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from huggingface_hub import login

# Login
dotenv_path = Path('../model_space/model_generation/.env')
load_dotenv(dotenv_path=dotenv_path)

HF_TOKEN = os.getenv('HF_TOKEN')
login(token=HF_TOKEN)

# Class for Text Body
class Paragraph(BaseModel):
    input: str

# Load the EmoRoBERTa Model
emotion = pipeline("text-classification", model="arpanghoshal/EmoRoBERTa", top_k=None)

# Start the app
app = FastAPI()

# Setup CORS policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def remove_unknown_symbols(text):
    # Define a regular expression pattern to match characters that are not within the range of alphanumeric, space, and common punctuation characters
    pattern = re.compile(r'[^A-Za-z0-9\s.,?!\'"-]')
    # Replace unknown symbols with an empty string
    cleaned_text = re.sub(pattern, '', text)
    # Truncate the text if its length exceeds 1020 characters
    return cleaned_text # [:1020]

# APIs
@app.get("/")
async def docs():
    return RedirectResponse(url="/docs")

@app.post("/emoroberta")
async def predict_emotions_emoroberta(paragraph : Paragraph):
    # Split the huge chunk of text into a list of strings
    text_list = [text.strip() for text in re.split(r'[.!?;\n]', paragraph.input) if text.strip()]

    # Create a list to store predictions per text
    predictions_per_text = []
    for text in text_list:
      cleaned_text = remove_unknown_symbols(text)
      emotions = emotion(cleaned_text)[0]
      predictions_per_text.append(emotions)

    # Create a dictionary to aggregate scores for each label
    total = {}

    # Iterate over each list and aggregate the scores
    for prediction in predictions_per_text:
        for emotion_dict in prediction:
            label = emotion_dict['label']
            score = emotion_dict['score']
            total[label] = total.get(label, 0) + score

    # Convert the dictionary to a list of dictionaries
    result = [{"label": label, "score": score} for label, score in total.items()]

    # Sort the result in descending order based on score
    sorted_result = sorted(result, key=lambda x: x['score'], reverse=True)

    return {"predictions": sorted_result}

if __name__ == "__main__":
  uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)