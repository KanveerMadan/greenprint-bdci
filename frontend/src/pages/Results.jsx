import { useRef } from "react"
import html2canvas from "html2canvas"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const COLORS = { Low: "#16a34a", Moderate: "#ca8a04", High: "#ea580c", Critical: "#dc2626" }
const LABELS = {
  Low:      "Your digital habits are relatively eco-friendly.",
  Moderate: "A few habit changes can make a real difference.",
  High:     "Your digital carbon footprint needs attention.",
  Critical: "Your habits produce as much CO₂ as a weekly flight.",
}
const GAUGE_ANGLE = { Low: -90, Moderate: -30, High: 30, Critical: 80 }

function Gauge({ score, category }) {
  const color = COLORS[category] || "#16a34a"
  const angle = -110 + (score / 100) * 220
  const rad = (angle * Math.PI) / 180
  const cx = 100, cy = 90, r = 70
  const nx = cx + r * Math.cos(rad)
  const ny = cy + r * Math.sin(rad)

  const arc = (startDeg, endDeg, col) => {
    const s = ((startDeg - 90) * Math.PI) / 180
    const e = ((endDeg - 90) * Math.PI) / 180
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }

  return (
    <svg viewBox="0 0 200 110" style={{ width: '100%', maxWidth: 260 }}>
      <path d={arc(220, 280, '#dcfce7')} fill="none" stroke="#dcfce7" strokeWidth="10" strokeLinecap="round"/>
      <path d={arc(280, 320, '#fef9c3')} fill="none" stroke="#fef9c3" strokeWidth="10" strokeLinecap="round"/>
      <path d={arc(320, 360, '#ffedd5')} fill="none" stroke="#ffedd5" strokeWidth="10" strokeLinecap="round"/>
      <path d={arc(0, 40, '#fee2e2')}   fill="none" stroke="#fee2e2" strokeWidth="10" strokeLinecap="round"/>
      <path d={arc(220, 220 + (score/100)*220, '#000')} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.9"/>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="5" fill={color}/>
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily="DM Serif Display, serif">{score}</text>
    </svg>
  )
}

export default function Results({ results, onRetake }) {
  const cardRef = useRef()
  const { bdci_score, bdci_category, weekly_carbon_kg, top3_activities, nudges } = results

  const chartData = (top3_activities || []).map(({ activity, kg_per_week }) => ({
    name: activity.length > 14 ? activity.slice(0, 14) + '…' : activity,
    kg: parseFloat(kg_per_week),
  }))

  const nudgeList = (nudges || '').split('\n').filter(l => l.trim().startsWith('NUDGE'))

  const downloadCard = async () => {
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: '#fff' })
    const a = document.createElement('a')
    a.download = 'my-greenprint-score.png'
    a.href = canvas.toDataURL()
    a.click()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--green-deep)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Greenprint</span>
        </div>
        <button onClick={onRetake} style={{
          padding: '8px 18px', border: '1.5px solid var(--border)', borderRadius: 100,
          background: 'transparent', color: 'var(--muted)', fontSize: 13,
          fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}>
          Retake assessment
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>

        {/* Score card (downloadable) */}
        <div ref={cardRef} className="animate-scale-in" style={{
          background: 'white',
          borderRadius: 24,
          border: '1px solid var(--border)',
          padding: '40px 32px',
          textAlign: 'center',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Your Behavioral Digital Carbon Index
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Gauge score={bdci_score} category={bdci_category} />
          </div>
          <div className="serif" style={{ fontSize: 36, color: COLORS[bdci_category], marginBottom: 8, lineHeight: 1 }}>
            {bdci_category}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            {LABELS[bdci_category]}
          </p>
          <div style={{
            background: 'var(--cream)',
            borderRadius: 12,
            padding: '16px 24px',
            display: 'inline-block',
          }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Weekly digital carbon</p>
            <p className="serif" style={{ fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>
              {weekly_carbon_kg} <span style={{ fontSize: 16, color: 'var(--muted)' }}>kgCO₂</span>
            </p>
          </div>
          <p style={{ fontSize: 11, color: '#d1d5db', marginTop: 20 }}>greenprint-bdci.vercel.app</p>
        </div>

        {/* Download button */}
        <button onClick={downloadCard} style={{
          width: '100%',
          padding: '14px',
          border: '1.5px solid var(--border)',
          borderRadius: 12,
          background: 'white',
          color: 'var(--ink)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          marginBottom: 32,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.target.style.borderColor = 'var(--green-mid)'}
          onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
        >
          ↓ Download score card
        </button>

        {/* Top emitters chart */}
        {chartData.length > 0 && (
          <div className="animate-fade-up-2" style={{
            background: 'white', borderRadius: 20, border: '1px solid var(--border)',
            padding: '28px', marginBottom: 20,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              Your biggest emitters
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>kgCO₂ per week</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: 'var(--ink)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => [`${v} kgCO₂`, 'Weekly']} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }} />
                <Bar dataKey="kg" radius={[0, 6, 6, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={i === 0 ? '#dc2626' : i === 1 ? '#ea580c' : '#ca8a04'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Nudges */}
        {nudgeList.length > 0 && (
          <div className="animate-fade-up-3" style={{
            background: 'white', borderRadius: 20, border: '1px solid var(--border)', padding: '28px',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              Your personalised nudges
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
              AI-generated suggestions based on your specific habits
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {nudgeList.map((text, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '16px', background: 'var(--cream)', borderRadius: 12,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--green-light)',
                    color: 'var(--green-mid)',
                    fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                    {text.replace(/^NUDGE \d+:\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
