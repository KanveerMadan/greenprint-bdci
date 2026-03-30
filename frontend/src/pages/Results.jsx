import { useRef } from "react"
import html2canvas from "html2canvas"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import BDCIGauge from "../components/BDCIGauge"
import NudgeCard from "../components/NudgeCard"

const categoryColor = { Low: "#22c55e", Moderate: "#eab308", High: "#f97316", Critical: "#ef4444" }
const categoryLabel = {
  Low:      "You're doing great — your digital habits are relatively eco-friendly.",
  Moderate: "Room to improve — a few habit changes can make a real difference.",
  High:     "Significant impact — your digital carbon footprint needs attention.",
  Critical: "Very high impact — your habits are producing as much CO₂ as a weekly flight.",
}

export default function Results({ results, onRetake }) {
  const cardRef = useRef()
  const { bdci_score, bdci_category, weekly_carbon_kg, top_activities, nudges } = results

  const chartData = top_activities?.map(([name, kg]) => ({
    name: name.length > 16 ? name.slice(0, 16) + "…" : name,
    kg: parseFloat(kg.toFixed(3))
  })) || []

  const downloadCard = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#fff" })
    const a = document.createElement("a")
    a.download = "my-greenprint-score.png"
    a.href = canvas.toDataURL()
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Score card — downloadable */}
        <div ref={cardRef}
             className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Your Behavioral Digital Carbon Index</p>
          <BDCIGauge score={bdci_score} />
          <div className="mt-3">
            <span className="text-2xl font-bold"
                  style={{ color: categoryColor[bdci_category] }}>{bdci_category}</span>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
              {categoryLabel[bdci_category]}
            </p>
          </div>
          <div className="mt-4 bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Weekly digital carbon</p>
            <p className="text-2xl font-semibold text-gray-700">
              {parseFloat(weekly_carbon_kg).toFixed(2)}
              <span className="text-sm font-normal text-gray-400 ml-1">kgCO₂</span>
            </p>
          </div>
          <p className="text-xs text-gray-300 mt-4">greenprint-bdci.vercel.app</p>
        </div>

        {/* Download + Retake */}
        <div className="flex gap-3">
          <button onClick={downloadCard}
                  className="flex-1 border border-gray-200 bg-white hover:bg-gray-50
                             text-gray-600 font-medium py-2.5 rounded-full text-sm transition-colors">
            Download card
          </button>
          <button onClick={onRetake}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white
                             font-medium py-2.5 rounded-full text-sm transition-colors">
            Retake assessment
          </button>
        </div>

        {/* Top activities chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Your biggest emitters (kgCO₂/week)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} layout="vertical"
                        margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} kgCO₂`, "Weekly carbon"]} />
                <Bar dataKey="kg" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#ef4444" : i === 1 ? "#f97316" : "#eab308"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI nudges */}
        {nudges && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-1">Your personalised nudges</h3>
            <p className="text-xs text-gray-400 mb-4">
              AI-generated suggestions based on your specific habits
            </p>
            <div className="space-y-3">
              {nudges.map((text, i) => <NudgeCard key={i} number={i + 1} text={text} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
