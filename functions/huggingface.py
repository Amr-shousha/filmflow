# functions/huggingface.py
import json
from huggingface_hub import InferenceApi

def handler(event, context):
    # Initialize Hugging Face API
    api_key = process.env.HUGGING_FACE_API_KEY
    inference = InferenceApi(repo_id="distilbert-base-uncased", token=api_key)
    
    # Get input from frontend
    body = json.loads(event["body"])
    text_input = body.get("text", "")

    # Make inference
    result = inference(inputs=text_input)

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(result)
    }
