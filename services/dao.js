const dbConfig = require("../config/dbConfig");

async function getSubjects() {
    try {
        let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.subject;");
        console.info(new Date() + ": Getting subjects success");
        return queryResult;
    } catch (e) {
        console.error(e);
    }
}

async function getQuestions() {
    try {
        let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.question;");
        console.info(new Date() + ": Getting question success");
        return queryResult;
    } catch (e) {
        console.error(e);
    }
}


async function postSurvey(year, subject_id) {
    try {
        await dbConfig.pool.query(
            "INSERT INTO survey_copy.survey (year, subject_id) " +
            "VALUES ($1, $2);", [year, subject_id]
        );
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function postLecture(timestamp, subject_id) {
    try {
        await dbConfig.pool.query(
            "INSERT INTO survey_copy.lecture (date_time, subject_id) " +
            "VALUES ($1, $2);", [timestamp, subject_id]
        );
    } catch (e) {
        console.error(e);
        throw e;
    }
}


async function getSurveys() {
    try {
        let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.survey;");
        console.info(new Date() + ": Getting surveys success");
        return queryResult;
    } catch (e) {
        console.error(e);
    }
}

async function getSurveysWithSubjectNames() {
    try {
        let queryResult = await dbConfig.pool.query(
            "SELECT sr.id, sr.year, su.name subject_name " +
            "FROM survey_copy.survey sr " +
            "JOIN survey_copy.subject su " +
            "ON sr.subject_id = su.id;");
        console.info(new Date() + ": Getting surveys with subject names success");
        return queryResult;
    } catch (e) {
        console.error(e);
    }
}

async function getLecturesWithSubjectNames() {
    try {
        let queryResult = await dbConfig.pool.query(
            "SELECT l.*, s.name subject_name " +
            "FROM survey_copy.lecture l " +
            "JOIN survey_copy.subject s " +
            "ON l.subject_id = s.id");
        console.info(new Date() + ": Getting lectures with subject names success");
        return queryResult;
    } catch (e) {
        console.error(e);
    }
}


async function deleteSurvey(id) {
    try {
        await dbConfig.pool.query("DELETE FROM survey_copy.survey WHERE id = $1", [id]);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function deleteQuestion(id) {
    try {
        await dbConfig.pool.query("DELETE FROM survey_copy.question WHERE id = $1", [id]);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function updateQuestion(question) {
    try {
        let query = `UPDATE survey_copy.question
                     SET question = $1,
                         type_id = $2,
                         category_id = $3,
                         lecture_id = $4
                     WHERE id = $5`;
        await dbConfig.pool.query(query,
            [question.text,
                parseInt(question.type_id),
                parseInt(question.category_id),
                parseInt(question.lecture_id),
                parseInt(question.id)]);
    } catch (e) {
        console.error(e);
        throw e;
    }
}


async function getQuestionCategories() {
    try {
        let result = await dbConfig.pool.query("SELECT *  FROM survey_copy.question_category");
        console.info(new Date() + ": Getting question categories success");
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getQuestionsByLectureId(lecture_id) {
    try {
        let sql = `SELECT q.*, t.name AS type, c.name AS category
                   FROM survey_copy.question q
                   JOIN survey_copy.question_category c
                   ON q.category_id = c.id
                   JOIN survey_copy.question_type t
                   ON q.type_id = t.id
                   WHERE lecture_id = $1;
                  `;
        let result = await dbConfig.pool.query(sql, [lecture_id]);
        console.info(new Date() + ": Getting questions by lecture id success");
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getQuestionTypes() {
    try {
        let result = await dbConfig.pool.query("SELECT * from survey_copy.question_type;");
        console.info(new Date() + ": Getting question types success");
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function postQuestion(question) {
    try {
        let result = await dbConfig.pool.query(
            "INSERT INTO survey_copy.question (question, type_id, category_id, lecture_id) " +
            "VALUES ($1, $2, $3, $4) RETURNING id", [question.text, question.type_id, question.category_id, question.lecture_id]
        );
        return result.rows[0].id;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function postQuestionOptions(id, options) {
    try {
        for (let i = 0; i < options.length; i++) {
            await dbConfig.pool.query(
                "INSERT INTO survey_copy.multiple_choices(question_id, answer) VALUES ($1, $2);",
                [id, options[i]]
            );
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getSubjectsByProfessorId(id) {
    try {
        let result = await dbConfig.pool.query("SELECT * from survey_copy.subject " +
            "WHERE professor_id = $1;", [id]);
        console.info(new Date() + ": Getting professor's subjects success");
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getQuestion(id) {
    try {
        let result = await dbConfig.pool.query(
            "SELECT * from survey_copy.question WHERE id = $1;", [id]);
        console.info(new Date() + ": Getting question success");
        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}


module.exports = {
    getSubjects,
    postSurvey,
    getSurveys,
    getQuestions,
    getQuestionCategories,
    getQuestionTypes,
    getQuestionsByLectureId,
    getSurveysWithSubjectNames,
    getLecturesWithSubjectNames,
    getSubjectsByProfessorId,
    deleteSurvey,
    deleteQuestion,
    postQuestion,
    getQuestion,
    postQuestionOptions,
    postLecture,
    updateQuestion
};
