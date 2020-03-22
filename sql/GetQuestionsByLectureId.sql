SELECT q.*,
       t.name AS type,
       c.name AS category,
       json_agg(mc.answer) AS options
FROM survey_copy.question q
JOIN survey_copy.question_category c
  ON q.category_id = c.id
JOIN survey_copy.question_type t
  ON q.type_id = t.id
LEFT JOIN survey_copy.multiple_choices mc
       ON q.id = mc.question_id
WHERE lecture_id = $1
GROUP BY q.id, q.question, q.lecture_id, q.type_id, q.category_id, t.name, c.name;
