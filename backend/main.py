

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, json, os, numpy as np, pandas as pd
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="GreenPrint BDCI API")

app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model   = joblib.load("bdci_model.pkl")
clf     = joblib.load("bdci_classifier.pkl")
scaler  = joblib.load("bdci_scaler.pkl")
with open("feature_columns.json") as f:
    feature_cols = json.load(f)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class UserInput(BaseModel):
    age_group: str
    city_tier: str
    profession: str
    device_type: str
    income_level: str
    netflix_hrs_day: float
    netflix_quality: str
    instagram_hrs_day: float
    call_on_hrs_day: float
    call_off_hrs_day: float
    emails_plain_day: int
    emails_attach_day: int
    cloud_upload_gb_day: float
    music_hrs_day: float
    ai_queries_day: int
    gaming_cloud_hrs: float
    gaming_mobile_hrs: float
    night_usage_pct: float

def prepare_features(u: UserInput):
    row = {
        'netflix_hrs_day': u.netflix_hrs_day,
        'instagram_hrs_day': u.instagram_hrs_day,
        'call_on_hrs_day': u.call_on_hrs_day,
        'call_off_hrs_day': u.call_off_hrs_day,
        'emails_plain_day': u.emails_plain_day,
        'emails_attach_day': u.emails_attach_day,
        'cloud_upload_gb_day': u.cloud_upload_gb_day,
        'music_hrs_day': u.music_hrs_day,
        'ai_queries_day': u.ai_queries_day,
        'gaming_cloud_hrs': u.gaming_cloud_hrs,
        'gaming_mobile_hrs': u.gaming_mobile_hrs,
        'night_usage_pct': u.night_usage_pct,
    }
    cat_vals = {
        f'age_group_{u.age_group}': 1,
        f'city_tier_{u.city_tier}': 1,
        f'profession_{u.profession}': 1,
        f'device_type_{u.device_type}': 1,
        f'income_level_{u.income_level}': 1,
        f'netflix_quality_{u.netflix_quality}': 1,
    }
    for col in feature_cols:
        if col not in row:
            row[col] = cat_vals.get(col, 0)
    df = pd.DataFrame([row])[feature_cols]
    return scaler.transform(df)

def get_top3(u: UserInput):
    contributions = {
        'Netflix/streaming':       u.netflix_hrs_day * (
                                       0.167 if u.netflix_quality == '4K' else
                                       0.092 if u.netflix_quality == '1080p' else 0.022),
        'Instagram/social media':  u.instagram_hrs_day * 0.025,
        'Video calls (camera on)': u.call_on_hrs_day * 0.262,
        'Emails with attachments': u.emails_attach_day * 0.084,
        'Cloud uploads':           u.cloud_upload_gb_day * 0.022,
        'AI tool queries':         u.ai_queries_day * 0.00722,
        'Cloud gaming':            u.gaming_cloud_hrs * 0.167,
    }
    weekly = {k: round(v * 7, 3) for k, v in contributions.items()}
    return sorted(weekly.items(), key=lambda x: x[1], reverse=True)[:3]

@app.get("/")
def root():
    return {"status": "GreenPrint API running"}

@app.post("/api/score")
def get_score(u: UserInput):
    X = prepare_features(u)
    bdci_score    = float(np.clip(model.predict(X)[0], 0, 100))
    bdci_category = clf.predict(X)[0]
    top3          = get_top3(u)
    qw = {'SD': 0.036, '1080p': 0.072, '4K': 0.144}
    weekly_carbon = round(
        u.netflix_hrs_day * qw[u.netflix_quality] * 7 +
        u.instagram_hrs_day * 0.18 * 7 +
        (u.call_on_hrs_day * 0.09 + u.call_off_hrs_day * 0.03) * 7 +
        (u.emails_plain_day * 0.004 + u.emails_attach_day * 0.03) * 7 +
        u.cloud_upload_gb_day * 0.06 * 7 +
        u.gaming_cloud_hrs * 0.4 * 7, 3)
    return {
        "bdci_score": round(bdci_score, 2),
        "bdci_category": bdci_category,
        "weekly_carbon_kg": weekly_carbon,
        "top3_activities": [{"activity": k, "kg_per_week": v} for k, v in top3]
    }

@app.post("/api/nudge")
def get_nudge(u: UserInput):
    score_data = get_score(u)
    top3_text = "\n".join([
        f"  - {a['activity']}: {a['kg_per_week']} kgCO2/week"
        for a in score_data['top3_activities']])
    prompt = f"""You are a sustainability advisor for an Indian internet user.
BDCI Score: {score_data['bdci_score']}/100 ({score_data['bdci_category']})
Profile: {u.age_group}, {u.profession}, {u.city_tier}, {u.device_type}
Top 3 carbon activities:
{top3_text}

Give exactly 3 nudges. Format:
NUDGE 1: [action] -> Saving: [X] kgCO2/week
NUDGE 2: [action] -> Saving: [X] kgCO2/week
NUDGE 3: [action] -> Saving: [X] kgCO2/week"""
    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300)
    return {
        **score_data,
        "nudges": response.choices[0].message.content
    }

@app.post("/api/org-report")
def org_report(file_data: dict):
    rows = file_data.get("rows", [])
    if not rows:
        raise HTTPException(400, "No data provided")
    scores = []
    for row in rows:
        u = UserInput(**row)
        X = prepare_features(u)
        scores.append({
            "bdci_score":    float(np.clip(model.predict(X)[0], 0, 100)),
            "bdci_category": clf.predict(X)[0],
            "city_tier":     u.city_tier,
            "profession":    u.profession,
            "device_type":   u.device_type,
        })
    df = pd.DataFrame(scores)
    return {
        "total_employees":    len(df),
        "avg_bdci":           round(df['bdci_score'].mean(), 2),
        "category_breakdown": df['bdci_category'].value_counts().to_dict(),
        "by_city_tier":       df.groupby('city_tier')['bdci_score'].mean().round(2).to_dict(),
        "by_profession":      df.groupby('profession')['bdci_score'].mean().round(2).to_dict(),
        "by_device":          df.groupby('device_type')['bdci_score'].mean().round(2).to_dict(),
    }




