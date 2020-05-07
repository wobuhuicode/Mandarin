var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '49.234.115.108',
    port: '3306',
    user: 'memeda',
    password: 'mysqldemima',
    database: 'mandarin'
});
var connection1 = mysql.createConnection({
    host: '49.234.115.108',
    port: '3306',
    user: 'memeda',
    password: 'mysqldemima',
    database: 'library230'
});
connection.connect();

module.exports = {
    connection,
    connection1
};