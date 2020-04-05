'use strict';
var express = require('express');
var router = express.Router();

/* GET admin pages. */
router.get('/', function (req, res) {
    res.render("LibraianMain", { title: "HTML" });
});

router.get('/login', function (req, res) {
    res.render("libLog");
});

router.post('/authen', function (req, res) {
    console.log('Form (from querystring): ' + req.body.account);
    res.render("Page2");
});

router.get('/editBook', function (req, res) {
    res.render("LibrarianEdit");
    /*var response = {
        "bookName": req.query.bookName,
        "bookCategory": req.query.bookCategory,
        "bookFloor": req.query.bookFloor,
        "bookSection": req.query.bookSection,
        "bookShelf": req.query.bookShelf
    };
    res.end(JSON.stringify(response));
    EditBook(req.query.bookCategory, req.query.bookFloor, req.query.bookSection, req.query.bookShelf, req.query.bookName);
    */
});

module.exports = router;