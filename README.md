AI Technical Interview Explainer Bot

A simple AI-powered tool that helps users understand coding interview questions.
Paste a problem → AI explains it in clear steps, shows brute force + optimized solutions, gives time/space complexity, and generates test cases.

Features

Explain any coding interview question

Generate brute force + optimized solutions

Provide time & space complexity

Create test cases and edge cases

Give follow-up interview questions

Tech Stack

Frontend: React (Vite), TailwindCSS
Backend: FastAPI (Python)
AI: OpenAI GPT-4.1 / o3-mini
Deployment: Vercel + Render

How It Works

User pastes a coding problem

Frontend sends it to the backend

Backend calls OpenAI

AI returns a full explanation

UI displays the answer cleanly

Setup
Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
cd frontend
npm install
npm run dev

Project Structure
backend/
frontend/
README.md
.gitignore

Example API Request
POST /explain
{
  "question": "Two Sum problem description..."
}

Future Improvements

User answer grading

Save history of solved problems

Support more languages (Java, JS, C++)
