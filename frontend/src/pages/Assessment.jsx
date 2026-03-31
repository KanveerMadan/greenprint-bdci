import { useState } from "react"
import axios from "axios"

const API = import.meta.env.VITE_API_URL || "https://greenprint-bdci.onrender.com"

const questions = [
  { key: "age_group",   label: "How old are you?",                          type: "choice",  options: ["13-18","19-25","26-35","36-50","51+"] },
  { key: "city_tier",   label: "What type of city do you live in?",          type: "choice",  options: ["Metro","Tier 2","Rural"] },
  { key: "profession",  label: "What best describes you?",                   type: "choice",  options: ["Student","IT Professional","Business","Teacher","Homemaker","Gig Worker"] },
  { key: "income_level",label: "What is your income level?",                 type: "choice",  options: ["Low","Middle","High"] },
  { key: "device_type", label: "What device do you use most?",               type: "choice",  options: ["Mobile only","Both mobile and laptop","Laptop only"] },
  { key: "netflix_quality", label: "At what quality do you stream videos?",  type: "choice",  options: ["SD","1080p","4K"] },
  { key: "netflix_hrs_day",    label: "Hours of video streaming per day?",   type: "slider",  min: 0, max: 8,  step: 0.5, unit: "hrs" },
  { key: "instagram_hrs_day",  label: "Hours on social media per day?",      type: "slider",  min: 0, max: 8,  step: 0.5, unit: "hrs" },
  { key: "call_on_hrs_day",    label: "Hours of video calls (camera on)?",   type: "slider",  min: 0, max: 8,  step: 0.5, unit: "hrs" },
  { key: "ai_queries_day",     label: "AI tool queries per day?",            type: "slider",  min: 0, max: 60, step: 1,   unit: "queries" },
]

const defaults = {
  age_group: null, city_tier: null, profession: null, income_level: null,
  device_type: null, netflix_quality: null,
  netflix_hrs_day: 2, instagram_hrs_day: 1.5, call_on_hrs_day: 1,
  ai_queries_day: 5, call_off_hrs_day: 0.5, emails_plain_day: 10,
  emails_attach_day: 2, cloud_upload_gb_day: 0.5, music_hrs_day: 1.5,
  gaming_cloud_hrs: 0, gaming_mobile_hrs: 0.5, night_usage_pct: 30,
}

const CITY_MAP = { "Metro": "Metro", "Tier 2": "Tier2", "Rural": "Rural" }

export default function Assessment({ onResults }) {
  const [step, setStep]       = useState(0)
  const [data, setData]       = useState(defaults)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const q = questions[step]
  const progress = ((step) / questions.length) * 100

  const handleChoice = (val) => {
    const updated = { ...data, [q.key]: val }
    setData(updated)
    if (step < questions.length - 1) setStep(step + 1)
    else submit(updated)
  }

  const handleSlider = (val) => setData({ ...data, [q.key]: parseFloat(val) })

  const submit = async (finalData) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...finalData,
        city_tier: CITY_MAP[finalData.city_tier] || finalData.city_tier,
        night_usage_pct: finalData.night_usage_pct / 100,
      }
      const [scoreRes, nudgeRes] = await Promise.all([
        axios.post(`${API}/api/score`, payload),
        axios.post(`${API}/api/nudge`, payload),
      ])
      onResults({ ...scoreRes.data, nudges: nudgeRes.data.nudges, inputs: finalData })
    } catch (e) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', gap: 20,
    }}>
      <div style={{
        width: 56, height: 56,
        border: '3px solid var(--green-light)',
        borderTopColor: 'var(--green-mid)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--muted)', fontSize: 15 }}>Calculating your carbon footprint...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--green-deep)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>Greenprint</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{step + 1} of {questions.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border)' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--green-mid)',
          transition: 'width 0.4s ease',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* Question */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', maxWidth: 560, margin: '0 auto', width: '100%',
      }}>
        <div key={step} className="animate-fade-up" style={{ width: '100%' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-mid)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Question {step + 1}
          </p>
          <h2 className="serif" style={{ fontSize: 32, color: 'var(--ink)', marginBottom: 32, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {q.label}
          </h2>

          {q.type === "choice" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt) => (
                <button key={opt} onClick={() => handleChoice(opt)} style={{
                  padding: '16px 20px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12,
                  background: 'white',
                  textAlign: 'left',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--green-mid)'
                    e.currentTarget.style.background = 'var(--green-light)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  {opt}
                  <span style={{ color: 'var(--muted)', fontSize: 18 }}>→</span>
                </button>
              ))}
            </div>
          )}

          {q.type === "slider" && (
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span className="serif" style={{ fontSize: 64, color: 'var(--green-mid)', lineHeight: 1 }}>
                  {data[q.key]}
                </span>
                <span style={{ fontSize: 18, color: 'var(--muted)', marginLeft: 8 }}>{q.unit}</span>
              </div>
              <input
                type="range" min={q.min} max={q.max} step={q.step}
                value={data[q.key]}
                onChange={e => handleSlider(e.target.value)}
                style={{ width: '100%', marginBottom: 12 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                <span>{q.min} {q.unit}</span>
                <span>{q.max} {q.unit}</span>
              </div>
              <button onClick={() => {
                if (step < questions.length - 1) setStep(step + 1)
                else submit(data)
              }} style={{
                width: '100%',
                marginTop: 32,
                padding: '16px',
                background: 'var(--green-deep)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.target.style.background = 'var(--green-mid)'}
                onMouseLeave={e => e.target.style.background = 'var(--green-deep)'}
              >
                {step < questions.length - 1 ? 'Next →' : 'Get my score →'}
              </button>
            </div>
          )}

          {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 16, textAlign: 'center' }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}
