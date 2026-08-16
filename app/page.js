export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px", fontFamily: "Arial, sans-serif", background: "#f8fafc" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Adaptive Syllabus</p>
        <h1 style={{ fontSize: 44, margin: "12px 0" }}>Learn what you actually know.</h1>
        <p style={{ fontSize: 19, lineHeight: 1.6, color: "#475569", maxWidth: 680 }}>
          A concept-level learning platform that maps syllabus → topics → subtopics → concepts → questions and turns performance into a personalized learning path.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 40 }}>
          {[
            ["01", "Structured syllabus"],
            ["02", "Concept-level questions"],
            ["03", "Performance backtracking"],
            ["04", "Personalized dashboard"],
          ].map(([number, title]) => (
            <div key={number} style={{ background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>{number}</div>
              <div style={{ fontWeight: 700, marginTop: 12 }}>{title}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 48, color: "#64748b" }}>MVP status: foundation ready.</p>
      </div>
    </main>
  );
}
