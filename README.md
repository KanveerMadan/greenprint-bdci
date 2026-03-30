# 🌿 GreenPrint — Behavioral Digital Carbon Index

> India's first AI-powered digital carbon footprint benchmarking system for individuals and organisations.

**Live demo:** [greenprint-bdci.vercel.app](https://greenprint-bdci.vercel.app)  
**API docs:** [greenprint-bdci.onrender.com/docs](https://greenprint-bdci.onrender.com/docs)

---

## What it does

GreenPrint measures how much CO₂ your daily internet habits produce using the **Behavioral Digital Carbon Index (BDCI)** — a 0–100 score built on emission factors from the IEA, Shift Project, and Obringer et al.

**Individual flow:** Answer 10 questions about your digital habits → get your BDCI score → receive 3 AI-generated nudges personalised to your city tier, profession, and device type.

**Organisation flow:** Upload employee survey data → get a full carbon breakdown by department, city tier, and device type → intervention simulation showing projected BDCI reduction.

---

## Why it's novel

- First labeled behavioral digital carbon dataset for Indian internet users
- India-specific modelling: city tier (Metro/Tier2/Rural), Jio vs broadband, coal-grid night usage multiplier
- Full pipeline: raw behavior → ML score → LLM nudge → simulated intervention loop
- B2B dashboard for ESG reporting — not just an individual calculator

---

## Demo

| Individual assessment | Org dashboard |
|---|---|
| Fill 10-question form | Upload employee JSON |
| Get BDCI score + gauge | Category breakdown by tier |
| AI nudges via Llama 3.1 | Intervention estimate |
| Download score card | PDF-ready report |

---

## Architecture
```
User → React frontend (Vercel)
           ↓
      FastAPI backend (Render)
           ↓
   ┌───────────────────┐
   │  Random Forest    │  ← predicts BDCI score
   │  (sklearn .pkl)   │
   └───────────────────┘
           ↓
   ┌───────────────────┐
   │  Groq / Llama 3.1 │  ← generates nudges
   └───────────────────┘
```

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI, Python 3.9 |
| ML Model | Random Forest (scikit-learn), XGBoost |
| LLM | Llama 3.1 via Groq API |
| Deployment | Vercel (frontend), Render (backend) |
| Dataset | 5,000 synthetic Indian user profiles |

---

## Run locally

**Backend:**
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key" > .env
uvicorn main:app --reload
# API running at http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.development
npm run dev
# App running at http://localhost:5173
```

---

## Dataset

5,000 synthetic Indian user profiles with 22 features including:
- Digital activity hours (Netflix, Instagram, calls, email, gaming, cloud)
- India-specific: city tier, income level, night usage percentage
- BDCI score (0–100) and category (Low/Moderate/High/Critical)

Generated using TRAI behavioral statistics and IEA emission factors.

---

## Research

This project accompanies a research paper on behavioral digital carbon benchmarking in India's tiered internet infrastructure.

- Emission factors: IEA (2023), Shift Project Digital Sobriety Report, Obringer et al. (Nature, 2021)
- ML models compared: Random Forest, XGBoost, Neural Network
- Evaluation: RMSE, MAE, R², F1, confusion matrix, ablation study

---

## Project structure
```
greenprint-bdci/
├── backend/          # FastAPI app + ML models
├── frontend/         # React + Vite app
├── notebooks/        # Research Colab notebook
├── data/             # Sample dataset
└── README.md
```

---

## Author

**Kanveer Madan** — BTech 3rd year  
Built as part of a research project on digital sustainability in India.

[GitHub](https://github.com/KanveerMadan) · [Live app](https://greenprint-bdci.vercel.app)
