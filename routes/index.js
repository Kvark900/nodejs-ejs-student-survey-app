const express = require('express');
const router = express.Router();
const dao = require('../services/dao');
const moment = require("moment");
const xlsx = require("xlsx");
const path = require('path');

// const upload = require("express-fileupload");

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


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
    res.render('questionFinder',
        {
            title: 'Question',
            moment: moment,
            subjects: subjects.rows,
        });
});

router.get('/answers', async (req, res, next) => {
    let subjects = await dao.getSubjectsByProfessorId(2); // TODO: get currently logged in professor's id
    res.render('answerFinder',
        {
            title: 'Answer',
            moment: moment,
            subjects: subjects.rows,
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


router.get('/api/question', async (req, res, next) => {
    try {
        let questions = await dao.getQuestionsByLectureId(parseInt(req.query.lectureId));
        res.status(200).send(questions.rows);
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.get('/api/answer', async (req, res, next) => {
    try {
        let answers = await dao.getAnswers(parseInt(req.query.lectureId), parseInt(req.query.questionId));
        res.status(200).send(answers.rows);
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.get('/api/lecture', async (req, res, next) => {
    try {
        let questions = await dao.getLecturesBySubjectId(req.query.subjectId);
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

router.post("/api/xlsQuestion", upload.single('excel'), async (req, res) => {
    try {
        let excel = req.file;
        if (!excel) throw new Error("Unsupported file type! Please select excel file");
        console.log("From node:\n" + excel);
        console.log(path.join(__dirname, '..', 'uploads', excel.filename));
        let workBook = xlsx.readFile(path.join(__dirname, '..', 'uploads', excel.filename));
        console.log(xlsx.utils.sheet_to_json(workBook.Sheets["Questions"]));
        let questions = xlsx.utils.sheet_to_json(workBook.Sheets["Questions"]);

        // console.log(workBook);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message)
    }
});

router.post("/", upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
