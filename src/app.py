import openai
import os
from dotenv import load_dotenv

# ✅ Load API key securely from .env
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("❌ OPENAI_API_KEY not found in .env file! Check .env file.")

# ✅ Debugging step: Print API key to verify it's loaded
print("✅ API Key Loaded Successfully:", api_key[:5] + "..." + api_key[-5:])  # Hide full key for security

# ✅ Use OpenAI API with the correct method
openai.api_key = api_key  # Correct way to set API key

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",  # ✅ Change to GPT-3.5z
    messages=[{"role": "user", "content": "Hello!"}]
)


print("🤖 AI Response:", response["choices"][0]["message"]["content"])
