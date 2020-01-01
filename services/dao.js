const dbConfig = require("../dbConfig");

async function getSubjects() {
    try {
        let queryResult = await dbConfig.pool.query("SELECT * from survey_copy.subject;");
        console.info(new Date() + ": Getting subjects success");
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
            "SELECT sr.year, su.name subject_name " +
            "FROM survey_copy.survey sr " +
            "JOIN survey_copy.subject su " +
            "ON sr.subject_id = su.id;");
        console.info(new Date() + ": Getting surveys with subject names success");
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

module.exports = {
    getSubjects,
    postSurvey,
    getSurveys,
    getSurveysWithSubjectNames,
    deleteSurvey
};
