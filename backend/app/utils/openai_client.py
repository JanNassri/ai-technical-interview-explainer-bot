import os
from dotenv import load_dotenv
from openai import OpenAI

# Load .env file
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    print("❌ ERROR: OPENAI_API_KEY not found in environment!")
    raise RuntimeError("Missing API key")

# Create the OpenAI client
client = OpenAI(api_key=api_key)

print("✅ OpenAI client initialized.")
