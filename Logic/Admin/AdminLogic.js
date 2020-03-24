var path = require('path');
var mysql = require(path.join(__dirname, '../MysqlCon')); 

function compare(name, password, callback) {
    var sql = 'SELECT admin_pw FROM admin where admin_ID ="' + name + '"';

    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) {
            callback(false);
        }
        else if (password == result[0].admin_pw) callback(true);
    });
}

function lookupLibrarian(name, callback) {
    mysql.connection.query('SELECT * from librarian where librarian_ID = "' + name + '"', function (error, results, fields) {
        if (results.length == 1) callback(true, results[0].librarian_ID, results[0].librarian_PW);
        else callback(false, null, null);
    });
}

function updateLibrarian(curName, newName, newPassword, callback) {
    mysql.connection.query('delete from librarian where librarian_ID = ' + curName, function (error, results) {
        if (error) {
            callback(false);
            return;
        }

        mysql.connection.query('insert into librarian values("' + newName + '","' + newPassword + '")', function (error, results) {
        if (error) callback(false);
        else if (results.affectedRows == 1) callback(true);
        });
    });
    
};

function addLibrarian(name, password, callback) {

    mysql.connection.query('select * from librarian where librarian_ID = ' + name, function (err, result) {
        if (err || result.length != 0) {
            callback(2);
            return;
        }

        mysql.connection.query('insert into librarian values("' + name + '","' + password + '")', function (err, results) {
            if (err) callback(1);
            else if (results.affectedRows == 1) callback(0);
            console.log("Add OK!");
        });
    });
}

    

module.exports = {
    compare,
    lookupLibrarian,
    updateLibrarian,
    addLibrarian
}