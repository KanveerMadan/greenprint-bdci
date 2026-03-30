import { useState } from "react"
import Landing from "./pages/Landing"
import Assessment from "./pages/Assessment"
import Results from "./pages/Results"
import OrgDashboard from "./pages/OrgDashboard"

export default function App() {
  const [page, setPage] = useState(
    window.location.pathname === "/org" ? "org" : "landing"
  )
  const [results, setResults] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {page === "landing"    && <Landing    onStart={() => setPage("assessment")} onOrg={() => setPage("org")} />}
      {page === "assessment" && <Assessment onResults={(r) => { setResults(r); setPage("results") }} />}
      {page === "results"    && <Results    results={results} onRetake={() => setPage("assessment")} />}
      {page === "org"        && <OrgDashboard />}
    </div>
  )
}
