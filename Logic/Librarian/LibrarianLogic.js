//var path = require('path');
//var mysql = require(path.join(__dirname, '../MysqlCon')); 

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'library'
});
connection.connect();

//编辑书籍信息
function EditBook(Category, Floor, Section, Shelf, bookName, callback) {
    //编辑书籍类别，根据书名编辑类别，可以一次更改所有同名书
    //6位ID，前2位表示类别
    var modSql = 'UPDATE book SET bookID = CONCAT(?, SUBSTRING(bookID,3,6)), placefloor=?, placebookshelf=?, placeregion=? WHERE bookname=?';
    var modSqlParams = [Category, Floor, Shelf, Section, bookName];
    mysql.connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return;
            callback(false);
        }
        console.log('--------------------------UPDATE----------------------------');
        console.log('UPDATE affectedRows', result.affectedRows);
        console.log('-----------------------------------------------------------------\n\n');
        return;
        callback(true);
    });
}

module.exports = {
    EditBook
}