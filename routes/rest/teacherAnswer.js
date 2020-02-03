const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');
const TeacherAnswer = require("../../model/TeacherAnswer");


router.post("/", async (req, res) => {
  try {
    let teacherAnswer = new TeacherAnswer(req.body.studentQuestionId, req.body.aText);
    await dao.postTeacherAnswer(teacherAnswer);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(400).json({message: e.message})
  }
});

module.exports = router;
