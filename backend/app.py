from flask import Flask, render_template, request
from flask_cors import CORS  # Import the CORS module
import openai

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

openai.api_key = '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'

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api", methods=["POST"])
def api():
    message = request.json.get("message")
    
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": message}
        ]
    )
    
    if completion.choices[0].message is not None:
        return completion.choices[0].message
    else:
        return 'Failed to Generate response!'

if __name__ == '__main__':
    app.run()
