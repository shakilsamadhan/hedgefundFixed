# HedgeFund

This is a full-stack project with a **FastAPI backend** and a **React frontend**.  
Below are instructions to run the project locally.

---

## Prerequisites

- Python 3.10+  
- Node.js 18+ and npm  
- pipenv or virtualenv (optional but recommended)  
- Excel data files in `backend/data/` folder (for Bloomberg data)

---

## Setup Backend

1. install required dependencies/library as in requirements.txt and run

```bash
uvicorn backend.app:app --reload
```


## Setup Frontend

1. install required dependencies/library as in package.json or just run

```bash
cd frontend
npm install
npm run dev
```

