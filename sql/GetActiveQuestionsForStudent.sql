SELECT q.id,
       q.question,
       q.active,
       q.type_id           AS type_id,
       qt.name             AS q_type,
       qc.name             AS q_category,
       json_agg(mc.answer) AS options
FROM survey_copy.question q
         JOIN survey_copy.lecture l
              ON q.lecture_id = l.id
         JOIN survey_copy.question_type qt
              ON q.type_id = qt.id
         JOIN survey_copy.question_category qc
              ON q.category_id = qc.id
         LEFT JOIN survey_copy.multiple_choices mc
                   ON q.id = mc.question_id
WHERE l.subject_id IN (
    SELECT ss.subject_id
    FROM survey_copy.students_subjects ss
    WHERE ss.student_id = $1
)
  AND q.id NOT IN (
    SELECT qa.question_id
    FROM survey_copy.question_answer qa
    WHERE qa.student_id = $1
)
  AND q.active = TRUE
GROUP BY q.id, q.question, q.active, q.type_id, qt.name, qc.name
