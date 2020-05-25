var path = require('path');
var mysql = require(path.join(__dirname, '../MysqlCon.js')); 

//query the librarian information for librarian logining
function querylibrarian(librarian_ID, librarian_PW, callback) {                  
    //console.log("enter the function querylibrarian");
    var selectSQL = 'select * from librarian where librarian_ID = ' + librarian_ID;
    mysql.connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log('[login ERROR] - ', err.message);
            return;
        }
        if (result[0] == null) {
            callback(null, "the user is not exit");                                 //the user is not exit
        }
        else if (result[0].librarian_PW != librarian_PW) {
            callback(null, "the password is error");                                 //the password is error
        }
        else {
              callback(null, result[0]);                                                                     //login is ok
        }                                                   
         
    });
}

/*if ReadeID="find all"  ,query all reader login_post from table readerlogon  
else query someone according to the readerID
*/
function querylogon(readerID, callback) {
    if (readerID == "find all") var selectSQL = 'select * from readerlogon';    
    else var selectSQL = 'select * from readerlogon where ReaderID =' + readerID;
    mysql.connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log('[login ERROR] - ', err.message);
        }
        callback(null, result);
    });
}
//delete readerID from table readerlogon  
function deletelogon(readerID, callback) {
    console.log("the Reader registration requset need delete is : "+readerID);
    var deleteSQL = 'delete from readerlogon where ReaderID =' + readerID;
    mysql.connection.query(deleteSQL, function (err, result) {
        if (err) {
            console.log('[DELETE ERROR] - ', err.message);
            return;
        }
        callback(null, "delete " + readerID+"is ok");
    });

}
//insert the readerID from table readerlogon into table reader
function addreader(readerID,callback) {
    var selectSQL1 = 'select * from readerlogon where ReaderID =' + readerID;
    mysql.connection.query(selectSQL1, function (err, result1) {
        if (err) {
            console.log('[query logon ERROR] - ', err.message);
            return;
        }
        console.log("the reader to add is: ");
        console.log(result1);
        var addSql = 'INSERT INTO reader(readerID,readername,email,password) VALUES(?,?,?,?)';
        var addSqlParams = [result1[0].ReaderID, result1[0].ReaderName, result1[0].Email, result1[0].Password];
        mysql.connection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[add ERROR] - ', err.message);
                return;
            }
            callback(null, 'add reader is done');
        });
    });  
    var nowdate = new Date();
    var time = nowdate.toLocaleString('english', { hour12: false })             //交保证金时间                             
    mysqlbook.insertincome(time, result1[0].ReaderID, 'deposit', '300');
}




module.exports={
    querylibrarian,
    addreader,
    querylogon,
    deletelogon
}

