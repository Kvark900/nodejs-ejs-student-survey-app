SELECT l.*, s.name subject_name
FROM survey_copy.lecture l
JOIN survey_copy.subject s
  ON l.subject_id = s.id
WHERE l.subject_id = $1
