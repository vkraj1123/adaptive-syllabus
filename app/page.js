"use client";

import { useMemo, useState } from "react";

const concepts = [
  {
    id: "article14",
    name: "Article 14 — Equality before law",
    subtopic: "Right to Equality",
    topic: "Fundamental Rights",
    questions: [
      {
        id: 1,
        text: "Article 14 of the Indian Constitution primarily guarantees:",
        options: [
          "Equality before law and equal protection of laws",
          "Freedom of speech and expression",
          "Protection of life and personal liberty",
          "Freedom of religion"
        ],
        answer: 0,
        explanation: "Article 14 guarantees equality before law and equal protection of the laws within the territory of India."
      },
      {
        id: 2,
        text: "The doctrine of reasonable classification is most directly associated with:",
        options: [
          "Article 14",
          "Article 19",
          "Article 21",
          "Article 32"
        ],
        answer: 0,
        explanation: "Article 14 permits reasonable classification, provided the classification has an intelligible differentia and a rational nexus with the objective."
      },
      {
        id: 3,
        text: "Which statement best describes 'equal protection of laws' under Article 14?",
        options: [
          "Identical treatment must always be given to everyone",
          "Persons similarly situated should receive similar treatment",
          "Only citizens receive its protection",
          "It applies only to criminal law"
        ],
        answer: 1,
        explanation: "Equal protection allows reasonable classification: similarly situated persons should be treated alike, while genuine differences may justify different treatment."
      },
      {
        id: 4,
        text: "Article 14 is available to:",
        options: [
          "Citizens only",
          "Foreigners only",
          "All persons, subject to constitutional limitations",
          "Only public servants"
        ],
        answer: 2,
        explanation: "Article 14 uses the expression 'any person', so its protection is not restricted to citizens."
      },
      {
        id: 5,
        text: "Which pair represents the two classic requirements of reasonable classification?",
        options: [
          "Popular approval and judicial approval",
          "Intelligible differentia and rational nexus",
          "Uniformity and certainty",
          "Majority rule and federalism"
        ],
        answer: 1,
        explanation: "Reasonable classification requires an intelligible differentia and a rational relation between that differentia and the object sought to be achieved."
      }
    ]
  }
];

const initialStats = { article14: { correct: 0, attempted: 0 } };

export default function Home() {
  const [view, setView] = useState("dashboard");
  const [stats, setStats] = useState(initialStats);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const concept = concepts[0];
  const stat = stats.article14;
  const mastery = stat.attempted ? Math.round((stat.correct / stat.attempted) * 100) : 0;

  const currentQuestion = concept.questions[questionIndex];
  const syllabusProgress = useMemo(() => Math.round((mastery * 0.35) + 52), [mastery]);

  function startPractice() {
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setView("practice");
  }

  function submitAnswer() {
    if (selected === null || submitted) return;
    const isCorrect = selected === currentQuestion.answer;
    setStats((old) => ({
      ...old,
      article14: {
        attempted: old.article14.attempted + 1,
        correct: old.article14.correct + (isCorrect ? 1 : 0)
      }
    }));
    setSubmitted(true);
  }

  function nextQuestion() {
    if (questionIndex === concept.questions.length - 1) {
      setView("concept");
      setQuestionIndex(0);
      setSelected(null);
      setSubmitted(false);
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <button style={styles.brand} onClick={() => setView("dashboard")}>Adaptive Syllabus</button>
        <div style={styles.headerRight}>
          <span style={styles.pill}>MVP • Demo data</span>
          <button style={styles.navButton} onClick={() => setView("syllabus")}>Syllabus</button>
          <button style={styles.navButton} onClick={startPractice}>Practice</button>
        </div>
      </header>

      <section style={styles.container}>
        {view === "dashboard" && (
          <>
            <div style={styles.hero}>
              <div>
                <p style={styles.eyebrow}>STUDENT DASHBOARD</p>
                <h1 style={styles.h1}>Know exactly what to study next.</h1>
                <p style={styles.subtitle}>Your performance is traced from questions back to concepts, subtopics and topics.</p>
              </div>
              <div style={styles.masteryCard}>
                <div style={styles.muted}>Overall syllabus progress</div>
                <div style={styles.bigNumber}>{syllabusProgress}%</div>
                <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${syllabusProgress}%` }} /></div>
              </div>
            </div>

            <div style={styles.grid4}>
              {[["Polity", "72%", "Good"], ["History", "61%", "On track"], ["Geography", "78%", "Strong"], ["Economy", "46%", "Needs work"]].map(([name, value, label]) => (
                <button key={name} style={styles.statCard} onClick={() => setView("syllabus")}>
                  <div style={styles.muted}>{name}</div>
                  <div style={styles.cardNumber}>{value}</div>
                  <div style={styles.cardLabel}>{label}</div>
                </button>
              ))}
            </div>

            <div style={styles.sectionHeader}>
              <div><p style={styles.eyebrow}>WEAKNESS MAP</p><h2 style={styles.h2}>Start with your weakest concept</h2></div>
              <button style={styles.primary} onClick={startPractice}>Practice weak area →</button>
            </div>

            <div style={styles.weakCard}>
              <div><div style={styles.tag}>FOCUS AREA</div><h3 style={styles.h3}>Article 14 — Equality before law</h3><p style={styles.muted}>Polity → Fundamental Rights → Right to Equality</p></div>
              <div style={styles.weakScore}><span>{mastery}%</span><small>{stat.attempted ? `${stat.attempted} attempts` : "Not attempted yet"}</small></div>
            </div>
          </>
        )}

        {view === "syllabus" && (
          <>
            <p style={styles.eyebrow}>SYLLABUS MAP</p>
            <h1 style={styles.h1}>Indian Polity</h1>
            <p style={styles.subtitle}>Tap through the hierarchy to reach the concept-level question bank.</p>
            <div style={styles.tree}>
              <div style={styles.treeItem}><span>Indian Polity</span><b>72%</b></div>
              <div style={styles.treeChild}><div style={styles.treeItem}><span>Fundamental Rights</span><b>68%</b></div><div style={styles.treeChild}><div style={styles.treeItem}><span>Right to Equality</span><b>{mastery}%</b></div><div style={styles.treeChild}><button style={styles.conceptButton} onClick={() => setView("concept")}><span>● Article 14 — Equality before law</span><b>Open →</b></button></div></div></div>
              <div style={styles.treeChild}><div style={styles.treeItem}><span>Directive Principles</span><b>64%</b></div></div>
              <div style={styles.treeChild}><div style={styles.treeItem}><span>Parliament</span><b>71%</b></div></div>
            </div>
          </>
        )}

        {view === "concept" && (
          <>
            <button style={styles.back} onClick={() => setView("syllabus")}>← Back to syllabus</button>
            <p style={styles.eyebrow}>CONCEPT</p>
            <h1 style={styles.h1}>Article 14 — Equality before law</h1>
            <p style={styles.subtitle}>Indian Polity → Fundamental Rights → Right to Equality</p>
            <div style={styles.conceptGrid}>
              <div style={styles.largeCard}><div style={styles.muted}>Mastery</div><div style={styles.bigNumber}>{mastery}%</div><div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${mastery}%` }} /></div><p style={styles.muted}>{stat.attempted} of {stat.attempted} attempted questions recorded in this demo.</p></div>
              <div style={styles.largeCard}><div style={styles.muted}>Question bank</div><div style={styles.bigNumber}>{concept.questions.length}</div><p style={styles.muted}>Tagged questions attached to this concept.</p><button style={styles.primary} onClick={startPractice}>Start practice →</button></div>
            </div>
          </>
        )}

        {view === "practice" && (
          <>
            <button style={styles.back} onClick={() => setView("concept")}>← Back to concept</button>
            <div style={styles.questionTop}><div><p style={styles.eyebrow}>ADAPTIVE PRACTICE</p><h1 style={styles.h1}>Question {questionIndex + 1} of {concept.questions.length}</h1></div><div style={styles.pill}>Article 14</div></div>
            <div style={styles.questionCard}>
              <h2 style={styles.question}>{currentQuestion.text}</h2>
              <div style={styles.options}>{currentQuestion.options.map((option, index) => { const chosen = selected === index; const correct = submitted && index === currentQuestion.answer; const wrong = submitted && chosen && index !== currentQuestion.answer; return <button key={option} onClick={() => !submitted && setSelected(index)} style={{ ...styles.option, ...(chosen ? styles.optionSelected : {}), ...(correct ? styles.optionCorrect : {}), ...(wrong ? styles.optionWrong : {}) }}><span>{String.fromCharCode(65 + index)}</span>{option}</button>; })}</div>
              {!submitted ? <button style={{ ...styles.primary, opacity: selected === null ? 0.5 : 1 }} onClick={submitAnswer}>Submit answer</button> : <div style={styles.feedback}><strong>{selected === currentQuestion.answer ? "Correct ✓" : "Not quite"}</strong><p>{currentQuestion.explanation}</p><button style={styles.primary} onClick={nextQuestion}>{questionIndex === concept.questions.length - 1 ? "Finish practice" : "Next question →"}</button></div>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f6f8fb", color: "#172033", fontFamily: "Arial, sans-serif" },
  header: { height: 68, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderBottom: "1px solid #e5e9f0", position: "sticky", top: 0, zIndex: 10 },
  brand: { border: 0, background: "transparent", fontWeight: 800, fontSize: 18, cursor: "pointer", color: "#172033" },
  headerRight: { display: "flex", gap: 8, alignItems: "center" },
  navButton: { border: 0, background: "transparent", padding: "9px 12px", cursor: "pointer", color: "#526071", fontWeight: 600 },
  pill: { padding: "6px 10px", borderRadius: 999, background: "#eef2f7", color: "#526071", fontSize: 12, fontWeight: 700 },
  container: { maxWidth: 1080, margin: "0 auto", padding: "44px 22px 80px" },
  hero: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "center", marginBottom: 30 },
  eyebrow: { fontSize: 12, letterSpacing: 1.5, fontWeight: 800, color: "#667085", margin: "0 0 10px" },
  h1: { fontSize: "clamp(32px, 6vw, 54px)", lineHeight: 1.05, margin: "0 0 14px", letterSpacing: -1.5 },
  h2: { fontSize: 27, margin: 0 },
  h3: { fontSize: 21, margin: "8px 0" },
  subtitle: { fontSize: 17, lineHeight: 1.6, color: "#667085", maxWidth: 700, margin: 0 },
  masteryCard: { background: "white", border: "1px solid #e2e7ef", borderRadius: 20, padding: 24, boxShadow: "0 10px 30px rgba(20,30,50,.05)" },
  muted: { color: "#667085", fontSize: 14, lineHeight: 1.5 },
  bigNumber: { fontSize: 44, fontWeight: 800, margin: "6px 0 14px" },
  progressTrack: { height: 8, borderRadius: 99, background: "#e8ecf2", overflow: "hidden" },
  progressFill: { height: "100%", background: "#172033", borderRadius: 99 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 50 },
  statCard: { textAlign: "left", background: "white", border: "1px solid #e2e7ef", borderRadius: 16, padding: 20, cursor: "pointer" },
  cardNumber: { fontSize: 28, fontWeight: 800, marginTop: 8 },
  cardLabel: { fontSize: 12, color: "#667085", marginTop: 6 },
  sectionHeader: { display: "flex", justifyContent: "space-between", gap: 20, alignItems: "end", marginBottom: 16 },
  primary: { border: 0, background: "#172033", color: "white", padding: "12px 16px", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
  weakCard: { background: "white", border: "1px solid #e2e7ef", borderRadius: 20, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 },
  tag: { display: "inline-block", background: "#fff2e8", color: "#a44a13", padding: "5px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800, letterSpacing: 1 },
  weakScore: { textAlign: "right", minWidth: 90 },
  tree: { marginTop: 28, background: "white", border: "1px solid #e2e7ef", borderRadius: 18, padding: 18 },
  treeItem: { display: "flex", justifyContent: "space-between", padding: "15px 14px", borderBottom: "1px solid #edf0f4", fontWeight: 700 },
  treeChild: { marginLeft: 20, borderLeft: "2px solid #edf0f4", paddingLeft: 10 },
  conceptButton: { width: "100%", display: "flex", justifyContent: "space-between", padding: 15, border: 0, borderRadius: 10, background: "#f4f6f9", cursor: "pointer", textAlign: "left", color: "#172033", fontWeight: 700 },
  back: { border: 0, background: "transparent", color: "#526071", padding: "0 0 24px", cursor: "pointer", fontWeight: 700 },
  conceptGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 },
  largeCard: { background: "white", border: "1px solid #e2e7ef", borderRadius: 18, padding: 24 },
  questionTop: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: 20 },
  questionCard: { marginTop: 28, background: "white", border: "1px solid #e2e7ef", borderRadius: 20, padding: "28px", maxWidth: 820 },
  question: { fontSize: 25, lineHeight: 1.4, margin: "0 0 24px" },
  options: { display: "grid", gap: 10, marginBottom: 20 },
  option: { display: "flex", gap: 12, alignItems: "center", width: "100%", textAlign: "left", padding: 15, borderRadius: 12, border: "1px solid #dfe4eb", background: "white", cursor: "pointer", color: "#172033", fontSize: 15 },
  optionSelected: { border: "2px solid #172033", background: "#f5f7fa" },
  optionCorrect: { border: "2px solid #257942", background: "#effaf2" },
  optionWrong: { border: "2px solid #b33a3a", background: "#fff2f2" },
  feedback: { marginTop: 18, padding: 18, borderRadius: 14, background: "#f5f7fa" }
};
