var mysql = require('mysql');

//table mandarin
var connection = mysql.createConnection({
    host: '49.234.115.108',
    port: '3306',
    user: 'memeda',
    password: 'mysqldemima',
    database: 'mandarin'
});

connection.connect();

module.exports = { connection };