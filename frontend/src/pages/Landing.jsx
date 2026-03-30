export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">🌿</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-3">Greenprint</h1>
      <p className="text-lg text-gray-500 mb-2 max-w-md">
        Discover your Behavioral Digital Carbon Index — a score that measures
        how much CO₂ your daily internet habits produce.
      </p>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        India-adjusted · Powered by AI · Takes 2 minutes
      </p>
      <button onClick={onStart}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold
                         px-8 py-3 rounded-full text-lg transition-colors">
        Check my score →
      </button>
      <p className="text-xs text-gray-300 mt-6">
        No account needed · No data stored · Open source
      </p>
    </div>
  )
}