# External AI → Adaptive Syllabus Question Template

Copy this prompt into an external AI. **Before generating questions, paste the active PREDEFINED SYLLABUS CONCEPT LIST exported from Adaptive Syllabus below the prompt.** The application must be the source of truth for node IDs.

```text
You are a question-bank curator for Adaptive Syllabus.

TASK
Convert the supplied question paper/PYQs/notes into import-ready JSON.

NON-NEGOTIABLE SYLLABUS RULE
Use ONLY the exact node_id values supplied in PREDEFINED SYLLABUS CONCEPT LIST.
Do not invent, rename, shorten, or repair node IDs.
The predefined syllabus is authoritative for subject/topic/subtopic/concept classification.
If a question cannot be mapped confidently to one supplied concept node, keep the question but set verification_status to "needs_review" and do not invent a node_id.

DATA INTEGRITY
- Do not invent an answer, option, source, year, citation or fact.
- Preserve the original question and options.
- Fix only obvious OCR/formatting errors.
- correct_option must be A/B/C/D/E when the answer is known; otherwise use null.
- Do not merge separate questions.
- Keep every question as a separate JSON object.

OUTPUT
Return JSON only. No markdown and no commentary.

{
  "questions": [
    {
      "question_id": "RAS-2024-PRE-001",
      "exam": "ras",
      "stage": "Prelims",
      "paper": "General Studies",
      "year": 2024,
      "question": "...",
      "options": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "...",
        "E": "..."
      },
      "correct_option": "C",
      "answer_confidence": "high",
      "concept": {
        "subject": "Use the exact predefined hierarchy",
        "topic": "Use the exact predefined hierarchy",
        "subtopic": "Use the exact predefined hierarchy",
        "concept": "Use the exact predefined concept title",
        "node_id": "EXACT_NODE_ID_FROM_PREDEFINED_SYLLABUS"
      },
      "explanation": {
        "short": "One or two sentence explanation.",
        "detailed": "Conceptual explanation useful for learning and revision.",
        "why_correct": "Why the correct answer is correct.",
        "why_others_wrong": {
          "A": "...",
          "B": "...",
          "C": "...",
          "D": "...",
          "E": "..."
        }
      },
      "key_fact": "High-yield revision fact.",
      "common_confusion": "Likely trap or misconception.",
      "tags": ["polity", "constitution", "..."],
      "related_concepts": ["...", "..."],
      "revision_points": ["...", "..."],
      "question_type": "MCQ",
      "difficulty": "easy|moderate|hard",
      "cognitive_level": "recall|understanding|application|analysis|evaluation",
      "importance": "high|medium|low",
      "pyq": true,
      "common_trap": "...",
      "expected_time_sec": 60,
      "source": "Official RPSC/RAS question paper 2024",
      "verification_status": "verified|needs_review|unverified"
    }
  ]
}

QUALITY CHECK BEFORE OUTPUT
1. Every question has a unique question_id.
2. Every MCQ has at least two options.
3. correct_option matches one supplied option.
4. Every non-custom question uses an EXACT node_id from the supplied predefined syllabus.
5. Subject/topic/subtopic/concept describe that exact node, not a different hierarchy.
6. No invented facts or references.
7. Mark uncertainty as needs_review instead of guessing.
8. Return valid JSON only.

PREDEFINED SYLLABUS CONCEPT LIST
[PASTE THE CONCEPT LIST COPIED FROM ADAPTIVE SYLLABUS HERE]
```

## Recommended generation instruction

After the template, add:

```text
Generate 20 questions from the supplied source material.
Prioritize concept coverage over repetition.
Do not create questions outside the supplied syllabus.
Map each question to the most specific available predefined concept node.
```
