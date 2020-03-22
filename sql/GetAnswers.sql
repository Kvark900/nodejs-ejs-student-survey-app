SELECT qa.*,
       s.name || ' ' || s.surname student,
       q.question
FROM survey_copy.question_answer qa
JOIN survey_copy.question q
  ON qa.question_id = q.id
JOIN survey_copy.lecture l
  ON q.lecture_id = l.id
LEFT JOIN survey_copy.student s
       ON s.id = qa.student_id
WHERE l.subject_id = $1
  AND q.lecture_id = coalesce($2, q.lecture_id)
  AND q.id = coalesce($3, q.id)
