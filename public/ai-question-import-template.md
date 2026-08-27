# Adaptive Syllabus — External AI Question Import Template

Use this prompt with an external AI after OCR/PDF extraction. Return **CSV only**, with the exact header below. One question per row. Do not invent facts, answers, sources, or syllabus node IDs. If a field is unknown, leave it blank.

## Required CSV header

question_id,exam,stage,year,question,option_a,option_b,option_c,option_d,option_e,correct_option,node_id,subject,topic,subtopic,concept,explanation,key_fact,common_confusion,source,difficulty,question_type,expected_time_sec

## Rules

1. Preserve the question and options faithfully.
2. `correct_option` must be A, B, C, D or E.
3. `node_id` must exactly match an existing concept node from the selected exam's syllabus.
4. Use `difficulty`: easy, moderate, or hard.
5. `question_type` should normally be MCQ.
6. `expected_time_sec` should be a realistic estimate.
7. Escape commas and quotes using standard CSV quoting.
8. Do not include Markdown fences or commentary around the CSV.
9. `explanation`, `key_fact`, and `common_confusion` should be concise but useful for relearning.
10. If the answer cannot be verified from the source, leave `correct_option` blank rather than guessing.

## AI prompt

Convert the supplied question material into the Adaptive Syllabus CSV format above. Map every question to the most specific existing concept-level `node_id` supplied by the application's syllabus. Keep source/year information when available. Return CSV only.
