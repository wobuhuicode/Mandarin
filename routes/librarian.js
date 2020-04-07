'use strict';
var path = require('path');
var express = require('express');
var mysqlbook = require(path.join(__dirname, '../librariancode/bookmanage/mysqlbook.js'));
var mysqluser = require(path.join(__dirname, '../librariancode/readermanage/mysqluser.js'));
var router = express.Router();

var loginlibrarian = {                       //(当前登陆的管理员)currently logged in librarian
    librarianNM:"",
    librarianID:"",
    librarianPW:""
};

router.get('/', function (req, res) {
    res.render("LibrarianMain", { title: "HTML" });
   
});

//open libLog.html
router.get('/login', function (req, res) {
    res.render("libLog");
   
});
//login in and store the current user information
router.post('/login_post', function (req, res) {
    console.log("the server get the request from login_post!");
    var response = {
        "librarianID": req.body.librarianID,
        "password": req.body.password
    }
    if (response == null) res.end('the login resopnse is null!!!');
    else {
        mysqluser.querylibrarian(response.librarianID, response.password, function (error, data) {
            if (error) console.log("bug is in function querylibrarian!!!");

            if (data == "the user is not exit") {
                res.send(data);                                        //the user is not exit
            }
            else if (data == "the password is error") {
                res.send(data);                                        //password is error
            }
            else {
                loginlibrarian.librarianNM = data.librarian_NM; 
                loginlibrarian.librarianID = data.librarian_ID;
                loginlibrarian.librarianPW = data.librarian_PW;
                console.log("the current user is:");
                console.log(loginlibrarian);
                console.log("login successfully");                   //login is ok
                res.send("login successfully");
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



router.get('/addbook', function (req, res) {
    console.log('the request open the LibraianMain.html')
    res.render("addbook");
});
//**********this bookID is incomplete*********
router.post('/addbook_post', function (req, res) {
    console.log("sever send the POST request read the book data");
    var response = {
        "bookName": req.body.bookName,
        "bookAuthor": req.body.bookAuthor,
        "bookFloor": req.body.bookFloor,
        "bookShelf": req.body.bookShelf,
        "bookSection": req.body.bookSection,
        "bookPrice": req.body.bookPrice
    };
    console.log(JSON.stringify(response));
    if (response != null) {
        var state = 1;                                  //state is intially 1

        var bookID = "654321";                         //**********this station is incomplete*********
        mysqlbook.insertbook(response.bookName, bookID, response.bookAuthor, response.bookFloor, response.bookShelf, response.bookSection, response.bookPrice, state, function (error, data) {
            if (error) console.log('error:bug is in function insertbook!!!!!');
            console.log('the addbook callback is' + data);
            res.send(data);
        })
    }
})



//open the  deletebook.html
router.get('/deletebook', function (req, res) {
    console.log("the request open the deletebook.html")
    //res.sendFile(__dirname + "../views/deletebook.html");
    res.render('deletebook');
})
//delete the bookID from book230;
//then insert the delete operation meaasge into bookdelete230
router.post('/deletebook_post', function (req, res) {
    console.log("sever send the POST request delete the book data");
    var response = {
        "deletebookID": req.body.deletebookID,
        "librarianID": loginlibrarian.librarianID                                         
    }
    // first check the book is in table book230?
    //then if exist delete it and insert the delete operation meaasge into bookdelete230
    if (response != null) {
        mysqlbook.querybook(response.deletebookID, function (error, data) {
            if (error) console.log('error:bug is in function querybook!!!!!');
            if (data == "book is not here") {
                res.send(data);
            }
            else if (data == "book is found") {
                mysqlbook.deletebook(response.librarianID, response.deletebookID, function (error, data) {
                    if (error) console.log("bug is in function deletebook!!!");
                    console.log("the deletebook callback is" + data);
                    res.send(data);
                });
            }
        })
    }
})



//open the  upadtebook.html
router.get('/updatebook', function (req, res) {
    console.log("sever send the GET request open the updateook.html page");
    res.render('updatebook');
})
//update the bookID from table book230
router.post('/updatebook_post', function (req, res) {
    console.log("server send the POST request update the book data");

    var response = {
        "updatebookID": req.body.updatebookID,
        "bookFloor": req.body.bookFloor,
        "bookShelf": req.body.bookShelf,
        "bookSection": req.body.bookSection,
        "bookPrice": req.body.bookPrice

    }
    // console.log('the updatebook is' + JSON.stringify(response));

    if (response != null) {
        mysqlbook.querybook(response.updatebookID, function (error, data) {
            if (error) console.log('error:bug is in function querybook!!!!!');
            if (data == "book is not here") {
                res.send(data);
            }
            else if (data == "book is found") {
                mysqlbook.updatebook(response.updatebookID, response.bookFloor, response.bookShelf, response.bookSection, response.bookPrice, function (error, data) {
                    if (error) console.log("bug is in function updatebook");
                    console.log("the updatebook callback is" + data);
                    res.send(data);

                });
            }
        })
    }


})



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





module.exports = router;