//var mysql = require('mysql')
var path = require('path');
var mysql = require(path.join(__dirname, '../mysqlconnect.js'));
var mysql = require(path.join(__dirname, '../MysqlCon.js'));

//edit account
//query data

function queryaccount(readerID, callback) {
    //if (readerID == "find all") var selectSQL = 'select * from reader';
    var selectSQL = 'select * from reader where readerID ='+ readerID;
    mysql.connection.query(selectSQL, function (err, result) {  // [readerID], 
        if (err) {
            console.log('[query ERROR] - ', err.message);
        }
        callback(null, result);
    });
}

//insert data
function insertaccount(readerID, callback) {
    var selectSQL1 = 'select * from reader where readerID =' + readerID; //用户缴纳保证金后为其创建一个帐号
    mysql.connection.query(selectSQL1, function (err, result1) {
        if (err) {
            console.log('[query logon ERROR] - ', err.message);
            return;
        }
        console.log("the reader to add is: ");
        console.log(result1);
        var addSql = 'INSERT INTO reader(readerID,readername,email,password) VALUES(?,?,?,?)';
        var addSqlParams = [result1[0].readerID, result1[0].readerName, result1[0].email, result1[0].password];
        connection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[add ERROR] - ', err.message);
                return;
            }
            callback(null, 'insert reader is done');
        });
    });
}


//update data
function updateaccount(readerID, readername, email, password, balance, callback) {
    var modSql = 'UPDATE reader SET readername=?, email=?, password=?, balance=? WHERE readerID=?';
    var modSqlParams = [readername, email, password, balance,readerID];
    mysql.connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[updateaccount ERROR] - ', err.message);
            return;
        }
        callback(null, 'update is ok');
    });
    //connection.end();
}


//delete data when balance is not enough
function deleteaccount(readerID, callback) {
    var delSql = 'DELETE FROM reader where balance readerID=' + readerID;
    mysql.connection.query(delSql, function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
        console.log('DELETE affectedRows', result.affectedRows);
        callback(null, "delete " + readerID + "is ok");
    });
}

module.exports = {
    queryaccount,
    insertaccount,
    updateaccount,
    deleteaccount
}
