const mysql = require('mysql2');
const dotenv = require ('dotenv').config();
//dotenv.config({path: '../config.env'});

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', 
    password: 'Password123!',
    database: 'employeedb'
});

db.connect((err)=>{
    if (err) throw err;
})

module.exports = db;

//process.env.DATABASE_PASSWORD