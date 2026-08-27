# Adaptive Syllabus — Custom Exam Syllabus Generator Template

Use this prompt with an external AI to transform an official notification/syllabus into a deep, concept-level Adaptive Syllabus.

## Objective
Build a complete, hierarchical, revision-friendly syllabus for a custom competitive examination from the **official notification/syllabus as the primary source**.

## Input
Paste or attach:
1. Official examination notification.
2. Official syllabus.
3. Exam pattern/marking scheme.
4. Previous-year papers, if available.
5. Official answer keys, if available.
6. Optional coaching/reference material — use only as supplementary context.

## Non-negotiable source hierarchy
1. Official notification/syllabus.
2. Official previous-year papers/answer keys.
3. Official commission/board documents.
4. Reputable secondary sources.
5. Coaching/reference material.

Never let a secondary source override the official syllabus. Flag conflicts.

## Required hierarchy
Build:

```text
EXAM
└── STAGE/PAPER
    └── SUBJECT
        └── TOPIC
            └── SUBTOPIC
                └── CONCEPT
                    ├── Definition / core idea
                    ├── Related concepts
                    ├── PYQ linkage
                    ├── Common traps
                    └── Current-affairs linkage (if relevant)
```

The minimum importable level is `concept`. Do not stop at broad headings such as “Polity”, “History”, or “Science”. Decompose them into atomic concepts that can be individually learned, tested, revised and scored.

## Required output
Return **JSON only** with this schema:

```json
{
  "exam": "",
  "official_source": "",
  "source_date": "",
  "version": 1,
  "stages": [
    {
      "stage_id": "",
      "title": "",
      "papers": [
        {
          "paper_id": "",
          "title": "",
          "subjects": [
            {
              "subject_id": "",
              "title": "",
              "topics": [
                {
                  "topic_id": "",
                  "title": "",
                  "subtopics": [
                    {
                      "subtopic_id": "",
                      "title": "",
                      "concepts": [
                        {
                          "concept_id": "",
                          "title": "",
                          "description": "",
                          "official_syllabus_basis": "",
                          "related_concepts": [],
                          "pyq_tags": [],
                          "current_affairs_relevance": "low|medium|high",
                          "priority": "low|medium|high",
                          "confidence": "official|strong_inference|uncertain"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "ambiguities": [],
  "coverage_notes": []
}
```

## Concept decomposition rules
- One concept should represent one learnable/testable unit.
- Split compound syllabus bullets into separate concepts.
- Preserve official wording in `official_syllabus_basis`.
- Use `description` to clarify scope without expanding beyond evidence.
- Do not create concepts merely because a coaching source teaches them.
- If an official heading is broad but PYQs clearly reveal recurring subareas, add them as `strong_inference` and explain why.
- Mark genuinely uncertain interpretations as `uncertain`.
- Avoid duplicate concepts across subjects; when unavoidable, use distinct context-specific node IDs.

## PYQ-driven refinement
If previous-year papers are supplied:
1. Map every PYQ to the most specific concept.
2. Identify concepts repeatedly tested.
3. Identify concepts that are in the syllabus but not yet seen in PYQs.
4. Tag recurring concepts with their years.
5. Do not infer that “not asked before” means “not important”.

## Adaptive-learning metadata
For each concept, calculate or classify:
- `priority`: syllabus importance + PYQ frequency + exam weightage + current relevance.
- `current_affairs_relevance`: likelihood that current events can create questions.
- `confidence`: how strongly the concept is supported by official material.

Do not fabricate numerical probabilities unless the user explicitly asks for them.

## Validation checklist
Before returning:
- Every stage/paper from the official pattern is represented.
- Every official syllabus heading is represented.
- No official heading is silently omitted.
- Every topic has at least one subtopic/concept unless the official wording is already atomic.
- IDs are unique and stable.
- IDs use lowercase snake_case or dot hierarchy.
- No duplicate concept nodes.
- All PYQs map to a concept where possible.
- Ambiguities and source conflicts are explicitly reported.

## Final quality test
Ask internally:
> “Could a student mark this concept as learned/not learned, answer a question against it, attach PYQs to it, and schedule spaced revision for it?”

If not, decompose the concept further.

## Input material
```text
[PASTE OFFICIAL NOTIFICATION/SYLLABUS/PYQs HERE]
```
