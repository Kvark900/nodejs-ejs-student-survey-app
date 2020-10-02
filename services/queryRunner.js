const repo = require("../sql/queryRepository");
const {pool} = require("../config/dbConfig");
const timer = require('execution-time')();
const moment = require("moment");


async function run(queryName, params) {
  let query = repo.getQuery(queryName);
  let result = null
  timer.start("queryExec")
  result = params ? await pool.query(query, params) : await pool.query(query)
  console.log(`${moment(new Date()).format("DD.MM.YYYY")} - Execution of query '${queryName}.sql' finished after ${timer.stop("queryExec").time.toFixed(4)}`)
  return result
}

module.exports = {
  run
}
