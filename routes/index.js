const express = require('express');
const router = express.Router();
const dao = require('../services/dao');
const moment = require("moment");


/* GET home page. */
router.get('/', async (req, res, next) => {
    let subjects = await dao.getSubjects();
    let surveys = await dao.getSurveysWithSubjectNames();
    res.render('index', {title: 'Express', subjects: subjects.rows, surveys: surveys.rows});
});

router.get('/lecture', async (req, res, next) => {
    let subjects = await dao.getSubjects();
    let lectures = await dao.getLecturesWithSubjectNames();
    res.render('lecture', {moment: moment, title: 'Express', subjects: subjects.rows, lectures: lectures.rows});
});

router.post("/lecture", (async (req, res) => {
    try {
        await dao.postLecture(parseInt(req.body.time), parseInt(req.body.subject_id));
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


router.get('/question', async (req, res, next) => {
    let questions = await dao.getQuestions();
    let lectures = await dao.getLecturesWithSubjectNames();
    let types = await dao.getQuestionTypes();
    let categories = await dao.getQuestionCategories();
    res.render('question',
        {
            title: 'Question',
            moment:  moment,
            questions: questions.rows,
            lectures: lectures.rows,
            types: types.rows,
            categories: categories.rows
        });
});

router.post("/question", async (req, res) => {
    let question = req.body;
    try {
        let id = await dao.postQuestion(question);
        console.log("ID of saved question is: " + id);
        console.info("Question has been saved: ");
        console.info(question);

        if (question.options !== undefined && question.options.length > 1)
            await dao.postQuestionOptions(id, question.options);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message)
    }
});

module.exports = router;
