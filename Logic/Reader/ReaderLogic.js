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
    connection.query("SELECT * FROM book230 where bookname REGEXP'" + ptname + "';", function (error, results) {
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
    connection.query("INSERT INTO reserve230 VALUES ('" + info.bookID+"','"+info.time+"','"+ info.readerID + "');", function (error, results) {
        connection.end();
        if (error) throw error;
        else
            callback(true);
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
    let mysql = require(path.join(__dirname, '../MysqlCon'));
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

//计算还有多少天还书
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '49.234.115.108',
    user: 'memeda',
    password: 'mysqldemima',
    database: 'library230'
});
connection.connect();

var sql = 'select borrowTime from history where bookID = 00001 ';

connection.query(sql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    var temp = new String(result[0].borrowTime);
    var borrowTime = new Date(temp).getTime();
    var nowTime = Date.now();
    var differ = nowTime - borrowTime;
    console.log("已经借书" + Math.round(differ / (24 * 60 * 60 * 1000)) + "天");
});

connection.end();
//书籍要到期时接收邮件提醒
function sendemail(differ)
{
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

    if (differ < 5 && differ == 5) {
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

module.exports = {
    searchBook,
    reserveBook,
    compare,
    selectname,
    applyAccount,
    getReaderInfoById,
    updateReaderInfo,
    changePassword,
    changePass,
    sendemail,
    mailOptions,
    comparemail
};
