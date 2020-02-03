const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');
const moment = require("moment");
const xlsx = require("xlsx");
const path = require('path');
const fs = require('fs');

/* GET home page. */
router.get('/', async (req, res, next) => {
    let subjects = await dao.getSubjects();
    let surveys = await dao.getSurveysWithSubjectNames();
    res.redirect("/teacher/question");
});

router.get('/lecture', async (req, res, next) => {
    let subjects = await dao.getSubjects();
    let lectures = await dao.getLecturesWithSubjectNames();
    res.render('teacher/lecture', {moment: moment, title: 'Express', subjects: subjects.rows, lectures: lectures.rows});
});

router.get('/addQuestion', async (req, res, next) => {
    let lectures = await dao.getLecturesWithSubjectNames();
    let types = await dao.getQuestionTypes();
    let categories = await dao.getQuestionCategories();
    res.render('teacher/addQuestion',
        {
            title: 'Question',
            moment: moment,
            lectures: lectures.rows,
            types: types.rows,
            categories: categories.rows
        });
});


router.get('/updateQuestion/:id', async (req, res, next) => {
    let lectures = await dao.getLecturesWithSubjectNames();
    let types = await dao.getQuestionTypes();
    let categories = await dao.getQuestionCategories();
    let current = await dao.getQuestion(req.params.id);
    res.render('teacher/addQuestion',
        {
            title: 'Question',
            moment: moment,
            lectures: lectures.rows,
            types: types.rows,
            categories: categories.rows,
            current: current.rows[0]
        });
});

router.get('/question', async (req, res, next) => {
    let subjects = await dao.getSubjectsByProfessorId(2); // TODO: get currently logged in professor's id
    res.render('teacher/questionFinder',
        {
            title: 'Question',
            moment: moment,
            subjects: subjects.rows,
        });
});

router.get('/studentQuestion', async (req, res, next) => {
  let subjects = await dao.getSubjectsByProfessorId(2); // TODO: get currently logged in professor's id
  res.render('teacher/studentsQuestionFinder',
      {
        title: 'Question',
        moment: moment,
        subjects: subjects.rows,
      });
});


router.get('/answers', async (req, res, next) => {
    let subjects = await dao.getSubjectsByProfessorId(2); // TODO: get currently logged in professor's id
    res.render('teacher/answerFinder',
        {
            title: 'Answer',
            moment: moment,
            subjects: subjects.rows,
        });
});


module.exports = router;
