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

module.exports = router;