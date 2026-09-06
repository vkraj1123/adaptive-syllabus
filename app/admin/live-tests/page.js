"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCloudProfile, supabase } from "../../lib/supabase";

const exams = { ras: "RAS", upsc: "UPSC CSE", ssc_cgl: "SSC CGL", banking: "Banking", police: "Police SI", neet: "NEET UG" };
const card = { background: "#fff", border: "1px solid #dfe5ed", borderRadius: 14, padding: 18, marginBottom: 16 };
const btn = { border: "1px solid #cfd7e3", borderRadius: 9, padding: "9px 13px", background: "#fff", cursor: "pointer" };
const primary = { ...btn, background: "#172033", color: "#fff", borderColor: "#172033" };

function date(value) {
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function answerChoice(selected) {
  if (selected === null || selected === undefined) return "Unanswered";
  return `Selected ${String.fromCharCode(65 + Number(selected))}`;
}

function weakText(items) {
  return items.map((item) => `${item.label} (${item.accuracy}%)`).join(" • ");
}

export default function AdminLiveTests() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weak, setWeak] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [participantDetails, setParticipantDetails] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function token() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const profile = await getCloudProfile();
      if (!profile || profile.role !== "admin") {
        router.replace("/");
        return;
      }
      const response = await fetch("/api/admin/live-tests", {
        headers: { Authorization: `Bearer ${await token()}` },
        cache: "no-store"
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to load tests.");
      setTests(body.tests || []);
    } catch (error) {
      setMessage(error?.message || "Unable to load test history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function view(test) {
    setSelected(test);
    setStudent(null);
    setWeak([]);
    setQuestions([]);
    setParticipantDetails([]);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/live-tests?testId=${test.id}`, {
        headers: { Authorization: `Bearer ${await token()}` },
        cache: "no-store"
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to load analysis.");
      setSelected(body.test);
      setWeak(body.weakTopics || []);
      setQuestions(body.questionAnalysis || []);
      setParticipantDetails(body.participantDetails || []);
    } catch (error) {
      setMessage(error?.message || "Unable to load analysis.");
    }
  }

  if (loading) {
    return <main style={{ padding: 30, fontFamily: "system-ui" }}>Loading live-test analysis…</main>;
  }

  const now = Date.now();

  return (
    <main style={{ minHeight: "100vh", background: "#f6f8fb", color: "#172033", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <button style={btn} onClick={() => router.push("/admin")}>← Admin</button>
            <h1 style={{ marginBottom: 4 }}>Live Test Analysis</h1>
            <p style={{ color: "#58657a", marginTop: 0 }}>Cohort performance, weak topics and individual participant drill-down.</p>
          </div>
          <button style={btn} onClick={load}>↻ Refresh</button>
        </div>

        {message && <div style={card}>{message}</div>}

        <section style={card}>
          <h2>Test history</h2>
          {tests.length ? (
            tests.map((test) => {
              const ended = new Date(test.end_at).getTime() < now;
              const live = new Date(test.start_at).getTime() <= now && !ended;
              return (
                <div key={test.id} style={{ padding: "15px 0", borderTop: "1px solid #edf0f4", display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 420px" }}>
                    <b>{test.title}</b>
                    <div style={{ fontSize: 13, color: "#667085", marginTop: 4 }}>{exams[test.exam] || test.exam} • {test.description || "No description"}</div>
                    <small>{date(test.start_at)} → {date(test.end_at)}</small>
                  </div>
                  <div style={{ minWidth: 230 }}>
                    <b>{live ? "🔴 LIVE" : ended ? "✓ COMPLETED" : "🕒 UPCOMING"}</b>
                    <div style={{ fontSize: 13, marginTop: 4 }}>{test.participantCount} submitted • {test.attemptCount} attempts • Avg {test.averageScore}</div>
                    <button style={{ ...primary, marginTop: 8 }} onClick={() => view(test)}>Analyze →</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No live tests have been recorded yet.</p>
          )}
        </section>

        {selected && (
          <section style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ marginBottom: 4 }}>{selected.title}</h2>
                <p style={{ marginTop: 0, color: "#667085" }}>{exams[selected.exam] || selected.exam} • {selected.questionCount || 0} questions</p>
              </div>
              <button style={btn} onClick={() => setSelected(null)}>Close</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, margin: "15px 0" }}>
              {[["Participants", selected.participantCount], ["Average", selected.averageScore], ["Highest", selected.highestScore], ["Questions", selected.questionCount || 0]].map((item) => (
                <div key={item[0]} style={{ ...card, margin: 0 }}>
                  <small>{item[0]}</small>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{item[1]}</div>
                </div>
              ))}
            </div>

            <h3>🔴 Weak topics & concepts</h3>
            <p style={{ fontSize: 13, color: "#667085" }}>Lowest accuracy first; student count shows how widespread the weakness is.</p>
            {weak.length ? (
              weak.slice(0, 12).map((item, index) => (
                <div key={item.node_id || index} style={{ padding: 13, borderTop: "1px solid #edf0f4", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <b>{item.label}</b>
                    <div style={{ fontSize: 12, color: "#667085" }}>{item.questions} questions • {item.attempts} responses • {item.students} students affected</div>
                  </div>
                  <b style={{ fontSize: 18 }}>{item.accuracy}%</b>
                </div>
              ))
            ) : (
              <p>No submitted answers yet.</p>
            )}

            <h3 style={{ marginTop: 26 }}>Question performance</h3>
            {questions.slice().sort((a, b) => a.accuracy - b.accuracy).slice(0, 15).map((question) => (
              <div key={question.id} style={{ padding: 12, borderTop: "1px solid #edf0f4" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <b>Q{question.number} • {question.label}</b>
                  <b>{question.accuracy}%</b>
                </div>
                <small>{question.correct} correct • {question.wrong} wrong • {question.unanswered} unanswered</small>
                <div style={{ fontSize: 13, marginTop: 5 }}>{question.question}</div>
              </div>
            ))}

            <h3 style={{ marginTop: 26 }}>Participant performance</h3>
            {selected.participants?.length ? (
              selected.participants.map((participant, index) => {
                const detail = participantDetails.find((item) => item.id === participant.id);
                return (
                  <div key={participant.id} style={{ padding: 13, borderTop: "1px solid #edf0f4", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <b>#{index + 1} {participant.student?.name || "Student"}</b>
                      <div style={{ fontSize: 12, color: "#667085" }}>{participant.student?.user_id || ""} • {participant.correct} correct • {participant.wrong} wrong • {participant.unanswered} unanswered • {participant.accuracy}% accuracy</div>
                      {participant.weakAreas?.length > 0 && <div style={{ fontSize: 12, marginTop: 4 }}>Weak: {weakText(participant.weakAreas)}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <b>{participant.score}</b>
                      <button style={btn} onClick={() => setStudent(detail || null)}>Detailed performance</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No participant has submitted this test yet.</p>
            )}

            {student && (
              <div style={{ ...card, marginTop: 18, border: "2px solid #dfe5ed" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <h3 style={{ marginTop: 0 }}>{student.name}</h3>
                    <small>{student.user_id}</small>
                  </div>
                  <button style={btn} onClick={() => setStudent(null)}>Close</button>
                </div>
                <h4>Wrong / unanswered questions</h4>
                {student.answers.filter((answer) => !answer.correct).map((answer) => (
                  <div key={answer.id} style={{ padding: 12, borderTop: "1px solid #edf0f4" }}>
                    <b>Q{answer.number} • {[answer.subject, answer.topic, answer.concept].filter(Boolean).join(" • ") || "Unmapped"}</b>
                    <div style={{ marginTop: 5 }}>{answer.question}</div>
                    <small>{answerChoice(answer.selected)} • Correct {answer.correctOption || "—"}</small>
                    {answer.explanation && <p style={{ color: "#58657a", lineHeight: 1.5 }}>{answer.explanation}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
