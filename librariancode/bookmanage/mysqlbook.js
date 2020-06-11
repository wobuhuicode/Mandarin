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
    if (bookname == "") {
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
    //��
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
   

    var delSql = 'DELETE FROM book230 where bookID=?'; //����bookIDɾ���鼮
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
        var time=nowdate.toLocaleString('english', { hour12: false });               //��ȡ��ǰʱ��
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


//produce  bookID//debug���
function produceBookID(bookname, type,callback) {
    var bookID;
    querycategory(type, function (error, data) {
        var headID = data[0].category_number;
        //����ǲ��Ǹ�����һ����
        //console.log(data[0]);
        if (data[0].book_sum == 0) {                                  //���������û���飬��book_sum=0,����λֱ��Ϊ0101           
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
                if (result[0] == null) {                             //������������飬��û���Ȿ�飬����ǵ�һ�����м���λΪboon_sum+1,����λΪ01               
                    var midID = data[0].book_sum + 1;
                    if (midID < 10) midID = "0" + midID;
                    bookID = headID + midID + "01";
                    editcategory(data[0].category_number, data[0].category_nm, data[0].book_sum + 1, function (error, data) { });      //update book_sum  
                    callback(null, bookID);
                    
                    
                }
                else {                                                //�����������ͬ���飬ֱ�ӻ�ȡǰ��λ������λΪ�����ţ�Ϊsum(bookname="���������")+1
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


//��ѯbookcategory�������name����
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


//�༭bookcategory�����Ԫ��
function editcategory(number, type, book_sum, callback) {
    sql = " UPDATE bookcategory230 SET category_nm=?,book_sum=? WHERE category_number =?";
    sqlParams = [type, book_sum,number];
    mysql.connection.query(sql, sqlParams, function (err, result) {
        if (err) {
            console.log('[editcategory ERROR] - ', err.message);
            return;
        }      
       callback(null,"update bookcategory230 is ok");
    });
}


//����,���Ȳ�ѯ��ǰ�û��ѽ����Ƿ�С��3����Ȼ���ѯ�����Ƿ���ڣ��ٸ��ݶ���ID��ѯ�ö��ߵ�������������bookgoing230,�޸�book230ͼ��״̬
function lendbook(readerID, bookID, callback) {
    var sql1 = "select * from bookgoing230 where returntime is null and readerID= ?";
    //��ѯ��ǰ�û��ѽ����Ƿ�С��3��
    mysql.connection.query(sql1,[readerID], function (err, result) {
        if (err) {
            console.log('[lendbook ERROR] - ', err.message);
            return;
        }
        //console.log(result);      
        if (result.length >= 3) callback(null, "the reader has lend 3 books");
        else {
            var sql2 = "select * from book230 where bookID =?" ;
            //��ѯ�����Ƿ����
            mysql.connection.query(sql2, [bookID], function (err, result2) {
                if (err) {
                    console.log('[lendbook ERROR] - ', err.message);
                    return;
                }
                //console.log(result2);
                if (result2[0] == null) callback(null, "the book is not in library");
                else if (result2[0].state == 0) callback(null, "the book has been lend");
                else {
                    var sql3 = "insert into bookgoing230 values(?,?,?,?,?,?,?,?)";
                    var readername;
                    //���ݶ���id��ȡ��������
                    mysqluser.connection.query("select readername from reader where readerID=?" ,[readerID], function (err, result5) {
                        //console.log(result5);
                        if (result5[0] == null) callback(null, "the readerID is error");
                        else {
                            readername = result5[0].readername;
                            var nowdate = new Date();
                            var time = nowdate.toLocaleString('english', { hour12: false });
                            console.log(readername);
                            sqlParams = [readerID, readername, bookID, time, , , , ,];

                            //��¼������Ϣ
                            mysql.connection.query(sql3, sqlParams, function (err, result3) {
                                if (err) {
                                    console.log('[lendbook ERROR] - ', err.message);
                                    return;
                                }
                                else {
                                    //����ɹ����޸�ͼ��ݸ���״̬
                                    mysql.connection.query("update book230 set state=0  where bookID=?" ,[bookID], function (err, result4) { });
                                    callback(null, "lend is ok");
                                }

                            });//��¼������Ϣ
                        }
                        
                    })//���ݶ���id��ȡ��������
                    
                }             
            });
        }
    });
}


//����,�Ȼ�ȡ���µķ�������ٸ��ݶ���ID����ID�ҵ���Ӧ������Ƿ����ڣ�����ʱ�䣬����,�޸�book230ͼ��״̬
function returnbook(readerID, bookID, callback) {
    var sql1 = "select * from finerules230 order by changetime desc limit 1";
    //��ȡ���µķ������
    mysql.connection.query(sql1, function (err, result) {
        if (err) {
            console.log('[returnbook ERROR] - ', err.message);
            return;
        }
        //console.log(result);
        var sql2 = "select * from bookgoing230 where returntime is null and readerID =?  and bookID =? " ;
        //���ݶ���ID����ID�ҵ���Ӧ������Ƿ����ڣ�����ʱ�䣬����
        sqlParams = [readerID, bookID]
        mysql.connection.query(sql2, sqlParams,function (err, result2) {
            if (err) {
                console.log('[returnbook ERROR] - ', err.message);
                return;
            }
            if (result2[0] == null) callback(null, "the readerID or bookID is error please input again")
            else {
                var time1 = result2[0].borrowtime;
                var nowdate = new Date();
                var time2 = nowdate.toLocaleString('english', { hour12: false })             //�黹ʱ��
                var arrytime1 = (time1.split(" "))[0];                                       //ֻ��ȡ���ڣ�����ļ����Ӻ���
                var arrytime2 = (time2.split(" "))[0];
                var key = '/';
                var testtime1 = arrytime1.replace(new RegExp(key, 'g'), '-')                   //2020/5/8ת��Ϊ2020-5-8
                var testtime2 = arrytime2.replace(new RegExp(key, 'g'), '-')
                var diftime = datedifference(testtime1, testtime2);
                var overduetime = diftime - result[0].overdueTime;                          //����ʱ��
                var fine;
                if (overduetime > 0) {
                    fine = parseFloat(overduetime) * result[0].everydayFine;                                //������ʱ��>0������㷣��
                    //console.log(fine);
                    var sql3 = "update bookgoing230 set returntime=?,overduetime=?,fine=?,paid=? where readerID=? and bookID=? and borrowtime=?"
                    sql3Params = [time2, overduetime, fine, 0, result2[0].readerID, result2[0].bookID, result2[0].borrowtime];
                    //����
                    mysql.connection.query(sql3, sql3Params, function (err, result3) {
                        if (err) {
                            console.log('[returnbook ERROR] - ', err.message);
                            return;
                        }
                        //����ɹ���������������
                        insertincome(time2, result2[0].readerID, 'fine', fine);
                        //����ɹ����޸�ͼ��ݸ���״̬
                        mysql.connection.query("update book230 set `state` = '1'  where bookID=?" ,[bookID], function (err, result4) { });
                        callback(null, "return is ok but the reader has overduetime ,please pay a fine of " + fine);
                    })
                }
                else {                                                                    //û������
                    var sql3 = "update bookgoing230 set returntime=? where readerID=? and bookID=? and borrowtime=?"
                    sql3Params = [time2, result2[0].readerID, result2[0].bookID, result2[0].borrowtime];
                    mysql.connection.query(sql3, sql3Params, function (err, result3) {
                        if (err) {
                            console.log('[returnbook ERROR] - ', err.message);
                            return;
                        }
                        //����ɹ����޸�ͼ��ݸ���״̬
                        mysql.connection.query("update book230 set `state` = '1'  where bookID = ?" [bookID], function (err, result4) { });
                        callback(null, "return is ok");
                    })
                }
            }
            

        })

    });

}


//��������ʱ�����������ע�������ʽΪ2020-5-8
function datedifference(sDate1, sDate2) {    //sDate1��sDate2��2006-12-18��ʽ 
    var dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};


//���ݶ���ID��ѯ���߽��ļ�¼�������¼
function queryhistory_readerID(readerID, callback) {
    if (readerID == "") {
        var selectSQL = 'select * from bookgoing230';
    }
    else var selectSQL = 'select * from bookgoing230 where ReaderID =' + readerID;
    mysql.connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log('[queryhistory ERROR] - ', err.message);
        }
        callback(null, result);
    });
}

//���ݶ���������ѯ���߽��ļ�¼�������¼
function queryhistory_readername(readername, callback) {
    var sql = 'select * from bookgoing230 where readername=?';
    var sqlParams = [readername];
    mysql.connection.query(sql, sqlParams, function (err, result) {
        if (err) {
            console.log('[queryreadername ERROR] - ', err.message);
            return;
        }
        callback(null, result);
    });
}



//insert news
function addnews(newstitle, newscontent,callback) {
    var modSql = 'insert into news values(?,?,?)';
    var nowdate = new Date();
    var time = nowdate.toLocaleString('english', { hour12: false });               //��ȡ��ǰʱ��

    var modSqlParams = [time,newstitle, newscontent];

    mysql.connection.query(modSql, modSqlParams, function (err, result) {
        if (err) {
            console.log('[ADD ERROR]-', err.message);
            return;
        }
        callback(null, 'add news is ok')
    });
}//mysqlbook.js


//��ѯ���µĹ���
function querynews(callback) {
    var modSql = 'select * from news order by newstime desc limit 1';
    
    mysql.connection.query(modSql, function (err, result) {
        if (err) {
            console.log('[ADD ERROR]-', err.message);
            return;
        }
        callback(null, result);
    });
}//mysqlbook.js

//���searchtime���ڵ�������Ϣ
function queryincome_time(searchtime, callback) {
    var arrayobject = new Array();
    var sql = "select * from income230  ";
    mysql.connection.query(sql, function (err, result) {
        if (err) {
            console.log('[queryincome_time ERROR] - ', err.message);
            return;
        }
        i = 0;
        j = 0;
        for (i; i < result.length; i++) {
            var time1 = result[i].incometime;
            var nowdate = new Date();
            var time2 = nowdate.toLocaleString('english', { hour12: false })             //ʱ��
            var arrytime1 = (time1.split(" "))[0];                                       //ֻ��ȡ���ڣ�����ļ����Ӻ���
            var arrytime2 = (time2.split(" "))[0];
            var key = '/';
            var testtime1 = arrytime1.replace(new RegExp(key, 'g'), '-')                   //2020/5/8ת��Ϊ2020-5-8
            var testtime2 = arrytime2.replace(new RegExp(key, 'g'), '-')
            var diftime = datedifference(testtime2, testtime1);
            if (diftime <= searchtime) {
                arrayobject[j++] = {
                    "incometime": result[i].incometime,
                    "readerID": result[i].readerID,
                    "incomeway": result[i].incomeway,
                    "money": result[i].money
                }
            }
        } callback(null, arrayobject);
    });


}


//�������뵽income230
function insertincome(incometime, readerID, incomeway, money) {
    var sql = "insert into income230 values(?,?,?,?)";
    sqlParams = [incometime, readerID, incomeway, money];
    mysql.connection.query(sql, sqlParams, function (err, result) {
        if (err) {
            console.log('[insertincome ERROR] - ', err.message);
            return;
        }

    });
}

/*
queryhistory_readerID("12345678901", function (err, data) {

    console.log(data);
})


querynews(function (err, data) {
    console.log(data);
});

*/
module.exports = {
    querybookID,
    querybookname,
    insertbook,
    deletebook,
    updatebook,
    deletemessage,
    produceBookID,
    querycategory,
    editcategory,
    lendbook,
    returnbook,
    queryhistory_readerID,
    addnews,
    querynews,
    queryincome_time,
    insertincome
};