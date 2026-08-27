# Adaptive Syllabus — External AI Question Extraction Template

Use this prompt with an external AI after OCR, PDF/image extraction, or manual collection of exam questions.

## Goal
Convert raw question material into clean, import-ready rows for Adaptive Syllabus without inventing facts. Preserve the original question, options and answer exactly where available; flag uncertainty instead of guessing.

## Input
Provide one or more of:
- OCR text
- copied question paper text
- images/PDF-derived text
- answer key
- source metadata
- official explanation/reference material

## Required output
Return **CSV only** using exactly these columns:

```csv
question_id,exam,stage,year,question,option_a,option_b,option_c,option_d,option_e,correct_option,node_id,subject,topic,subtopic,concept,explanation,key_fact,common_confusion,source,difficulty,question_type,expected_time_sec
```

## Processing rules
1. Do not hallucinate a missing option, answer, year, source, or explanation.
2. If the correct answer cannot be established, leave `correct_option` blank and explain the uncertainty in `common_confusion`.
3. Preserve question meaning. Fix only obvious OCR corruption and formatting errors.
4. Keep options aligned with their original labels A/B/C/D/E.
5. `node_id` must match the target syllabus exactly. Never invent a new node_id when a supplied syllabus is available.
6. Map the question to the **most specific concept-level node**.
7. `subject`, `topic`, and `subtopic` must be consistent with the node_id hierarchy.
8. Write `explanation` as a concise but exam-useful explanation: why the correct option is correct and, where useful, why the distractor is wrong.
9. `key_fact` should be a high-yield fact useful for revision.
10. `common_confusion` should capture a likely trap, exception, closely related concept, or factual ambiguity.
11. `difficulty` should be one of: easy, moderate, hard. Use moderate when uncertain.
12. `question_type` should normally be MCQ unless the source clearly indicates otherwise.
13. `expected_time_sec` should be realistic for the examination, normally 30–120 seconds.
14. Preserve source attribution such as `RPSC RAS 2024`, `UPSC CSE Prelims 2025`, etc.
15. Never combine two questions into one row.
16. Never silently discard a question. Put uncertain rows at the end and mark the uncertainty.

## Explanation format
For each question, aim for:
- Correct answer: one clear statement.
- Reasoning: 2–5 sentences.
- Exam trap: one sentence when applicable.

## Validation checklist before returning CSV
- Every row has a unique `question_id`.
- Correct option is A–E or blank.
- Every question has at least two options.
- Every mapped `node_id` exists in the supplied syllabus.
- Subject/topic/subtopic agree with the syllabus.
- No fabricated citations or facts.
- CSV quoting is valid; escape commas/newlines inside quoted fields.

## Preferred workflow
RAW QUESTION PAPER → OCR/CLEAN TEXT → ANSWER KEY ALIGNMENT → CONCEPT MAPPING → EXPLANATION → VALIDATION → CSV

Paste your syllabus node list below this prompt when the model needs exact concept mapping:

```text
[PASTE ADAPTIVE SYLLABUS NODE LIST HERE]
```
