var express = require('express');
const dao = require("../../services/dao");
const moment = require("moment");
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('student/student', {title: "Student"});
});

router.get('/answers', async (req, res, next) => {
    let answers = await dao.getStudentsAnswers(20);//TODO: replace this with current student
    res.render('student/answers',
        {
          title: "Student Answers",
          answers: answers.rows,
          moment: moment
        });
});

router.get('/questions', function (req, res, next) {
    res.render('student/questions', {title: "Student Questions"});
});


module.exports = router;
