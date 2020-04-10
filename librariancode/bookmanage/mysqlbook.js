var path = require('path');
var mysql = require(path.join(__dirname, '../mysqlconnect.js')); 
var mysqluser = require(path.join(__dirname, '../MysqlCon.js')); 


//find the book according to bookID
function querybookID(bookID, callback) {

    var sql = 'select * from book230 where bookID=' + bookID;
    mysql.connection.query(sql, function (err, result) {
        if (err) {
            console.log('[querybookID ERROR] - ', err.message);
            return;
        }
        callback(null,result);
    });
   
}

//find the book according to bookname
function querybookname(bookname, callback) {
    if (bookname == "find all") {
        var sql = 'select * from book230';      
        mysql.connection.query(sql, function (err, result) {
            if (err) {
                console.log('[querybookname ERROR] - ', err.message);
                return;
            }
            //console.log('connect mysql successfully: ---------');
            callback(null, result);
        });
    }
    else {
        var sql = 'select * from book230 where bookname=?';
        var sqlParams = [bookname];
        mysql.connection.query(sql, sqlParams, function (err, result) {
            if (err) {
                console.log('[querybookname ERROR] - ', err.message);
                return;
            }
           // console.log('connect mysql successfully: ---------');
            callback(null, result);
        });
    } 
}

//update book
function updatebook(bookID, placefloor, placebookshelf, placeregion,  price, callback) {

    var modSql = 'UPDATE book230 SET placefloor=?, placebookshelf=?, placeregion=?, price=? WHERE bookId=?';
    var modSqlParams = [placefloor, placebookshelf, placeregion, price, bookID];
    //改
    mysql.connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[updatebook ERROR] - ', err.message);
            return;
        }    
        callback(null, 'update is ok');
    });

    //connection.end();
}


//delete book  
function deletebook(librarianID, bookID, callback) {
   

    var delSql = 'DELETE FROM book230 where bookID=?'; //根据bookID删除书籍
    var delSqlParams = [bookID];
    mysql.connection.query(delSql, delSqlParams, function (err, result) {
        if (err) {
            console.log('[deletebook ERROR] - ', err.message);
            return;
        }
        console.log('--------------------------DELETE----------------------------');
        console.log('deletebook Book', result.affectedRows);
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
        var time=nowdate.toLocaleString('english', { hour12: false });               //获取当前时间
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


//produce  bookID//debug完成
function produceBookID(bookname, type,callback) {
    var bookID;
    querycategory(type, function (error, data) {
        var headID = data[0].category_number;
        //检查是不是该类别第一本书
        //console.log(data[0]);
        if (data[0].book_sum == 0) {                                  //该类别里面没有书，即book_sum=0,后四位直接为0101           
            bookID = headID + "0101";
            editcategory(data[0].category_number, data[0].category_nm, data[0].book_sum + 1, function (error, data1) { });      //update book_sum       
            callback(null, bookID);
        }
        else {
            var sql = 'SELECT bookID FROM book230 where bookname = ?';
            var sqlParams = [bookname];
            mysql.connection.query(sql, sqlParams, function (err, result) {
                if (err) {
                    console.log('[produceBookID ERROR] - ', err.message);
                    return;
                }               
                if (result[0] == null) {                             //该类别里面有书，但没有这本书，这次是第一本，中间两位为boon_sum+1,后两位为01               
                    var midID = data[0].book_sum + 1;
                    if (midID < 10) midID = "0" + midID;
                    bookID = headID + midID + "01";
                    editcategory(data[0].category_number, data[0].category_nm, data[0].book_sum + 1, function (error, data) { });      //update book_sum  
                    callback(null, bookID);
                    
                    
                }
                else {                                                //该类别里面有同名书，直接获取前四位，后两位为副本号，为sum(bookname="输入的书名")+1
                    var laterID = parseInt((result[result.length - 1].bookID).substring(4, 6)) + 1;        
                    if (laterID < 10) laterID = "0" + laterID;
                    var frontID = (result[0].bookID).substring(0, 4);
                    bookID = frontID + laterID;
                    callback(null, bookID);

                }
            });
        }

    });
}


//查询bookcategory里面符合name的项
function querycategory(type, callback) {
    if (type == "find all") {
        mysql.connection.query('SELECT * from bookcategory230 ', function (err, results) {
            if (err) {
                console.log('[ERROR] - ', err.message);
                return;
            }
            //console.log(results);
            callback(null, results)
        });
    }
    else {
        mysql.connection.query('SELECT * from bookcategory230 where category_nm = "' + type + '"', function (err, results) {
            if (err) {
                console.log('[querycategory ERROR] - ', err.message);
                return;
            }
            //console.log(results)
            callback(null, results)
        });
    }
    
}


//编辑bookcategory里面的元素
function editcategory(number, type, book_sum, callback) {
    sql = " UPDATE bookcategory230 SET category_nm=?,book_sum=? WHERE category_number =?";
    sqlParams = [type, book_sum,number];
    mysql.connection.query(sql, sqlParams, function (err, result) {
        if (err) {
            console.log('[ERROR] - ', err.message);
            return;
        }      
       callback(null,"update bookcategory230 is ok");
    });
}





module.exports = {
    querybookID,
    querybookname,
    insertbook,
    deletebook,
    updatebook,
    deletemessage,
    produceBookID,
    querycategory,
    editcategory
};