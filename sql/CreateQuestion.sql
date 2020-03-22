INSERT INTO survey_copy.question (question, type_id, category_id, lecture_id)
VALUES ($1, $2, $3, $4)
RETURNING id
