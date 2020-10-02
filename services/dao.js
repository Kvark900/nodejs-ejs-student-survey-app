const dbConfig = require("../config/dbConfig");
const Answer = require("../model/Answer");
const StudentQuestion = require("../model/StudentQuestion");
const TeacherAnswer = require("../model/TeacherAnswer");
const repo = require("../sql/queryRepository");
const runner = require("../services/queryRunner")

async function getSubjects() {
  try {
    let queryResult = await runner.run(repo.GET_SUBJECTS);
    console.info(new Date() + ": Getting subjects success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function getQuestions() {
  try {
    let queryResult = await runner.run(repo.GET_QUESTIONS);
    console.info(new Date() + ": Getting question success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function postSurvey(year, subject_id) {
  try {
    await runner.run(repo.CREATE_SURVEY, [year, subject_id]);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function postLecture(timestamp, subject_id) {
  try {
    await runner.run(repo.CREATE_LECTURE, [timestamp, subject_id]
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getSurveys() {
  try {
    // let queryResult = await runner.run(repo.);
    console.info(new Date() + ": Getting surveys success");
    // return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function getSurveysWithSubjectNames() {
  try {
    let queryResult = await runner.run(repo.GET_SURVEYS_WITH_SUBJECT_NAMES);
    console.info(new Date() + ": Getting surveys with subject names success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function getLecturesWithSubjectNames() {
  try {
    let query = repo.GET_LECTURES_WITH_SUBJECT_NAMES;

    let queryResult = await runner.run(query);
    console.info(new Date() + ": Getting lectures with subject names success");
    return queryResult;
  } catch (e) {
    console.error(e);
  }
}

async function deleteSurvey(id) {
  try {
    await runner.run(repo.DELETE_SURVEY, [id]);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function deleteQuestion(id) {
  try {
    await runner.run(repo.DELETE_QUESTION, [id]);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function updateQuestion(question) {
  try {
    let query = repo.UPDATE_QUESTION;
    await runner.run(query,
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
    let result = await runner.run(repo.GET_QUESTION_CATEGORIES);
    console.info(new Date() + ": Getting question categories success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getQuestionsByLectureId(lecture_id) {
  try {
    let query = repo.GET_QUESTIONS_BY_LECTURE_ID;
    let result = await runner.run(query, [isNaN(lecture_id) ? null : lecture_id]);
    console.info(new Date() + ": Getting questions by lecture id success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getAnswers(subjectId, lectureId, questionId) {
  try {
    let query = repo.GET_ANSWERS;

    let result = await runner.run(query, [subjectId, isNaN(lectureId) ? null : lectureId, isNaN(questionId) ? null : questionId]);
    console.info(new Date() + ": Getting answers success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getLecturesBySubjectId(subjectId) {
  try {
    let query = repo.GET_LECTURES_BY_SUBJECT_ID;
    let result = await runner.run(query, [subjectId]);
    console.info(new Date() + ": Getting lectures by subject id success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getQuestionTypes() {
  try {
    let result = await runner.run(repo.GET_QUESTION_TYPES);
    console.info(new Date() + ": Getting question types success");
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function postQuestion(question) {
  try {
    let result = await runner.run(repo.CREATE_QUESTION, [question.text, question.type_id, question.category_id, question.lecture_id]
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
      await runner.run(repo.CREATE_QUESTION_OPTIONS,[id, options[i]]
      );
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getSubjectsByProfessorId(id) {
  try {
    let result = await runner.run(repo.GET_SUBJECTS_BY_PROFESSOR_ID, [id]);
    console.info(new Date() + ": Getting professor's subjects success" + "SQL is: " + repo.GET_SUBJECTS_BY_PROFESSOR_ID);
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function getQuestion(id) {
  try {
    let result = await runner.run(repo.GET_QUESTION, [id]);
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
  let query = repo.CHANGE_QUESTIONS_ACTIVE_STATE;
  let result = await runner.run(query, [active, id]);
  console.info(new Date() + ": Active state changed");
  return result;
}

async function getStudentsAnswers(studentId) {
  let query = repo.GET_STUDENTS_ANSWERS;
  let result = await runner.run(query, [studentId]);
  console.info(new Date() + ": Getting student's answers success");
  return result;
}

async function getAnswersByQuestionId(questionId) {
  let query = repo.GET_ANSWERS_BYQUESTION_ID;
  return await runner.run(query, [questionId]);
}

async function getActiveQuestionsForStudent(studentId) {
  let query = repo.GET_ACTIVE_QUESTIONS_FOR_STUDENT;
  let result = await runner.run(query, [studentId]);
  console.info(new Date() + ": Success in getting active questions for student");
  return result;
}

async function saveAnswer(answer) {
  if (!answer instanceof Answer) throw Error("Not an answer type");
  let query = repo.SAVE_ANSWER;
  let result = await runner.run(query, [answer.questionId, answer.answerText, answer.studentId, answer.employeeId]);
  console.info("Inserting answer success");
}

async function getStudentsQuestions(studentId) {
  let query = repo.GET_STUDENTS_QUESTIONS;
  let questions = await runner.run(query, [studentId]);
  console.info("Getting student's questions success");
  return questions;
}

async function getStudentsQuestionsByLectureId(lectureId) {
  let query = repo.GET_STUDENTS_QUESTIONS_BY_LECTURE_ID;
  let questions = await runner.run(query, [lectureId]);
  console.info("Getting student's questions success");
  return questions;
}

async function getStudentsSubjects(studentId) {
  let query = repo.GET_STUDENTS_SUBJECTS;
  return await runner.run(query, [studentId]);
}

async function postStudentQuestion(studentQuestion) {
  if (!studentQuestion instanceof StudentQuestion) throw Error("Not an question type");
  let query = repo.POST_STUDENT_QUESTION;
  let result = await runner.run(query, [studentQuestion.qText, studentQuestion.lectureId, studentQuestion.likes]);
  console.info("Inserting student question success");
}

async function likeQuestion(studentId) {
  let query = repo.LIKE_QUESTION;
  await runner.run(query, [studentId]);
  console.info("Liking student question success");
}

async function postTeacherAnswer(teacherAnswer) {
  if (!teacherAnswer instanceof TeacherAnswer) throw Error("Not an teacher answer type");
  let query = repo.POST_TEACHER_ANSWER;
  await runner.run(query, [teacherAnswer.studentQuestionId, teacherAnswer.aText]);
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
