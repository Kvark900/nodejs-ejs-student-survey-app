const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');
const Answer = require('../../model/Answer');

router.get('/', async (req, res, next) => {
  try {
    let answers = await dao.getAnswers(parseInt(req.query.subjectId), parseInt(req.query.lectureId), parseInt(req.query.questionId));
    res.status(200).send(answers.rows);
  } catch (e) {
    res.status(400).json({message: e.message})
  }
});

router.get('/student/:id', async (req, res, next) => {
  try {
    let answers = await dao.getStudentsAnswers(parseInt(req.params.id));
    res.status(200).send(answers.rows);
  } catch (e) {
    res.status(400).json({message: e.message})
  }
});

router.post("/", async (req, res, next) => {
  try {
    let body = req.body;
    let answer = new Answer(parseInt(body.questionId), parseInt(body.employeeId), Date(), body.text, 20);
    await dao.saveAnswer(answer);
    res.status(200).send(answer);
  } catch (e) {
    res.status(400).json({message: e.message})
  }
});

router.get('/question/:id', async (req, res, next) => {
  try {
    let answers = await dao.getAnswersByQuestionId(parseInt(req.params.id));
    res.status(200).send(answers.rows);
  } catch (e) {
    res.status(400).json({message: e.message})
  }
});



module.exports = router;
