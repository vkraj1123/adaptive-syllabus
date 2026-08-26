export function updatePerformance(prev, question, correct, now = Date.now()) {
  if (!question?.subject || !question?.topic) return prev;
  const keys = new Set([`${question.subject}|${question.topic}`]);
  if (question.subtopic) keys.add(`${question.subject}|${question.topic}|${question.subtopic}`);
  const next = {...prev};
  keys.forEach(key => {
    const old = next[key] || {correct:0,total:0,lastAttempt:null,streak:0,wrong:0};
    next[key] = {
      correct: old.correct + (correct ? 1 : 0), total: old.total + 1,
      wrong: old.wrong + (correct ? 0 : 1), lastAttempt: now,
      streak: correct ? old.streak + 1 : 0
    };
  });
  return next;
}

export function accuracy(stat) { return stat?.total ? stat.correct / stat.total : null; }

export function weaknessScore(stat, now = Date.now()) {
  if (!stat?.total) return null;
  const acc = accuracy(stat);
  const days = stat.lastAttempt ? Math.max(0, (now - stat.lastAttempt) / 86400000) : 30;
  const recency = Math.min(days / 30, 1);
  const exposure = Math.min(stat.total / 20, 1);
  return Math.round(((1 - acc) * 0.65 + recency * 0.2 + (1 - exposure) * 0.15) * 100);
}

export function priority(stat, weight = 1, now = Date.now()) {
  const w = weaknessScore(stat, now);
  return w == null ? null : Math.round(w * weight);
}

export function weakKeys(attempts, threshold = 50) {
  return Object.entries(attempts || {}).filter(([,s]) => weaknessScore(s) >= threshold).sort((a,b) => weaknessScore(b[1]) - weaknessScore(a[1])).map(([k]) => k);
}
