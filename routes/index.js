const express = require('express');
const router = express.Router();
const dao = require('../services/dao');

/* GET home page. */
router.get('/', async (req, res, next) => {
    let subjects = await dao.getSubjects();
    let surveys = await dao.getSurveysWithSubjectNames();
    // console.info(subjects.rows);
    // console.info(surveys.rows);
    res.render('index', {title: 'Express', subjects: subjects.rows, surveys: surveys.rows});
});

router.get('/survey', async (req, res, next) => {
    let subjects = await dao.getSubjects();
    let surveys = await dao.getSurveysWithSubjectNames();
    res.render('survey', {title: 'Express', subjects: subjects.rows, surveys: surveys.rows});
});

router.get('/question', async (req, res, next) => {
    let questions = await dao.getQuestions();
    let surveys = await dao.getSurveysWithSubjectNames();
    res.render('question', {title: 'Express', questions: questions.rows, surveys: surveys.rows});
});


router.post("/survey", (async (req, res) => {
    try {
        await dao.postSurvey(parseInt(req.body.year), parseInt(req.body.subject_id));
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));

router.delete("/survey/:id", (async (req, res) => {
    try {
        console.info("Deleting survey with id: " + req.params.id);
        await dao.deleteSurvey(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));

module.exports = router;
