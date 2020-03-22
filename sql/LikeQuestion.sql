UPDATE survey_copy.student_question
SET likes = likes + 1
WHERE id = $1
