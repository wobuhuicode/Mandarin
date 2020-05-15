'use strict';
var path = require('path');
var express = require('express');
var mysqlbook = require(path.join(__dirname, '../librariancode/bookmanage/mysqlbook.js'));
var mysqluser = require(path.join(__dirname, '../librariancode/readermanage/mysqluser.js'));
var router = express.Router();

var loginlibrarian = {                       //currently logged in librarian
    librarianNM:"",
    librarianID:"",
    librarianPW:""
};

router.get('/', function (req, res) {
    res.render("LibrarianMain", { title: "HTML" });
});

//login in and store the current user information
router.post('/login_post', function (req, res) {
    console.log("the server get the request from login_post!");
    var response = {
        "librarianID": req.body.account,
        "password": req.body.pwd
    }
    if (response == null) res.end('the login resopnse is null!!!');
    else {
        mysqluser.querylibrarian(response.librarianID, response.password, function (error, data) {
            if (error) console.log("bug is in function querylibrarian!!!");

            if (data == "the user is not exit") {
                res.json({ code: 1 });                                 //the user is not exist
            }
            else if (data == "the password is error") {
                res.json({ code: 1 });                                    //password is error
            }
            else {
                loginlibrarian.librarianNM = data.librarian_NM; 
                loginlibrarian.librarianID = data.librarian_ID;
                loginlibrarian.librarianPW = data.librarian_PW;
                console.log("the current user is:");
                console.log(loginlibrarian);
                console.log("login successfully");                   //login is ok
                res.json({code: 0});
            } 
        });
    }
})

//send the current user
router.get('/username', function (req, res) {
    console.log("the server get the request from username!");
    //console.log("the current user is:"+loginlibrarian.librarianNM);
    res.json(loginlibrarian);
})


//***************************Bookmanage********************************
//open bookmanage.html
router.get('/bookmanage', function (req, res) {
    console.log('the request open the bookmanage.html')
    res.render("bookmanage");
});

//���������͵�ǰ��
router.post('/bookType_post', function (req, res) {
    console.log("server send the POST request search bookType!!!");
    mysqlbook.querycategory("find all", function (error, data) {
        res.json(data);
    })
})

//������
router.post('/searchbookname_post', function (req, res) {
    console.log("server send the POST request search book!!!");
    var response = {
        "bookname": req.body.searchbookname
    }
    console.log("the need find bookname is")  
    console.log(response);
    mysqlbook.querybookname(response.bookname, function (error, data) {
        //console.log(data);
        res.json(data);
    })

})


router.post('/searchbookID_post', function (req, res) {
    console.log("server send the POST request search book!!!");
    var response = {
        "searchbookID": req.body.searchbookID
    }
    console.log("the need find searchbookID is")
    console.log(response);
    mysqlbook.querybookID(response.searchbookID, function (error, data) {
        //console.log(data);
        res.json(data);
    })


})


router.post('/addbook_post', function (req, res) {
    console.log("server send the POST request add the book data");
    var response = {
        "bookName": req.body.bookName,
        "bookAuthor": req.body.bookAuthor,
        "bookType": req.body.bookType,
        "bookFloor": req.body.bookFloor,
        "bookShelf": req.body.bookShelf,
        "bookSection": req.body.bookSection,
        "bookPrice": req.body.bookPrice
    };
    console.log("the book need add is :");
    console.log(response);
   
    if (response != null) {
        var state = 1;                                       //state is intially 1
        var bookID;
        mysqlbook.produceBookID(response.bookName, response.bookType, function (error, data) {    
            bookID = data;  
            console.log("      "+response.bookName + ": automatically generated bookID is :" + bookID);         //consloe.log the bookID
            mysqlbook.insertbook(response.bookName, bookID, response.bookAuthor, response.bookFloor, response.bookShelf, response.bookSection, response.bookPrice, state, function (error, data) {
                if (error) console.log('error:bug is in function insertbook!!!!!');
                console.log('the addbook callback is' + data);
                res.send(data);
            });
        });// mysqlbook.produceBookID
              
    }//if
});//addbook_post


//delete the bookID from book230;
//then insert the delete operation meaasge into bookdelete230
router.post('/deletebook_post', function (req, res) {
    console.log("server send the POST request delete the book data");
    var response = {
        "deletebookID": req.body.deletebookID,
        "librarianID": loginlibrarian.librarianID
    }
    console.log("the need delete book is:");
    console.log(response);
    // first check the book is in table book230?    ****�������Ϊ����ģ�������Ƶ�ҳ��ɾ�����������Ѳ�ѯ����������ĵģ������ڵ���������������ҳ��֮��****
    //then if exist delete it and insert the delete operation meaasge into bookdelete230
    if (response != null) {
        mysqlbook.querybookID(response.deletebookID, function (error, data) {
            if (error) console.log('error:bug is in function querybook!!!!!');
            if (data[0] == null) {
                res.send("book is not here");
            }
            else {
                mysqlbook.deletebook(response.librarianID, response.deletebookID, function (error, data) {
                    if (error) console.log("bug is in function deletebook!!!");
                    //console.log("the deletebook callback is" + data);
                    res.send(data);
                });
            }//else
        });//mysqlbook.querybookID
    }//if
});


//update the bookID from table book230
router.post('/updatebook_post', function (req, res) {
    console.log("server send the POST request update the book data");

    var response = {
        "updatebookID": req.body.updatebookID,
        "bookFloor": req.body.bookFloor,
        "bookType": req.body.bookType,
        "bookShelf": req.body.bookShelf,
        "bookSection": req.body.bookSection,
        "bookPrice": req.body.bookPrice

    }
    console.log('the need updatebook is');
    console.log(response);

    if (response != null) {
        mysqlbook.querybookID(response.updatebookID, function (error, data) {
            if (error) console.log('error:bug is in function querybook!!!!!');
            if (data[0] == null) {
                res.send("book is not here");
            }
            else{
                mysqlbook.updatebook(response.updatebookID, response.bookFloor, response.bookShelf, response.bookSection, response.bookPrice, function (error, data) {
                    if (error) console.log("bug is in function updatebook");
                    //console.log("the updatebook callback is" + data);
                    res.send(data);

                });// mysqlbook.updatebook
            }//else
        })//mysqlbook.querybookID
    }//if


})


//lendbook
router.post('/lendbook_post', function (req, res) {
    var lend = {
        "lendreaderID": req.body.lendreaderID,
        "lendbookID": req.body.lendbookID
    }
    //console.log(lend);
    mysqlbook.lendbook(lend.lendreaderID, lend.lendbookID, function (error, data) {
        console.log("lend book result is : " + data);
        res.send(data);
    });

})


//returnbook
router.post('/returnbook_post', function (req, res) {
    var rebook = {
        "returnreaderID": req.body.returnreaderID,
        "returnbookID": req.body.returnbookID
    }
    //console.log(lend);
    mysqlbook.returnbook(rebook.returnreaderID, rebook.returnbookID, function (error, data) {
        console.log("return book result is : " + data);
        res.send(data);
    });
})


//queryhistory_readerID
router.post('/historysearch_post', function (req, res) {
    var history_readerID = {
        "history_readerID": req.body.history_readerID
    }
    console.log("the need search history readerID is :");
    console.log(history_readerID);
    mysqlbook.queryhistory_readerID(history_readerID.history_readerID, function (error, data) {
        res.json(data);
    })

})
//***************************Bookmanage********************************









//***************************Readermanage******************************
//open the addreader.html page
router.get('/addreader', function (req,res) {
    //console.log("sever send the GET request open the addreader.html page");
    res.render('addreader');
})
//send the information from table readerlogon
router.post('/register_post', function (req, res) {
    console.log("server send the POST request register_post");
    mysqluser.querylogon("find all",function (error, data) {
        if (error) console.log("the bug is in querylogon!");
        //console.log(data);
        res.json(data);
    });
})
//insert the readerID from table readerlogon into table reader 
//then delete readerID from table readerlogon  
router.post('/agree_post', function (req, res) {
    var response ={
       "readerID": req.body.readerID
    }
    //console.log(response.readerID);
    
    mysqluser.addreader(response.readerID, function (error, data1) {
        if (error) console.log("bug is in function addreader!");
        //console.log(data1);                                              //input the function addreader result
        mysqluser.deletelogon(response.readerID, function (error, data2) {
            if (error) console.log("bug is in function deletelogon!");
            //console.log(data2);                                          //input the function deletelogon result
            res.json("add reader is ok");
        });
    });
    
})
//delete readerID from table readerlogon  
router.post('/refuse_post', function (req, res) {
    var response = {
        "readerID": req.body.readerID
    }
    mysqluser.deletelogon(response.readerID, function (error, data2) {
        if (error) console.log("bug is in function deletelogon!");
        console.log(data2);
        res.json("refuse is ok");
    });
})
//***************************Readermanage******************************


module.exports = router;