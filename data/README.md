# Adaptive Syllabus data architecture

## Predefined exams
`predefined-exams.json` contains starter exam profiles. These are deliberately marked for verification against current official notifications before being treated as authoritative.

## External AI syllabus pipeline
1. Obtain the current official syllabus.
2. Feed it to an external OCR/AI tool.
3. Ask the tool to convert it into the concept-level schema used by Adaptive Syllabus.
4. Review/approve the generated syllabus.
5. Import it as an exam-specific syllabus.

## Stable IDs
Every concept must have a stable `node_id`. Questions reference the concept by `node_id`, not by display text. This prevents renamed labels from breaking historical user analytics.

## Multi-user principle
Exam/syllabus data is shared read-only catalogue data. User profiles, attempts, answers, timings, mastery and relearning state are user-scoped. A production deployment should persist the user-scoped model in a database keyed by `userId` and enforce authorization server-side.
