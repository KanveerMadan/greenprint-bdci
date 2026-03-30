export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full">
        <div className="h-1.5 bg-green-500 rounded-full transition-all duration-500"
             style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}