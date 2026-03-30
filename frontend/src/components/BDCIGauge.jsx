export default function BDCIGauge({ score }) {
  const color = score < 25 ? "#22c55e"
              : score < 50 ? "#eab308"
              : score < 75 ? "#f97316"
              :               "#ef4444"

  const angle = -135 + (score / 100) * 270
  const r = 80
  const cx = 100, cy = 100
  const toRad = (d) => (d * Math.PI) / 180
  const x = cx + r * Math.cos(toRad(angle))
  const y = cy + r * Math.sin(toRad(angle))

  const arcPath = (startDeg, endDeg, color) => {
    const s = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
    const e = { x: cx + r * Math.cos(toRad(endDeg)),   y: cy + r * Math.sin(toRad(endDeg)) }
    const large = endDeg - startDeg > 180 ? 1 : 0
    return <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`}
                 fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 140" className="w-52">
        {arcPath(-135, -45, "#22c55e")}
        {arcPath(-45,   45, "#eab308")}
        {arcPath(45,   135, "#f97316")}
        {arcPath(135,  135, "#ef4444")}
        <line x1={cx} y1={cy} x2={x} y2={y}
              stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill={color} />
        <text x={cx} y={cy + 28} textAnchor="middle"
              fontSize="28" fontWeight="700" fill={color}>{score}</text>
        <text x={cx} y={cy + 44} textAnchor="middle"
              fontSize="11" fill="#9ca3af">out of 100</text>
      </svg>
      <div className="flex justify-between w-52 text-xs text-gray-400 -mt-1">
        <span>Low</span><span>Moderate</span><span>High</span><span>Critical</span>
      </div>
    </div>
  )
}