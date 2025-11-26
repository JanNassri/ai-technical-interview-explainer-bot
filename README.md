# AI Technical Interview Explainer Bot

An AI-powered web app that explains coding interview problems in simple steps.  
Paste any question → get a clear explanation, brute force + optimized solutions, time/space complexity, and test cases.

---

## Features
- Explain any coding interview question
- Brute force and optimized solutions
- Time & space complexity breakdown
- Auto-generated test cases
- Interview-style follow-up questions

---

## Tech Stack
**Frontend:** React (Vite), TailwindCSS  
**Backend:** FastAPI (Python)  
**AI:** OpenAI GPT-4.1 / o3-mini  
**Deployment:** Vercel (frontend), Render (backend)

---

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

cd frontend
npm install
npm run dev


ai-interview-explainer/
  ├── backend/
  ├── frontend/
  ├── .gitignore
  └── README.md


{
  "question": "Explain the Two Sum problem..."
}


Full explanation with solutions, complexity, and test cases...
