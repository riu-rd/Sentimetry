from fastapi import FastAPI
from pydantic import BaseModel
import re
from collections import defaultdict

# HuggingFace
from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline

# Get the EmoRoBERTa from HuggingFace
tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
model = TFRobertaForSequenceClassification.from_pretrained("arpanghoshal/EmoRoBERTa")
emotion = pipeline('sentiment-analysis', model='arpanghoshal/EmoRoBERTa', top_k=None)

# Class for Entry
class JournalEntry(BaseModel):
    text: str

# Start the app
app = FastAPI()

@app.get("/")
async def hello():
    return {"msg":"Hello, this is API server"} 

@app.post("/predict-text/{text}")
async def predict_emotions(text):
    prediction = emotion(text)[0]
    sorted_prediction = sorted(prediction, key=lambda x: x['score'], reverse=True)
    predicted_emotion = sorted_prediction[0]['label']
    probability = round(sorted_prediction[0]['score'] * 100, 1)
    return {"prediction":f"Emotion: {predicted_emotion} ({probability})%"}

@app.post("/predict-journal")
async def predict_emotions(entry : JournalEntry):
    # Split the huge chunk of text into a string list
    text_list = re.split(r'[.!?;\n]', entry.text)
    text_list = [text.strip() for text in text_list if text.strip()]

    # Create a list of all predictions per text
    predictions_per_text = []
    for text in text_list:
        predictions_per_text.append(emotion(text)[0])
    
    # Create a defaultdict to aggregate scores for each label
    total = defaultdict(float)

    # Iterate over each list and aggregate the scores
    for prediction in predictions_per_text:
        for emotion_dict in prediction:
            label = emotion_dict['label']
            score = emotion_dict['score']
            total[label] += score
    
    # Convert the defaultdict to a list of dictionaries
    result = [{'label': label, 'score': score} for label, score in total.items()]
    # Sort the result in descending order
    sorted_result = sorted(result, key=lambda x: x['score'], reverse=True)
    return {"predictions" : sorted_result}
