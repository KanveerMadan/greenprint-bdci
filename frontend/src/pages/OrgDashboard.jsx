import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CATEGORY_COLORS = {
  Low: "#16a34a",
  Moderate: "#ca8a04",
  High: "#ea580c",
  Critical: "#dc2626",
};

const SAMPLE_DATA = [
  { age_group: "19-25", city_tier: "Metro", profession: "Student", device_type: "Mobile only", income_level: "Low", netflix_hrs_day: 2.5, netflix_quality: "1080p", instagram_hrs_day: 3.0, call_on_hrs_day: 1.5, call_off_hrs_day: 2.0, emails_plain_day: 5, emails_attach_day: 2, cloud_upload_gb_day: 0.5, music_hrs_day: 2.0, ai_queries_day: 10, gaming_cloud_hrs: 0.5, gaming_mobile_hrs: 1.0, night_usage_pct: 0.65 },
  { age_group: "26-35", city_tier: "Tier2", profession: "IT Professional", device_type: "Both mobile and laptop", income_level: "Middle", netflix_hrs_day: 1.5, netflix_quality: "4K", instagram_hrs_day: 1.5, call_on_hrs_day: 3.0, call_off_hrs_day: 1.0, emails_plain_day: 35, emails_attach_day: 12, cloud_upload_gb_day: 2.0, music_hrs_day: 1.5, ai_queries_day: 25, gaming_cloud_hrs: 0.8, gaming_mobile_hrs: 0.3, night_usage_pct: 0.40 },
  { age_group: "36-50", city_tier: "Metro", profession: "Business", device_type: "Laptop only", income_level: "High", netflix_hrs_day: 1.0, netflix_quality: "4K", instagram_hrs_day: 1.0, call_on_hrs_day: 4.0, call_off_hrs_day: 0.5, emails_plain_day: 40, emails_attach_day: 15, cloud_upload_gb_day: 3.0, music_hrs_day: 0.5, ai_queries_day: 20, gaming_cloud_hrs: 0.2, gaming_mobile_hrs: 0.1, night_usage_pct: 0.25 },
  { age_group: "19-25", city_tier: "Rural", profession: "Student", device_type: "Mobile only", income_level: "Low", netflix_hrs_day: 3.0, netflix_quality: "SD", instagram_hrs_day: 4.0, call_on_hrs_day: 1.0, call_off_hrs_day: 3.0, emails_plain_day: 3, emails_attach_day: 1, cloud_upload_gb_day: 0.2, music_hrs_day: 3.0, ai_queries_day: 5, gaming_cloud_hrs: 0.1, gaming_mobile_hrs: 2.0, night_usage_pct: 0.70 },
  { age_group: "26-35", city_tier: "Metro", profession: "IT Professional", device_type: "Both mobile and laptop", income_level: "High", netflix_hrs_day: 2.0, netflix_quality: "4K", instagram_hrs_day: 2.0, call_on_hrs_day: 3.5, call_off_hrs_day: 0.8, emails_plain_day: 38, emails_attach_day: 14, cloud_upload_gb_day: 2.5, music_hrs_day: 1.0, ai_queries_day: 30, gaming_cloud_hrs: 1.0, gaming_mobile_hrs: 0.5, night_usage_pct: 0.45 },
  { age_group: "51+", city_tier: "Tier2", profession: "Teacher", device_type: "Laptop only", income_level: "Middle", netflix_hrs_day: 0.5, netflix_quality: "1080p", instagram_hrs_day: 0.5, call_on_hrs_day: 2.0, call_off_hrs_day: 2.0, emails_plain_day: 20, emails_attach_day: 5, cloud_upload_gb_day: 0.3, music_hrs_day: 0.5, ai_queries_day: 5, gaming_cloud_hrs: 0.0, gaming_mobile_hrs: 0.0, night_usage_pct: 0.20 },
  { age_group: "19-25", city_tier: "Metro", profession: "Gig Worker", device_type: "Mobile only", income_level: "Low", netflix_hrs_day: 2.0, netflix_quality: "SD", instagram_hrs_day: 3.5, call_on_hrs_day: 2.5, call_off_hrs_day: 1.5, emails_plain_day: 8, emails_attach_day: 3, cloud_upload_gb_day: 1.0, music_hrs_day: 3.0, ai_queries_day: 8, gaming_cloud_hrs: 0.3, gaming_mobile_hrs: 1.5, night_usage_pct: 0.60 },
  { age_group: "36-50", city_tier: "Rural", profession: "Homemaker", device_type: "Mobile only", income_level: "Low", netflix_hrs_day: 1.5, netflix_quality: "SD", instagram_hrs_day: 2.0, call_on_hrs_day: 1.0, call_off_hrs_day: 3.0, emails_plain_day: 2, emails_attach_day: 0, cloud_upload_gb_day: 0.1, music_hrs_day: 1.0, ai_queries_day: 2, gaming_cloud_hrs: 0.0, gaming_mobile_hrs: 0.5, night_usage_pct: 0.20 },
];

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e7eb" }}>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || "#111827" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function BarSection({ title, data }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e7eb" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>{title}</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v} BDCI`, "Avg score"]} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill="#16a34a" opacity={0.7 + i * 0.06} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function OrgDashboard() {
  const [report, setReport]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [orgName, setOrgName]   = useState("");
  const [usingSample, setUsingSample] = useState(false);

  async function runReport(rows, name) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/org-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setReport(data);
      setOrgName(name);
    } catch (e) {
      setError("Failed to generate report. Check your API connection.");
    }
    setLoading(false);
  }

  function handleSampleDemo() {
    setUsingSample(true);
    runReport(SAMPLE_DATA, "Demo Organisation");
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = JSON.parse(ev.target.result);
        runReport(rows, file.name.replace(".json", ""));
      } catch {
        setError("Invalid JSON file. Please upload a valid employee survey JSON.");
      }
    };
    reader.readAsText(file);
  }

  const categoryData = report
    ? Object.entries(report.category_breakdown).map(([k, v]) => ({ name: k, value: v }))
    : [];

  const cityData = report
    ? Object.entries(report.by_city_tier).map(([k, v]) => ({ name: k, value: v }))
    : [];

  const profData = report
    ? Object.entries(report.by_profession).map(([k, v]) => ({ name: k, value: v }))
    : [];

  const deviceData = report
    ? Object.entries(report.by_device).map(([k, v]) => ({ name: k, value: v }))
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#16a34a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 16 }}>🌿</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>GreenPrint</span>
          <span style={{ fontSize: 12, background: "#dcfce7", color: "#16a34a", borderRadius: 20, padding: "2px 10px", fontWeight: 500 }}>Org Dashboard</span>
        </div>
        <a href="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Individual assessment</a>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {!report ? (
          /* Upload screen */
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              Organisation Carbon Report
            </h1>
            <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
              Upload your employee survey responses to get a full digital carbon breakdown by city tier, profession, and device type. Built for ESG officers and sustainability teams.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Demo */}
              <div style={{ border: "2px dashed #16a34a", borderRadius: 16, padding: 32, textAlign: "center", cursor: "pointer", background: "#f0fdf4" }}
                onClick={handleSampleDemo}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#15803d", marginBottom: 6 }}>Try sample demo</div>
                <div style={{ fontSize: 13, color: "#16a34a" }}>See a demo report with 8 sample employees instantly</div>
              </div>

              {/* Upload */}
              <label style={{ border: "2px dashed #d1d5db", borderRadius: 16, padding: 32, textAlign: "center", cursor: "pointer", display: "block", background: "#f9fafb" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#374151", marginBottom: 6 }}>Upload employee JSON</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Upload a JSON file of employee survey responses</div>
                <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
              </label>
            </div>

            {loading && (
              <div style={{ textAlign: "center", marginTop: 32, color: "#16a34a", fontSize: 15 }}>
                Generating report...
              </div>
            )}
            {error && (
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>
                {error}
              </div>
            )}
          </div>
        ) : (
          /* Report screen */
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  {orgName}
                </h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Digital carbon footprint report · BDCI Framework</p>
              </div>
              <button onClick={() => { setReport(null); setUsingSample(false); }}
                style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151" }}>
                New report
              </button>
            </div>

            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
              <StatCard label="Total employees" value={report.total_employees} />
              <StatCard
                label="Avg BDCI score"
                value={report.avg_bdci}
                sub="out of 100"
                color={report.avg_bdci > 75 ? "#dc2626" : report.avg_bdci > 50 ? "#ea580c" : report.avg_bdci > 25 ? "#ca8a04" : "#16a34a"}
              />
              <StatCard
                label="Highest risk group"
                value={Object.entries(report.category_breakdown).sort((a, b) => b[1] - a[1])[0]?.[0]}
                sub={`${Object.entries(report.category_breakdown).sort((a, b) => b[1] - a[1])[0]?.[1]} employees`}
                color="#dc2626"
              />
            </div>

            {/* Category breakdown */}
            <div style={{ background: "#f9fafb", borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e7eb", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Category breakdown</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {categoryData.map(({ name, value }) => (
                  <div key={name} style={{ flex: 1, minWidth: 100, background: "#fff", borderRadius: 10, padding: "12px 16px", border: `2px solid ${CATEGORY_COLORS[name] || "#e5e7eb"}`, textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: CATEGORY_COLORS[name] }}>{value}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <BarSection title="Avg BDCI by city tier" data={cityData} />
              <BarSection title="Avg BDCI by device type" data={deviceData} />
            </div>
            <BarSection title="Avg BDCI by profession" data={profData} />

            {/* Intervention insight */}
            <div style={{ marginTop: 20, background: "#f0fdf4", borderRadius: 12, padding: "16px 20px", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#15803d", marginBottom: 6 }}>Intervention estimate</div>
              <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
                If 40% of your <strong>{Object.entries(report.category_breakdown).sort((a,b) => b[1]-a[1])[0]?.[0]}</strong>-category
                employees adopt 2 nudges each, your organisation's average BDCI could drop by approximately{" "}
                <strong>{Math.round(report.avg_bdci * 0.15)}–{Math.round(report.avg_bdci * 0.22)} points</strong> over 4 weeks.
              </div>
            </div>

            {usingSample && (
              <div style={{ marginTop: 12, padding: "10px 16px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
                Showing demo data. Upload a real employee JSON file for your organisation's actual report.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
