var express = require('express');
const dao = require("../../services/dao");
const moment = require("moment");
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect("/student/answers");
});

router.get('/answers', async (req, res, next) => {
  try {
    let answers = await dao.getStudentsAnswers(20);//TODO: replace this with current student
    res.render('student/answers',
        {
          title: "Student Answers",
          answers: answers.rows,
          moment: moment
        });
  } catch (e) {
    console.log(e.message)
  }
});

router.get('/questions', async (req, res, next) => {
  try {
    let subjects = await dao.getStudentsSubjects(20);
    let activeQuestions = await dao.getActiveQuestionsForStudent(20);  //TODO: replace this with current student
    let studentsQuestions = await dao.getStudentsQuestions(20);
    res.render('student/questions', {
      title: "Student Questions",
      activeQuestions: activeQuestions.rows,
      studentsQuestions: studentsQuestions.rows,
      subjects: subjects.rows
    });
  } catch (e) {
    console.log(e.message)
  }
});


module.exports = router;
