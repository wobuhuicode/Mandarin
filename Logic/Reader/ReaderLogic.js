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


var path = require('path');
var mysql = require(path.join(__dirname,'../MysqlCon'));
function login(name, password, callback) {
    var sql = 'SELECT password FROM reader where readerID = "' + name + '"';
    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) {
            callback(false);
            console.log('wocuole');
        }
        else if (password == result[0].password) {
            console.log('duile');
            callback(true);
        }
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
const get_HistoryListInfo = (int status, String aid) => {
    //查阅历史记录
    String sql = "SELECT * FROM history WHERE aid='" + aid + "' and status='" + status + "'";
    PreparedStatement stm = null;
    ResultSet rs = null;
    try {
        stm = conn.prepareStatement(sql);
        rs = stm.executeQuery();
        while (rs.next()) {
            HistoryBean tag = new HistoryBean();
            tag.setHid(rs.getInt("hid"));
            tag.setAid(rs.getInt("aid"));
            tag.setBid(rs.getInt("bid"));
            tag.setBookname(rs.getString("bookname"));
            tag.setCard(rs.getString("card"));
            tag.setAdminname(rs.getString("adminname"));
            tag.setUsername(rs.getString("username"));
            tag.setBegintime(rs.getString("begintime"));
            tag.setEndtime(rs.getString("endtime"));
            tag.setStatus(rs.getInt("status"));
            tag_Array.add(tag);
        }
    } catch (SQLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }finally {
        DBUtil.CloseDB(rs, stm, conn);
    }
    return tag_Array;
}

module.exports = {
    searchBook,
    login,
    getReaderInfoById,
    updateReaderInfo,
    changePassword,
    changePass,
    get_HistoryListInfo
};