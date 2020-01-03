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


router.get('/addQuestion', async (req, res, next) => {
    let lectures = await dao.getLecturesWithSubjectNames();
    let types = await dao.getQuestionTypes();
    let categories = await dao.getQuestionCategories();
    res.render('addQuestion',
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
    res.render('addQuestion',
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
    let lectures = await dao.getLecturesWithSubjectNames();
    res.render('questionFinder',
        {
            title: 'Question',
            moment: moment,
            subjects: subjects.rows,
            lectures: lectures.rows,
        });
});


router.delete("/api/question/:id", (async (req, res) => {
    try {
        console.info("Deleting question with id: " + req.params.id);
        await dao.deleteQuestion(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));

router.put("/api/question/:id", (async (req, res) => {
    try {
        console.info("Updating question with id: " + req.params.id);
        await dao.updateQuestion(req.body);
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));



router.get('/api/question/:lectureId', async (req, res, next) => {
    try {
        let questions = await dao.getQuestionsByLectureId(req.params.lectureId);
        res.status(200).send(questions.rows);
    } catch (e) {
        res.status(400).send(e.message)
    }
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
