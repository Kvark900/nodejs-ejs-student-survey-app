SELECT q.question, qa.*
FROM survey_copy.question_answer qa
JOIN survey_copy.question q
  ON qa.question_id = q.id
WHERE qa.student_id = $1
ORDER BY qa.date_of_answer DESC
