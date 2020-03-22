SELECT sq.*, s.name || ' ' || TO_CHAR(l.date_time :: date, 'DD.MM.YYYY hh:mm:ss') AS lecture
FROM survey_copy.student_question sq
         JOIN survey_copy.lecture l
              ON sq.lecture_id = l.id
         JOIN survey_copy.subject s
              ON l.subject_id = s.id
WHERE s.id IN (
    SELECT ss.subject_id
    FROM survey_copy.students_subjects ss
    WHERE ss.student_id = $1
)
ORDER BY sq.likes DESC
