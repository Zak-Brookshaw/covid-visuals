require('dotenv').config()
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DBNAME,
    password: process.env.POSTGRES_PASSWORD
});

module.exports = pool