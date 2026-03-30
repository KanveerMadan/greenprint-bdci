export default function NudgeCard({ number, text }) {
  const lines = text.split("\n").filter(Boolean)
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm font-semibold
                        flex items-center justify-center flex-shrink-0 mt-0.5">
          {number}
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">
          {lines.map((l, i) => <p key={i} className="mb-1 last:mb-0">{l}</p>)}
        </div>
      </div>
    </div>
  )
}
