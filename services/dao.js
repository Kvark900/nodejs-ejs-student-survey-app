const dbConfig = require("../config/dbConfig");
const Answer = require("../model/Answer");
const StudentQuestion = require("../model/StudentQuestion");
const TeacherAnswer = require("../model/TeacherAnswer");


//TODO: ****REMOVE HARDCODED QUERIES AND QUERIES NAMES


async function getSubjects() {
  try {
    let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.subject;");
    console.info(new Date() + ": Getting subjects success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function getQuestions() {
  try {
    let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.question;");
    console.info(new Date() + ": Getting question success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}


async function postSurvey(year, subject_id) {
  try {
    await dbConfig.pool.query(
        "INSERT INTO survey_copy.survey (year, subject_id) " +
        "VALUES ($1, $2);", [year, subject_id]
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function postLecture(timestamp, subject_id) {
  try {
    await dbConfig.pool.query(
        "INSERT INTO survey_copy.lecture (date_time, subject_id) " +
        "VALUES ($1, $2);", [timestamp, subject_id]
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}


async function getSurveys() {
  try {
    let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.survey;");
    console.info(new Date() + ": Getting surveys success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function getSurveysWithSubjectNames() {
  try {
    let queryResult = await dbConfig.pool.query(
        "SELECT sr.id, sr.year, su.name subject_name " +
        "FROM survey_copy.survey sr " +
        "JOIN survey_copy.subject su " +
        "ON sr.subject_id = su.id;");
    console.info(new Date() + ": Getting surveys with subject names success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function getLecturesWithSubjectNames() {
  try {
    let query = `
                SELECT l.*, s.name subject_name
                FROM survey_copy.lecture l
                JOIN survey_copy.subject s
                ON l.subject_id = s.id;
        `;

    let queryResult = await dbConfig.pool.query(query);
    console.info(new Date() + ": Getting lectures with subject names success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}


async function deleteSurvey(id) {
  try {
    await dbConfig.pool.query("DELETE FROM survey_copy.survey WHERE id = $1", [id]);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function deleteQuestion(id) {
  try {
    await dbConfig.pool.query("DELETE FROM survey_copy.question WHERE id = $1", [id]);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function updateQuestion(question) {
  try {
    let query = `UPDATE survey_copy.question
                     SET question = $1,
                         type_id = $2,
                         category_id = $3,
                         lecture_id = $4
                     WHERE id = $5`;
    await dbConfig.pool.query(query,
        [question.text,
          parseInt(question.type_id),
          parseInt(question.category_id),
          parseInt(question.lecture_id),
          parseInt(question.id)]);
  } catch (e) {
    console.error(e);
    throw e;
  }
}


async function getQuestionCategories() {
  try {
    let result = await dbConfig.pool.query("SELECT *  FROM survey_copy.question_category");
    console.info(new Date() + ": Getting question categories success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getQuestionsByLectureId(lecture_id) {
  try {
    let query = `SELECT q.*, t.name AS type, c.name AS category, json_agg(mc.answer) AS options
                 FROM survey_copy.question q
                 JOIN survey_copy.question_category c
                      ON q.category_id = c.id
                 JOIN survey_copy.question_type t
                      ON q.type_id = t.id
                 LEFT JOIN survey_copy.multiple_choices mc
                      ON q.id = mc.question_id
                 WHERE lecture_id = $1
                 GROUP BY q.id, q.question, q.lecture_id, q.type_id, q.category_id, t.name, c.name;
                  `;
    let result = await dbConfig.pool.query(query, [isNaN(lecture_id) ? null : lecture_id]);
    console.info(new Date() + ": Getting questions by lecture id success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAnswers(subjectId, lectureId, questionId) {
  try {
    let query = `SELECT qa.*,
                            s.name || ' ' || s.surname student,
                            q.question
                    FROM survey_copy.question_answer qa
                    JOIN survey_copy.question q
                         ON qa.question_id = q.id
                    JOIN survey_copy.lecture l
                         ON q.lecture_id = l.id
                    LEFT JOIN survey_copy.student s
                              ON s.id = qa.student_id
                    WHERE l.subject_id = $1
                      AND q.lecture_id = coalesce($2, q.lecture_id)
                      AND q.id = coalesce($3, q.id);
                     `;

    let result = await dbConfig.pool.query(query, [subjectId, isNaN(lectureId) ? null : lectureId, isNaN(questionId) ? null : questionId]);
    console.info(new Date() + ": Getting answers success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getLecturesBySubjectId(subjectId) {
  try {
    let query = `
                SELECT l.*, s.name subject_name
                FROM survey_copy.lecture l
                JOIN survey_copy.subject s
                     ON l.subject_id = s.id
                WHERE l.subject_id = $1;
        `;
    let result = await dbConfig.pool.query(query, [subjectId]);
    console.info(new Date() + ": Getting lectures by subject id success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getQuestionTypes() {
  try {
    let result = await dbConfig.pool.query("SELECT * from survey_copy.question_type;");
    console.info(new Date() + ": Getting question types success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function postQuestion(question) {
  try {
    let result = await dbConfig.pool.query(
        "INSERT INTO survey_copy.question (question, type_id, category_id, lecture_id) " +
        "VALUES ($1, $2, $3, $4) RETURNING id", [question.text, question.type_id, question.category_id, question.lecture_id]
    );
    return result.rows[0].id;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function postQuestionOptions(id, options) {
  try {
    for (let i = 0; i < options.length; i++) {
      await dbConfig.pool.query(
          "INSERT INTO survey_copy.multiple_choices(question_id, answer) VALUES ($1, $2);",
          [id, options[i]]
      );
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getSubjectsByProfessorId(id) {
  try {
    let result = await dbConfig.pool.query("SELECT * from survey_copy.subject " +
        "WHERE professor_id = $1;", [id]);
    console.info(new Date() + ": Getting professor's subjects success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}


async function getQuestion(id) {
  try {
    let result = await dbConfig.pool.query(
        "SELECT * from survey_copy.question WHERE id = $1;", [id]);
    console.info(new Date() + ": Getting question success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function batchInsert(questions) {
  for (let question of questions) {
    await postQuestion(question);
  }
}

async function changeQuestionsActiveState(active, id) {
  let query = "UPDATE survey_copy.question SET active = $1 WHERE id = $2";
  let result = await dbConfig.pool.query(query, [active, id]);
  console.info(new Date() + ": Active state changed");
  return result;
}

async function getStudentsAnswers(studentId) {
  let query = `SELECT q.question, qa.*
                  FROM survey_copy.question_answer qa
                  JOIN survey_copy.question q
                       ON qa.question_id = q.id
                  WHERE qa.student_id = $1
                  ORDER BY qa.date_of_answer DESC;`;

  let result = await dbConfig.pool.query(query, [studentId]);
  console.info(new Date() + ": Getting student's answers success");
  return result;
}

async function getAnswersByQuestionId(questionId) {
  let query = "SELECT qa.* from question_answer qa where qa.id = $1";
  return await dbConfig.pool.query(query, [questionId]);
}

async function getActiveQuestionsForStudent(studentId) {
  let query = `SELECT q.id,
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
                GROUP BY q.id, q.question, q.active, q.type_id, qt.name, qc.name;`;

  let result = await dbConfig.pool.query(query, [studentId]);
  console.info(new Date() + ": Success in getting active questions for student");
  return result;
}

async function saveAnswer(answer) {
  if (!answer instanceof Answer) throw Error("Not an answer type");
  let query = `INSERT INTO survey_copy.question_answer (question_id, date_of_answer, answer, student_id, employee_id)
                 VALUES ($1, current_date, $2, $3, $4);`;

  let result = await dbConfig.pool.query(query, [answer.questionId, answer.answerText, answer.studentId, answer.employeeId]);
  console.info("Inserting answer success");
}

async function getStudentsQuestions(studentId) {
  let query = `SELECT sq.*, s.name || ' ' || TO_CHAR(l.date_time :: DATE, 'DD.MM.YYYY hh:mm:ss') as lecture
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
               ORDER BY sq.likes DESC;`;
  let questions = await dbConfig.pool.query(query, [studentId]);
  console.info("Getting student's questions success");
  return questions;
}

async function getStudentsQuestionsByLectureId(lectureId) {
  let query = `SELECT sq.*, s.name || ' ' || TO_CHAR(l.date_time :: DATE, 'DD.MM.YYYY hh:mm:ss') AS lecture
               FROM survey_copy.student_question sq
               JOIN survey_copy.lecture l
                    ON sq.lecture_id = l.id
               JOIN survey_copy.subject s
                    ON l.subject_id = s.id
               WHERE sq.lecture_id = $1
                 AND sq.id NOT IN (SELECT ta.student_question_id FROM survey_copy.teacher_answer ta)
               ORDER BY sq.likes DESC`;
  let questions = await dbConfig.pool.query(query, [lectureId]);
  console.info("Getting student's questions success");
  return questions;
}


async function getStudentsSubjects(studentId) {
  let query = `SELECT s.*
               FROM survey_copy.subject s
               JOIN survey_copy.students_subjects ss
                    ON s.id = ss.subject_id
               WHERE ss.student_id = $1`;
  return await dbConfig.pool.query(query, [studentId]);
}

async function postStudentQuestion(studentQuestion) {
  if (!studentQuestion instanceof StudentQuestion) throw Error("Not an question type");
  let query = `INSERT INTO survey_copy.student_question (text, lecture_id, likes)
               VALUES ($1, $2, $3);`;
  let result = await dbConfig.pool.query(query, [studentQuestion.qText, studentQuestion.lectureId, studentQuestion.likes]);
  console.info("Inserting student question success");
}

async function likeQuestion(studentId) {
  let query = `UPDATE survey_copy.student_question SET likes = likes + 1 WHERE id = $1;`;
  await dbConfig.pool.query(query, [studentId]);
  console.info("Liking student question success");
}

async function postTeacherAnswer(teacherAnswer) {
  if (!teacherAnswer instanceof TeacherAnswer) throw Error("Not an teacher answer type");
  let query = `INSERT INTO survey_copy.teacher_answer (student_question_id, text, time) 
               VALUES ($1, $2, current_date)`;
  await dbConfig.pool.query(query, [teacherAnswer.studentQuestionId, teacherAnswer.aText]);
}

module.exports = {
  getSubjects,
  getQuestionCategories,
  getQuestionTypes,
  getQuestionsByLectureId,
  getAnswers,
  getLecturesBySubjectId,
  getSurveysWithSubjectNames,
  getLecturesWithSubjectNames,
  getSubjectsByProfessorId,
  deleteSurvey,
  deleteQuestion,
  postQuestion,
  getQuestion,
  postQuestionOptions,
  postLecture,
  updateQuestion,
  batchInsert,
  changeQuestionsActiveState,
  getStudentsAnswers,
  getActiveQuestionsForStudent,
  saveAnswer,
  getStudentsQuestions,
  getStudentsSubjects,
  postStudentQuestion,
  likeQuestion,
  getAnswersByQuestionId,
  getStudentsQuestionsByLectureId,
  postTeacherAnswer
};
