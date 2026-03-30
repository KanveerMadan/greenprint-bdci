import { useState } from "react"
import axios from "axios"
import ProgressBar from "../components/ProgressBar"

const API = import.meta.env.VITE_API_URL || "https://greenprint-bdci.onrender.com"

const questions = [
  { key: "age_group", label: "What is your age group?",
    type: "choice", options: ["13-18", "19-25", "26-35", "36-50", "51+"] },

  { key: "city_tier", label: "Which type of city do you live in?",
    type: "choice", options: ["Metro", "Tier 2", "Rural"] },

  { key: "profession", label: "What best describes you?",
    type: "choice", options: ["Student", "IT Professional", "Business", "Teacher", "Homemaker", "Gig Worker"] },

  { key: "income_level", label: "What is your income level?",
    type: "choice", options: ["Low", "Middle", "High"] },

  { key: "device_type", label: "What device do you use most?",
    type: "choice", options: ["Mobile", "Laptop", "Both"] },

  { key: "netflix_quality", label: "At what quality do you stream videos?",
    type: "choice", options: ["SD", "1080p", "4K"] },

  { key: "netflix_hrs_day", label: "How many hours a day do you stream video? (Netflix, YouTube, Hotstar)",
    type: "slider", min: 0, max: 8, step: 0.5, unit: "hrs" },

  { key: "instagram_hrs_day", label: "How many hours a day on social media? (Instagram, Twitter, LinkedIn)",
    type: "slider", min: 0, max: 8, step: 0.5, unit: "hrs" },

  { key: "call_on_hrs_day", label: "How many hours of video calls per day with camera ON?",
    type: "slider", min: 0, max: 8, step: 0.5, unit: "hrs" },

  { key: "ai_queries_day", label: "How many AI tool queries per day? (ChatGPT, Gemini, Copilot)",
    type: "slider", min: 0, max: 60, step: 1, unit: "queries" },
]

const defaults = {
  age_group: null,
  city_tier: null,
  profession: null,
  income_level: null,
  device_type: null,
  netflix_quality: null,
  netflix_hrs_day: 2,
  instagram_hrs_day: 1.5,
  call_on_hrs_day: 1,
  ai_queries_day: 5,
  call_off_hrs_day: 0.5,
  emails_plain_day: 10,
  emails_attach_day: 2,
  cloud_upload_gb_day: 0.5,
  music_hrs_day: 1.5,
  gaming_cloud_hrs: 0,
  gaming_mobile_hrs: 0.5,
  night_usage_pct: 30,
}

export default function Assessment({ onResults }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(defaults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const q = questions[step]

  const handleChoice = (val) => {
    const updated = { ...data, [q.key]: val }
    setData(updated)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      submit(updated)
    }
  }

  const handleSlider = (val) => {
    setData({ ...data, [q.key]: parseFloat(val) })
  }

  const submit = async (finalData) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Submitting:", finalData)

      const scoreRes = await axios.post(`${API}/api/score`, finalData)
      console.log("Score response:", scoreRes.data)

      const nudgeRes = await axios.post(`${API}/api/nudge`, finalData)
      console.log("Nudge response:", nudgeRes.data)

      onResults({
        ...scoreRes.data,
        nudges: nudgeRes.data.nudges,
        inputs: finalData
      })
    } catch (e) {
      console.error("Submission error:", e)
      console.error("Backend response:", e?.response?.data)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Calculating your carbon footprint...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <ProgressBar current={step + 1} total={questions.length} />

        <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-snug">
          {q.label}
        </h2>

        {q.type === "choice" && (
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleChoice(opt)}
                className="w-full text-left px-5 py-3.5 rounded-xl border border-gray-200
                           bg-white hover:border-green-500 hover:bg-green-50
                           text-gray-700 font-medium transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "slider" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-green-600">{data[q.key]}</span>
              <span className="text-xl text-gray-400 ml-2">{q.unit}</span>
            </div>

            <input
              type="range"
              min={q.min}
              max={q.max}
              step={q.step}
              value={data[q.key]}
              onChange={(e) => handleSlider(e.target.value)}
              className="w-full accent-green-600"
            />

            <div className="flex justify-between text-xs text-gray-400">
              <span>{q.min} {q.unit}</span>
              <span>{q.max} {q.unit}</span>
            </div>

            <button
              onClick={() => {
                if (step < questions.length - 1) setStep(step + 1)
                else submit(data)
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold
                         py-3 rounded-full transition-colors"
            >
              {step < questions.length - 1 ? "Next →" : "Get my score →"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  )
}