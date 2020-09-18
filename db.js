require("dotenv").config();

const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE

var db;

function connectDatabase() {
    if (!db) {
        db = require('knex')({
            client: 'pg',
            connection: {
              host : HOST,
              user : "eevaxebn",
              password : PASSWORD,
              database : DATABASE
            },
            pool: {min: 0, max: 1}
        });
    }

    return db
}

module.exports = connectDatabase()

