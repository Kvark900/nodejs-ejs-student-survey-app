UPDATE survey_copy.question
SET  question = $1,
     type_id = $2,
     category_id = $3,
     lecture_id = $4
where id = $5
