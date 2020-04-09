var path = require('path');
var mysql = require(path.join(__dirname, '../MysqlCon')); 

function compare(name, password, callback) {
    //查询语句
    var sql = 'SELECT admin_pw FROM admin where admin_ID ="' + name + '"';

    mysql.connection.query(sql, function (err, result) {
        //如果出现异常或者未查询到结果，调用路由中回调函数，传递参数false
        if (err || result.length == 0) {
            callback(false);
        }
        //如果成功查询到结果且请求中的密码与数据库中的一致，调用路由中回调函数，传递参数true
        else if (password == result[0].admin_pw) callback(true);
    });

}

function lookupLibrarian(name, callback) {
    mysql.connection.query('SELECT * from librarian where librarian_ID = "' + name + '"', function (error, results, fields) {
        if (results.length == 1) callback(true, results[0].librarian_NM, results[0].librarian_ID);
        else callback(false, null, null);
    });
}

function updateLibrarian(curID, newName, newID, callback) {
    var sql = "update mandarin.librarian set librarian_ID = '" + newID + "', librarian_NM = '" + newName + "' where librarian_ID = '" + curID + "'"
    mysql.connection.query(sql, function (error, results) {
        if (error) callback(false);
        else if (results.affectedRows == 1) callback(true);
    });
};

function repeatLibrarianID(ID, callback) {
    mysql.connection.query("select * from librarian where librarian_ID = '" + ID + "';", function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
            callback(1);
        } else {
            callback(0);
        }
    });
}

function updateLibrarianPwd(curID, newPwd, callback) {
    var sql = "update mandarin.librarian set librarian_PW = ? where librarian_ID = ?";
    var data = [newPwd, curID];
    mysql.connection.query(sql, data, function (err, result) {
        if (err) throw err;
        if (result.affectedRows == 1) callback(true);
        else callback(false);
    })
}

function addLibrarian(name, ID, password) {
    var addSql = "insert into librarian(librarian_NM,librarian_ID,librarian_PW) values(?,?,?);";
    var addData = [name, ID, password];
    mysql.connection.query(addSql, addData, function (err, result) {
        if (err) {
            console.log('INSERT ERROR - ' + err.message);
            return 0;
        }
    })
}
  
function getlibInfo(callback) {
    var res = new Object();
    mysql.connection.query('select * from librarian', function (err, result) {
        if (err) return 0;
        else callback(result);
    })
};

module.exports = {
    compare,
    lookupLibrarian,
    updateLibrarian,
    repeatLibrarianID,
    addLibrarian,
    getlibInfo,
    updateLibrarianPwd
}