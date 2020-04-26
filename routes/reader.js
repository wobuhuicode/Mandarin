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

router.get('/reader/login', function (req, res) {
    //�ص�����
    function authenResult(bool) {
        if (bool) {
            req.session.readerUser = req.query.account; // ��¼�ɹ������� session
            res.json({ code: 0 });
            console.log('yinggai duile');
        }
        else {
            res.json({ code: 1 });
            console.log('cuole');
        }
    };
    //����ҵ���߼���ҵ���߼��п��Ե�������ĺ���ʵ�ֽ������
    console.log(req.query);
    readerlogic.compare(req.query.account, req.query.pwd, authenResult);
});

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/reader/:id', async function (req, res) {
    //await �첽ִ��
    let reader = await readerlogic.getReaderInfoById(req.params.id)
    return res.json({ code: 0, msg: '', data: reader });
})

router.put('/reader/:id', async function (req, res) {
    const { name, email } = req.body;
    const id = req.params.id
    let result = await readerlogic.updateReaderInfo({ name, email, id })
    return res.json({ code: 0, msg: '�޸ĳɹ�', data: result });
})

router.post('/changepass/:id', async function (req, res) {
    const { pass } = req.body;
    const id = req.params.id
    let reader = await readerlogic.changePass(pass, id)
    return res.json({ code: 0, msg: '�޸ĳɹ�', data: reader });
})
module.exports = router;