const {Pool} = require('pg');

const dbConfig = {
    pool: new Pool({
        user: 'nmreaywv',
        database: 'nmreaywv',
        password: '0b7ptGthoenjm54gnlhB7gGrvRazhain',
        host: 'balarama.db.elephantsql.com',
        port: 5432,
        max: 3,
        idleTimeoutMillis: 30000
    })
};
module.exports = dbConfig;
