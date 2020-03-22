INSERT INTO survey_copy.question_answer (question_id, date_of_answer, answer, student_id, employee_id)
VALUES ($1, current_date, $2, $3, $4)
