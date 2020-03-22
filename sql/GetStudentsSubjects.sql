SELECT s.*
FROM survey_copy.subject s
         JOIN survey_copy.students_subjects ss
              ON s.id = ss.subject_id
WHERE ss.student_id = $1
