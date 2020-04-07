function searchBook(ptname, callback) {
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host: '49.234.115.108',
        user: 'memeda',
        password: 'mysqldemima',
        database: 'library230'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        //console.log('connected as id ' + connection.threadId);
    });
    connection.query("SELECT * FROM book230 where bookname='" + ptname + "';", function (error, results) {
        if (error) throw error;
        connection.end();
        callback(results);
    });
    
}


var path = require('path');
var mysql = require(path.join(__dirname,'../MysqlCon'));
function login(name, password, callback) {
    var sql = 'SELECT password FROM reader where readerID = "' + name + '"';
    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) { callback(false); }
        else if (password == result[0].password) { callback(true); }
    });
}

module.exports = {
    searchBook,
    login
};