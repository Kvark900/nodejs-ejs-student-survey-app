let express = require('express');
const dao = require("../services/dao");
const moment = require("moment");
let router = express.Router();

router.get('/results/:qId', async (req, res, next) => {
  try {
    let answers = await dao.getAnswersByQuestionId(req.params.qId);
    res.render('results',
        {
          title: "Results",
          answers: answers.rows,
          moment: moment
        });
  } catch (e) {
    console.log(e.message)
  }
});

module.exports = router;
