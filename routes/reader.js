'use strict';
var path = require('path');
var express = require('express');
var readerlogic = require(path.join(__dirname, '../Logic/Reader/ReaderLogic'));
var router = express.Router();

/* GET admin pages. */
router.get('/', function (req, res) {
    res.render("SearchMain", { title: "HTML" });
});

router.get('/login', function (req, res) {
    res.render("Login");
});

router.post('/authen', function (req, res) {
    if (req.body.logType == 'reader') {
        console.log("is a reader");
    }
    else if (req.body.logType == 'librarian') {
        console.log("is a librarian");
    }

    console.log('Form (from querystring): ' + req.body.logType );
});

router.get('/search_result', function (req, res) {
    var pt = req.query.bookname;
    readerlogic.searchBook(pt, function (info) {
        res.send(info);
    });
})

module.exports = router;