SELECT sq.*, s.name || ' ' || TO_CHAR(l.date_time :: date, 'DD.MM.YYYY hh:mm:ss') AS lecture
FROM survey_copy.student_question sq
         JOIN survey_copy.lecture l
              ON sq.lecture_id = l.id
         JOIN survey_copy.subject s
              ON l.subject_id = s.id
WHERE sq.lecture_id = $1
  AND sq.id NOT IN (SELECT ta.student_question_id FROM survey_copy.teacher_answer ta)
ORDER BY sq.likes DESC
