# Adaptive Syllabus External-AI Template

Use any OCR/AI tool BEFORE importing into Adaptive Syllabus. The AI must output structured JSON/CSV only. Do not ask Adaptive Syllabus to classify or explain content.

## A. SYLLABUS RECORD
Required columns:
`exam,stage,node_id,parent_id,level,subject,topic,subtopic,concept,title,description,weight`

Hierarchy:
`subject > topic > subtopic > concept`

Rules:
- `node_id` must be stable and unique within an exam.
- `parent_id` points to the immediate parent node.
- `level` is one of `subject,topic,subtopic,concept`.
- Preserve the official exam syllabus wording where possible.
- Do not merge distinct concepts merely because they look similar.
- `weight` is an optional importance multiplier.

Example:
`ras,Prelims,polity.federalism.centre_state.finance_commission,polity.federalism.centre_state,concept,Indian Polity & Constitution,Federalism,Centre-State Relations,Finance Commission,Constitutional distribution of financial resources,1`

## B. QUESTION RECORD
Required columns:
`question_id,exam,stage,year,question,option_a,option_b,option_c,option_d,option_e,correct_option,node_id,subject,topic,subtopic,concept,explanation,key_fact,common_confusion,source,difficulty,question_type,expected_time_sec`

Rules:
- Map every question to the deepest known `node_id`.
- Never invent a concept when the source does not support one; leave it blank and flag for review.
- Explanation, key fact and common confusion are prepared externally and stored as source material.
- `expected_time_sec` is a benchmark, not the user's actual time.
- Correct option must be A-E or 1-5.

## C. IMPORT CONTRACT
Adaptive Syllabus itself performs deterministic validation:
1. required fields
2. valid answer/options
3. exam exists
4. node_id exists
5. parent/child hierarchy is valid
6. question references a valid concept/node

Invalid rows are rejected or placed in a review queue; no runtime AI is used to repair them.

## D. EXTERNAL AI PROMPT
"Convert the supplied exam syllabus/questions into the exact schema above. Preserve wording and factual content. Build a hierarchical syllabus down to concept level where the source supports it. Assign stable node_id values. Map each question to the deepest supported node. Generate concise explanation, key_fact and common_confusion only from the supplied material. Return valid JSON/CSV and a separate validation_errors array. Do not omit records and do not invent unsupported facts."
