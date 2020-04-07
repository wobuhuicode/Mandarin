var path = require('path');
var mysql = require(path.join(__dirname, '../mysqlconnect.js')); 
var mysqluser = require(path.join(__dirname, '../MysqlCon.js')); 


//find the book
function querybook(bookID, callback) {

    var sql = 'select * from book230 where bookID=' + bookID;
    mysql.connection.query(sql, function (error, result) {
        if (error) throw error;
        console.log('connect mysql successfully: ---------');
        console.log(result);
        if (result[0] != null) callback(null, "book is found");
        else callback(null,'book is not here')
    });
    // connection.end();
}


//update book
function updatebook(bookID, placefloor, placebookshelf, placeregion,  price, callback) {

    var modSql = 'UPDATE book230 SET placefloor=?, placebookshelf=?, placeregion=?, price=? WHERE bookId=?';
    var modSqlParams = [placefloor, placebookshelf, placeregion, price, bookID];
    //改
    mysql.connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
            return;
        }    
        callback(null, 'update is ok');
    });

    //connection.end();
}


//delete book
function deletebook(librarianID, bookID, callback) {
    //delete 删除书籍    

    var delSql = 'DELETE FROM book230 where bookID=?'; //根据bookID删除书籍
    var delSqlParams = [bookID];
    mysql.connection.query(delSql, delSqlParams, function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
        console.log('--------------------------DELETE----------------------------');
        console.log('DELETE affectedRows', result.affectedRows);
        console.log('-----------------------------------------------------------------\n\n');  
        deletemessage( librarianID,bookID);
        callback(null, 'delete is ok');
    });
}


//add book
function insertbook(bookname, bookID, author, placefloor, placebookshelf, placeregion, price, state, callback) {

    var modSql = 'insert into book230 values(?,?,?,?,?,?,?,?)';
    var modSqlParams = [bookname, bookID, author, placefloor, placebookshelf, placeregion, price, state];
    mysql.connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[ADD ERROR] - ', err.message);
            return;
        }
        callback(null, 'add is ok')
    });
    //connection.end();
}

//add delete operation meaasge to bookdelete230
function deletemessage(librarianID,bookID) {
    var sql1 = 'select * from librarian where librarian_ID = ' + librarianID;
    mysqluser.connection.query(sql1, function (err,result) {
        if (err) {
            console.log('[query librarian ERROR] - ', err.message);
            return;
        }

        console.log(result[0]);
        var nowdate = new Date();
        var time=nowdate.toLocaleString('english', { hour12: false });
        var sql2 = "insert into bookdelete230 values(?,?,?,?)";
        var modSqlParams = [result[0].librarian_ID, result[0].librarian_NM, bookID, time];
        mysql.connection.query(sql2, modSqlParams, function (err, result) {
            if (err) {
                console.log('[add bookdelete230 ERROR] - ', err.message);
                return;
            }
        })

    });
}





module.exports = {
    querybook,
    insertbook,
    deletebook,
    updatebook,
    deletemessage
};