SELECT sr.id, sr.year, su.name subject_name
FROM survey_copy.survey sr
JOIN survey_copy.subject su
ON sr.subject_id = su.id;
