'use strict';
var path = require('path');
var express = require('express');
var readerlogic = require(path.join(__dirname, '../Logic/Reader/ReaderLogic'));
var router = express.Router();

/* GET admin pages. */
router.get('/search', function (req, res) {
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
//    res.render("readerLog", { title: "HTML" });

router.get('/apply', function (req, res) {
    res.render("ApplyReaderAccount", { title: "HTML" });
})
/*router.post('/authen', function (req, res) {
    console.log('Form (from querystring): ' + req.body.account);
    res.render("Page2");
});*/

router.get('/search_result', function (req, res) {
    var pt = req.query.bookname;
    readerlogic.searchBook(pt, function (info) {
        res.send(info);
    });
})

router.get('/apply_account', function (req, res) {
    var newone = req.query;
    //console.log(newone);
    readerlogic.applyAccount(newone, function (info) {
        res.json({ code: info });
    });
})

router.post('/reader/login', function (req, res) {

    function authenResult(bool) {
        if (bool) {
            req.session.readerUser = req.body.account; // session
            res.json({ code: 0 });
            console.log('yinggai duile');
        }
        else {
            res.json({ code: 1 });
            console.log('cuole');
        }
    };

    console.log(req.query);
    readerlogic.compare(req.body.account, req.body.pwd, authenResult);
});

router.get('/reader', function (req, res) {
    if (typeof (req.session.readerUser) == "undefined") {
        res.redirect("/login");
    }
    else res.render("ReaderMain");
});

router.get('/reader/id', async function (req, res) {
    //await 
    if (typeof (req.session.readerUser) == "undefined") return;

    const id = req.session.readerUser;
    let reader = await readerlogic.getReaderInfoById(id);
    return res.json({ code: 0, msg: '', data: reader });
})

router.put('/reader/:id', async function (req, res) {
    const { name, email } = req.body;
    const id = req.session.readerUser;
    let result = await readerlogic.updateReaderInfo({ name, email, id })
    return res.json({ code: 0, msg: '�޸ĳɹ�', data: result });
})

router.post('/changepass/:id', async function (req, res) {
    const { pass } = req.body;
    const id = req.params.id
    let reader = await readerlogic.changePass(pass, id)
    return res.json({ code: 0, msg: '�޸ĳɹ�', data: reader });
})

router.get('/recoverpwd', function (req, res) {
    res.render("RecoverPassword");
})

router.post('/recover_pwd', function (req, res) {
    function confirmResult(bool) {
        var result = 0;
        if (bool) {
            res.json({ code: 0 });
            console.log('seccess');
        }
        else {
            res.json({ code: 1 });
            console.log('fail');
        }
    };
    console.log(req.body.email);
    readerlogic.comparemail(req.body.account, req.body.email, confirmResult);

})

module.exports = router;