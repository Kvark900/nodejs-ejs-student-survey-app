const express = require('express');
const router = express.Router();
const dao = require('../../services/dao');
const xlsx = require("xlsx");
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '././uploads/');
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


router.get('/', async (req, res, next) => {
    try {
        let questions = await dao.getQuestionsByLectureId(parseInt(req.query.lectureId));
        res.status(200).send(questions.rows);
    } catch (e) {
        res.status(400).send(e.message)
    }
});

router.post("/", async (req, res) => {
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

router.post("/xls", upload.single('excel'), async (req, res) => {
    try {
        let excel = req.file;
        if (!excel) throw new Error("Unsupported file type! Please select excel file");
        let filePath = path.join(__dirname, '..', '..', 'uploads', excel.filename);
        let workBook = xlsx.readFile(filePath);
        let questions = xlsx.utils.sheet_to_json(workBook.Sheets["Questions"]);
        deleteFile(filePath);
        await dao.batchInsert(questions);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message)
    }
});

router.delete("/:id", (async (req, res) => {
    try {
        console.info("Deleting question with id: " + req.params.id);
        await dao.deleteQuestion(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));

router.put("/:id", (async (req, res) => {
    try {
        console.info("Updating question with id: " + req.params.id);
        await dao.updateQuestion(req.body);
        res.sendStatus(200);
    } catch (e) {
        res.status(400).send(e.message)
    }
}));

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${path} deleted'`);
    });
}

module.exports = router;
