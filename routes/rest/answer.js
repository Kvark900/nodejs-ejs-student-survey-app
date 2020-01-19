const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');

router.get('/answer', async (req, res, next) => {
    try {
        let answers = await dao.getAnswers(parseInt(req.query.subjectId), parseInt(req.query.lectureId), parseInt(req.query.questionId));
        res.status(200).send(answers.rows);
    } catch (e) {
        res.status(400).send(e.message)
    }
});

module.exports = router;
