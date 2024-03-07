from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from firebase_admin import auth, credentials, initialize_app
import re
from collections import defaultdict
import requests

# HuggingFace
from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline

# Get the EmoRoBERTa from HuggingFace
# tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
# model = TFRobertaForSequenceClassification.from_pretrained("arpanghoshal/EmoRoBERTa")
# emotion = pipeline('sentiment-analysis', model='arpanghoshal/EmoRoBERTa', top_k=None)

# Using EmoRoBERTa API
API_TOKEN = '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'

API_URL = "https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

# Class for Entry
class JournalEntry(BaseModel):
    text: str

# Initialize Firebase Connection
# credential = credentials.Certificate('./key.json')
# initialize_app(credential)

# Firebase Auth Verifier
# def get_user_token(res: Response, credential: HTTPAuthorizationCredentials=Depends(HTTPBearer(auto_error=False))):
#     if credential is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Bearer authentication is needed",
#             headers={'WWW-Authenticate': 'Bearer realm="auth_required"'},
#         )
#     try:
#         decoded_token = auth.verify_id_token(credential.credentials)
#     except Exception as err:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=f"Invalid authentication from Firebase. {err}",
#             headers={'WWW-Authenticate': 'Bearer error="invalid_token"'},
#         )
#     res.headers['WWW-Authenticate'] = 'Bearer realm="auth_required"'
#     return decoded_token


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

# APIs
@app.get("/")
async def sentimetry():
    # return {"message":"Hello, this is the API server for Sentimetry. Go to /docs to test the APIs."} 
    return RedirectResponse(url="/docs")

@app.post("/predict-text/{text}")
async def predict_emotions(text : str): # user = Depends(get_user_token)
    text_json = {"inputs":f"{text}"}
    emotion = query(text_json)
    prediction = emotion[0]
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
        text_json = {"inputs":f"{text}"}
        emotion = query(text_json)
        predictions_per_text.append(emotion[0])
    
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
