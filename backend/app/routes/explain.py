from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.openai_client import client

# This MUST be named "router"
router = APIRouter(prefix="/api", tags=["explain"])


class ProblemInput(BaseModel):
    question: str


@router.post("/explain")
async def explain_problem(data: ProblemInput):
    if not data.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    prompt = f"""
You are a senior software engineer helping someone prepare for coding interviews.

Given this problem:

"{data.question}"

Please return the following:

1. Problem Summary
2. Brute Force Approach + Python code
3. Optimized Approach + Python code
4. Time & Space Complexity for both solutions
5. Test Cases (including edge cases)
6. Follow-up Interview Questions
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert interview coach."},
                {"role": "user", "content": prompt},
            ],
        )

        return {"explanation": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
