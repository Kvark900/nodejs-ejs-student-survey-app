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
    let questions = await dao.getActiveQuestionsForStudent(20);  //TODO: replace this with current student

    res.render('student/questions', {title: "Student Questions", questions: questions.rows});
  } catch (e) {
    console.log(e.message)
  }

});


module.exports = router;
