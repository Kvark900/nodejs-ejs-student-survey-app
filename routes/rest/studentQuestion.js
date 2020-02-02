const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');
const StudentQuestion = require("../../model/StudentQuestion");


router.post("/", async (req, res) => {
  try {
    let studentQuestion = new StudentQuestion(req.body.text, req.body.lecture_id, 0);
    await dao.postStudentQuestion(studentQuestion);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(400).json({message: e.message})
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    await dao.likeQuestion(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(400).json({message: e.message})
  }
});


module.exports = router;
