'use strict';
var express = require('express');
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

module.exports = router;