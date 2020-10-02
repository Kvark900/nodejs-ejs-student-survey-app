const GET_SUBJECTS = "GetSubjects";
const GET_QUESTIONS = "GetQuestions";
const CREATE_SURVEY = "CreateSurvey";
const CREATE_LECTURE = "CreateLecture";
const GET_SURVEYS_WITH_SUBJECT_NAMES = "GetSurveysWithSubjectNames";
const GET_LECTURES_WITH_SUBJECT_NAMES = "GetLecturesWithSubjectNames";
const DELETE_SURVEY = "DeleteSurvey";
const DELETE_QUESTION = "DeleteQuestion";
const UPDATE_QUESTION = "UpdateQuestion";
const GET_QUESTION_CATEGORIES = "GetQuestionCategories";
const GET_QUESTIONS_BY_LECTURE_ID = "GetQuestionsByLectureId";
const GET_ANSWERS = "GetAnswers";
const GET_LECTURES_BY_SUBJECT_ID = "GetLecturesBySubjectId";
const GET_QUESTION_TYPES = "GetQuestionTypes";
const CREATE_QUESTION = "CreateQuestion";
const CREATE_QUESTION_OPTIONS = "CreateQuestionOptions";
const GET_SUBJECTS_BY_PROFESSOR_ID = "GetSubjectsByProfessorId";
const GET_QUESTION = "GetQuestion";
const CHANGE_QUESTIONS_ACTIVE_STATE = "ChangeQuestionsActiveState";
const GET_STUDENTS_ANSWERS = "GetStudentsAnswers";
const GET_ANSWERS_BY_QUESTION_ID = "GetAnswersByQuestionId";
const GET_ACTIVE_QUESTIONS_FOR_STUDENT = "GetActiveQuestionsForStudent";
const SAVE_ANSWER = "SaveAnswer";
const GET_STUDENTS_QUESTIONS = "GetStudentsQuestions";
const GET_STUDENTS_QUESTIONS_BY_LECTURE_ID = "GetStudentsQuestionsByLectureId";
const GET_STUDENTS_SUBJECTS = "GetStudentsSubjects";
const POST_STUDENT_QUESTION = "PostStudentQuestion";
const LIKE_QUESTION = "LikeQuestion";
const POST_TEACHER_ANSWER = "PostTeacherAnswer";

const fs = require('fs');

function getQuery(name) {
  console.log(`Reading SQL file: ${name}.sql`)
  return fs.readFileSync(process.cwd() + "/sql/" + name + '.sql').toString();
}

module.exports = {
  GET_SUBJECTS,
  GET_QUESTIONS,
  CREATE_SURVEY,
  CREATE_LECTURE,
  GET_SURVEYS_WITH_SUBJECT_NAMES,
  GET_LECTURES_WITH_SUBJECT_NAMES,
  DELETE_SURVEY,
  DELETE_QUESTION,
  UPDATE_QUESTION,
  GET_QUESTION_CATEGORIES,
  GET_QUESTIONS_BY_LECTURE_ID,
  GET_ANSWERS,
  GET_LECTURES_BY_SUBJECT_ID,
  GET_QUESTION_TYPES,
  CREATE_QUESTION,
  CREATE_QUESTION_OPTIONS,
  GET_SUBJECTS_BY_PROFESSOR_ID,
  GET_QUESTION,
  CHANGE_QUESTIONS_ACTIVE_STATE,
  GET_STUDENTS_ANSWERS,
  GET_ANSWERS_BYQUESTION_ID: GET_ANSWERS_BY_QUESTION_ID,
  GET_ACTIVE_QUESTIONS_FOR_STUDENT,
  SAVE_ANSWER,
  GET_STUDENTS_QUESTIONS,
  GET_STUDENTS_QUESTIONS_BY_LECTURE_ID,
  GET_STUDENTS_SUBJECTS,
  POST_STUDENT_QUESTION,
  LIKE_QUESTION,
  POST_TEACHER_ANSWER,
  getQuery
}

