# Built-in
import re
import joblib
from pathlib import Path
import os
import uvicorn

# Dependencies for FastAPI
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import keras
import tensorflow as tf

# Set Environment
os.environ["KERAS_BACKEND"] = "tensorflow"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1' 

# Setup Paths
lr_model_path = Path('./prod_models/emotion_classifier_pipe_lr.pkl')
keras_model_path = Path('./prod_models/emo_modelV2_tf')

# Class for Text Body
class Paragraph(BaseModel):
    input: str

# Classes 
classes = ['admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring', 'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval', 'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief', 'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization', 'relief', 'remorse', 'sadness', 'surprise', 'neutral']

# Load the Logistic Regression Model
with open(lr_model_path, 'rb') as f:
    lr_model = joblib.load(f)

# Load the Keras Model
tfsmlayer = keras.layers.TFSMLayer(str(keras_model_path), call_endpoint="serving_default")
inputs = keras.Input(shape=(1,), dtype=tf.string)
outputs = tfsmlayer(inputs)
keras_model = keras.Model(inputs, outputs)

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
async def docs():
    return RedirectResponse(url="/docs")

@app.post("/logistic-regression")
async def predict_emotions_lr(paragraph : Paragraph):
    # Split the huge chunk of text into a list of strings
    text_list = [text.strip() for text in re.split(r'[.!?;\n]', paragraph.input) if text.strip()]

    # Create a list to store predictions per text
    predictions_per_text = []
    for text in text_list:
      emotion = [{'label': label, 'score': score} for label, score in zip(lr_model.classes_, lr_model.predict_proba([text])[0])]
      predictions_per_text.append(emotion)

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

@app.post("/keras")
async def predict_emotions_keras(paragraph : Paragraph):
    # Split the huge chunk of text into a list of strings
    text_list = [text.strip() for text in re.split(r'[.!?;\n]', paragraph.input) if text.strip()]

    # Create a list to store predictions per text
    predictions_per_text = []
    for text in text_list:
        scores = keras_model(tf.constant([text]))['dense_1'][0]
        emotion = [{'label': label, 'score': score} for label, score in zip(classes, scores.numpy())]
        print(emotion)
        predictions_per_text.append(emotion)

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

# if __name__ == "__main__":
#   uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)