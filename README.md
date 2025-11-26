🚀 AI Technical Interview Explainer Bot

A full-stack AI-powered web application that explains coding interview problems step-by-step, generates brute force and optimized solutions, provides time/space complexity, creates test cases, and even gives follow-up questions like a real interviewer.

Empowers students, job seekers, and engineers to understand coding problems faster and prepare for technical interviews more effectively.

🌟 Features
🧠 AI Problem Breakdown

Paste any LeetCode-style problem, and the bot will explain:

What the problem is really asking

Hidden constraints

Required data structures / algorithms

Common pitfalls

Key patterns (two-pointer, DP, graph, etc.)

⚡ Brute Force → Optimized Solution Generation

The AI produces:

A brute force solution

A fully optimized solution

Clean, readable code

Explanations for each step

Supports: Python & Java (easily extendable)

🧮 Time & Space Complexity Analysis

Automatically explains both complexities with reasoning.

🧪 Test Case Generator

Creates:

Standard test cases

Edge cases

Corner cases

Expected output explanations

🔁 Interviewer Follow-Up Questions

Builds realistic follow-up prompts like:

“How would you handle streaming input?”

“Can you optimize this further?”

“What if the array is sorted?”

🧩 Similar Problem Recommendations

Uses embeddings to suggest related problems for deeper practice.

✍️ (Optional) User Solution Grader

Paste your code → AI evaluates:

correctness

efficiency

missing edge cases

code style

gives a 1–10 score

🛠️ Tech Stack
Frontend

React (Vite)

TailwindCSS

Shadcn/UI

Axios

Backend

FastAPI (Python)

Uvicorn

Pydantic

OpenAI API

AI Models

GPT-4.1 / GPT-4o-mini / o3-mini

text-embedding-3-large (for problem classification)

Database (Optional)

MySQL / PlanetScale

SQLAlchemy

Deployment

Frontend → Vercel

Backend → Render / Railway

DB → PlanetScale

🏗️ Architecture
[React Frontend]
     |
     |  (Axios REST calls)
     v
[FastAPI Backend]
     |
     |  (OpenAI API calls)
     v
[LLM Models]
     |
     v
[Optional: MySQL Database]

📂 Project Structure
ai-technical-interview-explainer-bot/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── models/
│   │   └── __init__.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── components/
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md
└── LICENSE

▶️ Backend Setup
1️⃣ Install dependencies
cd backend
pip install -r requirements.txt

2️⃣ Add your OpenAI API key

Create a .env file:

OPENAI_API_KEY=your_key_here

3️⃣ Run server
uvicorn app.main:app --reload


Server runs on:
👉 http://localhost:8000

💻 Frontend Setup
1️⃣ Install dependencies
cd frontend
npm install

2️⃣ Run development server
npm run dev


Frontend runs on:
👉 http://localhost:5173

📡 API Endpoint
POST /explain

Request:

{
  "question": "Given an array of integers, return two indices such that they add up to a target."
}


Response:

{
  "explanation": "Full breakdown including brute force solution, optimized solution, complexities, test cases..."
}

🔮 Future Enhancements

Voice input using Whisper

User dashboard for saved problems

Difficulty classifier

Coding environment + AI grader

Multiple language support (JS, C++, Go)

System design question support

🤝 Contributing

Feel free to submit PRs, open issues, or request features.

📜 License

MIT License.
