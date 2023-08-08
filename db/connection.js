const mysql = require('mysql2');
require ('dotenv').config();


const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root', 
    password: process.env.MYSQL_PASSWORD,
    database: 'employeedb'
});

db.connect((err)=>{
    if (err) throw err;
})

module.exports = db;
