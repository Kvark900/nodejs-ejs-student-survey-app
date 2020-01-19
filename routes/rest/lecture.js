const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');

router.get('/', async (req, res, next) => {
    try {
        let questions = await dao.getLecturesBySubjectId(req.query.subjectId);
        res.status(200).send(questions.rows);
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.post("/", (async (req, res) => {
    try {
        await dao.postLecture(parseInt(req.body.time), parseInt(req.body.subject_id));
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));

module.exports = router;
