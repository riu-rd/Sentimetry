from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import replicate
import os

# Class for Entry
class Query(BaseModel):
    text: str

# Setting up Replicate API
os.environ["REPLICATE_API_TOKEN"] = "r8_dd0lbmTCsDU8xgQbA7KpJi7vkZUfCRf47JGSB"
api = replicate.Client(api_token=os.environ["REPLICATE_API_TOKEN"])


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
async def welcome():
    return {"message":"Hello, this is the API server for Sentimetry. Go to /docs to test the APIs."}

@app.get("/d")
async def docs():
    # return {"message":"Hello, this is the API server for Sentimetry. Go to /docs to test the APIs."} 
    return RedirectResponse(url="/docs")

@app.post("/get-response")
async def get_response(query : Query):
    output = api.run(
        "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
        input={
            "debug": False,
            "top_k": 50,
            "top_p": 1,
            "prompt": f"{query.text}",
            "temperature": 0.5,
            "system_prompt": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
            "max_new_tokens": 500,
            "min_new_tokens": -1
        }
    )

    return {"response": ''.join(list(output))}

