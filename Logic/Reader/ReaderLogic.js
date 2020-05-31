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
    connection.query("SELECT * FROM book230 where bookname REGEXP '" + ptname + "' ORDER BY state DESC;", function (error, results) {
        if (error) throw error;
        connection.end();
        callback(results);
    });
    
}

function reserveBook(info, callback) {
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
    connection.query("INSERT INTO reserve230 VALUES ('" + info.bookID+"','NOW()','"+ info.readerID + "');", function (error, results) {
        connection.end();
        if (error) throw error;
        else
            callback(true);
    });

}


function getReserve(id, callback) {
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
    connection.query("SELECT * FROM book230 where readerID = '" + id + "' ORDER BY time DESC;", function (error, results) {
        if (error) throw error;
        connection.end();
        callback(results);
    });

}

function recommendBook(callback) {
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
    connection.query("SELECT * FROM book230 GROUP BY bookname);", function (error, results) {
        connection.end();
        if (error) throw error;
        else
            callback(results);
    });

}

var path = require('path');
var mysql = require(path.join(__dirname, '../MysqlCon'));
function compare(name, pwd, callback) {
    var sql = 'SELECT password FROM reader where readerID = "' + name + '"';
    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) {
            callback(false);
            console.log('wocuole');
        }
        else if (pwd == result[0].password) {
            callback(true);
            console.log('duile');
        }
    });
}

function selectname(id, callback) {
    var sql = 'SELECT readername FROM reader where readerID = "' + id + '"';
    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) {

            console.log('wocuole');
        }
        else {
            callback(result[0].readername);
            console.log(result[0].readername);
            console.log('duile');
        }
    });
}

function applyAccount(newone, callback) {
    mysql.connection.query("INSERT INTO readerlogon VALUES ('" + newone.readerID + "','" + newone.readerName + "','" + newone.readerEmail + "');", function (error, result) {
        if (error)
            callback(false);
        else
            callback(true);
        connection.end();
    });
}

const getReaderInfoById = (id) => {
    return new Promise((res, rej) => {
        // 获取读者信息
        mysql.connection.query(`SELECT * FROM reader WHERE readerID = ${id}`, function (error, results, fields) {
            if (error) throw error;
            let list = []
            results.forEach(result => {
                list.push(Object.assign({}, result))
            })
            res(list);
        });
    })
}

const updateReaderInfo = (reader) => {
    return new Promise((res, rej) => {
        // 更新读者信息
        mysql.connection.query(`UPDATE reader SET readername = '${reader.name}', email = '${reader.email}' WHERE readerID = ${reader.id}`, function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    })

}

const changePassword = (pass, id) => {
    return new Promise((res, rej) => {
        //修改密码
        mysql.connection.query(`UPDATE reader SET password = '${pass}' WHERE readerID = ${id}`, function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    })
}

const changePass = async (pass, id) => {
    try {
        await userModel.changePassword(pass, id)
        return true;
    } catch (e) {
        throw new Error('修改密码失败')
    }
}

function history()
{
    connection.connect();

    var sql = 'SELECT * FROM bookgoing230 ';

    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');
    });

    connection.end();
}

//计算某本书的借阅时间
function borrowtime(bookID)
{
    var mysql = require('mysql');

    var connection = mysql.createConnection({
        host: '49.234.115.108',
        user: 'memeda',
        password: 'mysqldemima',
        database: 'library230'
    });
    connection.connect();

    var sql = `select borrowTime from bookgoing230 where bookID = ${bookID} `;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        var temp = new String(result[0].borrowTime);
        var borrowTime = new Date(temp).getTime();
        var nowTime = Date.now();
        var differ = nowTime - borrowTime;
        //如果逾期则发出邮件提醒
        var nodemailer = require('nodemailer');
        const Transport = nodemailer.createTransport({
            service: 'qq',
            secure: true,
            auth: {
                user: '709472048@qq.com',
                pass: 'utaxgtgbfulkbfcj',
            }
        });

        const mailOptions = {
            from: "709472048@qq.com",
            to: "sxhqzhc@126.com",
            subject: "还书提醒",
            text: "您借的图书即将到期，请按时归还！"
        };

        if (differ > 3 && differ == 3) {
            Transport.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err);
                    res.json({ status: 400, msg: "send fail....." })
                } else {
                    console.log(data);
                    res.json({ status: 200, msg: "邮件发送成功....." })
                }
            });
        }
    });
    connection.end();
}

//定时遍历数据库中的bookID，并作为参数传递给borrowtime函数，以实时更新借阅天数，然后决定是否要发出提醒
function alert()
{
    var schedule = require('node-schedule');
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(0, 6)];
    rule.hour = 18;
    rule.minute = 0;
    //每天18点定时查询
    var j = schedule.scheduleJob(rule, function () {
        //获取数据表中的记录条数，便于循环检查借阅是否超时
        var connection = mysql.createConnection({
            host: '49.234.115.108',
            user: 'memeda',
            password: 'mysqldemima',
            database: 'library230',
            //允许执行多条sql语句
            multipleStatements: true
        });
        connection.connect();
        var sql = 'select count(*) as count from history; select bookID from bookgoing230 ';

        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            for (i = 0; i < result[0].count; i++)
            {
                var bookID = result[1].bookID;
                borrowTime(bookID);
            }
        });
    });
}

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'lanben_zyf@163.com',
        pass: 'OPHWXJJDGVNDKZCB' //授权码,通过163获取
    }
});

//邮件发布操作
function mailOptions(tomail, password) {
    var data = {
        from: 'lanben_zyf@163.com', // 发送者
        to: '' + tomail,           // 接受者
        subject: 'Recover your password', //邮件标题
        //text邮件文本
        text: 'Dear reader: \n ' +
            '      We heard that you lost your  password.  \n' +
            '       Sorry about that! But don\'t worry!   \n ' +
            '      We will help you recover your password. \n ' +
            '      Your password is  ' + password + '     \n  ' +
            '                                                                       Mandarin library'
    };
    transporter.sendMail(data, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(tomail);
        console.log('send successfully');
    });
};
//验证id 和 email
function comparemail(id, email, callback) {
    // getReaderPassword  
    var sql_1 = 'SELECT password FROM reader where readerID = "' + id + '"';
    mysql.connection.query(sql_1, function (err, result) {
        if (err || result.length == 0) {
            console.log('not get');
        }
        else {
            pwd = result[0].password;
            console.log(pwd);
            //return pwd;
        }
    });
    var sql = 'SELECT email FROM reader where readerID = "' + id + '"';
    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) {
            callback(false);
            console.log('shibaile');

        }
        else if (email == result[0].email) {
            console.log('chenggongle');
            callback(true);
            //send email
            mailOptions(email, pwd);
        }
    });
}

//getfine 
function changefine(id, fine) {
    var mysql = require('mysql')
    var connection = mysql.createConnection({
        host: '49.234.115.108',
        port: '3306',
        user: 'memeda',
        password: 'mysqldemima',
        database: 'mandarin'
    });
    console.log(fine);
    var sql = 'update reader set fine = ' + fine + ' where readerID = "' + id + '"';
    connection.connect();
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        else {
            console.log('successfully');
        }
    });
}

function getfine(id) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: '49.234.115.108',
        user: 'memeda',
        password: 'mysqldemima',
        database: 'library230'
    });
    var totalfine = 0;
    connection.connect();
    var sql = 'SELECT * FROM bookgoing230 where readerID = "' + id + '"';
    connection.query(sql, function (err, result) {
        if (err || result.length == 0) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        else {
            console.log(result);
            index = 0;
            sum = 0;
            differtime = 0;
            overdue = 0;
            while (index < result.length) {
                var temp1 = new String(result[index].borrowtime);
                var borrowTime = new Date(temp1).getTime();
                var temp2 = new String(result[index].returntime);
                var returnTime = new Date(temp2).getTime();
                var differ = returnTime - borrowTime;
                console.log(Math.round(differ / (24 * 60 * 60 * 1000)));
                differtime = Math.round(differ / (24 * 60 * 60 * 1000));
                overdue = differtime - 30;
                console.log(overdue);
                if (overdue > 0) {
                    sum += overdue;
                }
                console.log(sum);
                index++;
            }
            totalfine = sum;
            console.log('total fine is ' + totalfine + ' yuan');
            changefine(id, totalfine);
        }
    });
    connection.end();
}


module.exports = {
    searchBook,
    reserveBook,
    getReserve,
    recommendBook,
    compare,
    selectname,
    applyAccount,
    getReaderInfoById,
    updateReaderInfo,
    changePassword,
    changePass,
    sendemail,
    mailOptions,
    comparemail,
    borrowtime,
    alert,
    history,
    getfine,
    changefine
};
