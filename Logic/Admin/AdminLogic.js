var path = require('path');
var mysql = require(path.join(__dirname, '../MysqlCon')); 

function compare(name, password, callback) {
    //��ѯ���
    var sql = 'SELECT admin_pw FROM admin where admin_ID ="' + name + '"';

    mysql.connection.query(sql, function (err, result) {
        //��������쳣����δ��ѯ�����������·���лص����������ݲ���false
        if (err || result.length == 0) {
            callback(false);
        }
        //����ɹ���ѯ������������е����������ݿ��е�һ�£�����·���лص����������ݲ���true
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


function moddeposit(deposit, cycle, callback) {
    mysql.connection.query('select * from depositandcycle', function (err, result) {
        if (err) {
            return false;
        } else {
            if (deposit == result[0].deposit) {
                mysql.connection.query('update depositandcycle set cycle = ' + cycle + ' where deposit =' + deposit, function (err, result) {
                    if (err) return false;
                })
                mysql.connection1.query('update finerules230 set overdueTime = ' + cycle + ' where deposit =' + result[0].deposit, function (err, result) {
                    if (err) return false;
                    else callback(true);
                })
            } else if (cycle == result[0].cycle) {
                mysql.connection.query('update depositandcycle set deposit = ' + deposit + ' where cycle =' + cycle, function (err, result) {
                    if (err) return false;
                })
                mysql.connection1.query('update finerules230 set deposit = ' + deposit + ' where deposit =' + result[0].deposit, function (err, result) {
                    if (err) return false;
                    else callback(true);
                })
            } else {
                mysql.connection.query('update depositandcycle set deposit = ' + deposit + ',cycle = ' + cycle + ' where deposit =' + result[0].deposit, function (err, result) {
                    if (err) return false;
                })
                mysql.connection1.query('update finerules230 set deposit = ' + deposit + ',overdueTime = '+cycle+' where deposit =' + result[0].deposit, function (err, result) {
                    if (err) return false;
                    else callback(true);
                })
            }
        } 
    })
}

function getInfo(callback) {
        mysql.connection1.query('select overdueTime,everydayFine,maxFine,deposit from finerules230', function (err, results) {
              if (err) return false;
              else callback(results);
        })
};

function modFine(eve, max, callback) {
    mysql.connection1.query('update finerules230 set maxFine = ' +eve+ ', everydayFine = ' +max+ ' where ID = 1', function (err, result) {
        if (err) return false;
        else callback(true);
    })
}

function deleteLibrarian(curID, callback) {
    var sql = "delete from librarian where librarian_ID = '" + curID + "'";
    mysql.connection.query(sql, function (err, result) {
        if (err) callback(false);
        else callback(true);
    })
}

module.exports = {
    compare,
    lookupLibrarian,
    updateLibrarian,
    repeatLibrarianID,
    addLibrarian,
    getlibInfo,
    updateLibrarianPwd,
    moddeposit,
    getInfo,
    modFine,
    deleteLibrarian
}