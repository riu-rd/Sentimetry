from transformers import RobertaTokenizerFast, TFRobertaForSequenceClassification, pipeline

# Get the EmoRoBERTa from HuggingFace
tokenizer = RobertaTokenizerFast.from_pretrained("arpanghoshal/EmoRoBERTa")
model = TFRobertaForSequenceClassification.from_pretrained("arpanghoshal/EmoRoBERTa")
emotion = pipeline('sentiment-analysis', model='arpanghoshal/EmoRoBERTa')

while True:
    prediction = emotion(input("Enter your text: "))
    print("Predicted Emotion", prediction[0]['label']) # To get the label only
    print()
    print()