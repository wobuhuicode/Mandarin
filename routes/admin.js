'use strict';

var path = require('path');
var express = require('express');
var adminlogic = require(path.join(__dirname, '../Logic/Admin/AdminLogic')); 
var router = express.Router();

/* GET admin pages. */
router.get('/', function (req, res) {
    if (req.session.adminUser == null) res.redirect("/admin/login");
    console.log(req.session.adminUser);
    res.render("AdminMain", { title: "HTML" });
});

router.get('/login', function (req, res) {
    res.render("adminLog");
});

router.get('/username', function (req, res) {
    res.json({ userName: req.session.adminUser })
});

router.get('/getLibs', function (req, res) {
    function libsRes(data) {
        res.json(data);
    }
    adminlogic.getlibInfo(libsRes);
});

router.get('/searchLibrarian', function (req, res) {
    function lookupResult(bool, account, pwd) {
        if (bool) {
            res.json({ code: 0, name: account, password: pwd });
        }
        else {
            res.json({ code: 1 });
        }
    };

    adminlogic.lookupLibrarian(req.query.key, lookupResult);

});

router.post('/addLibrarian', function (req, res) {
    var NM = req.body.userName;
    var ID = req.body.libID;
    var PW = req.body.pwd;
    adminlogic.repeatLibrarianID(ID, function (callback) {
        if (callback == 1) res.json({ code: 2 });
        else if (callback == 0) { res.json({ code: 0 }); adminlogic.addLibrarian(NM, ID, PW); }
    })
})


router.post('/updateLibrarian', function (req, res) {
    function updateResult(bool) {
        if (bool) res.json({ code: 0 });
        else res.json({code: 1})
    }

    adminlogic.updateLibrarian(req.body.curName, req.body.newName, req.body.newPassword, updateResult);
})

router.post('/authen', function (req, res) {
    //回调函数
    function authenResult(bool) {
        if (bool) {
            req.session.adminUser = req.body.account; // 登录成功，设置 session
            res.json({ code: 0 });
        }
        else {
            res.json({ code: 1 });
        }
    };
    //调用业务逻辑，业务逻辑中可以调用上面的函数实现结果返回
    adminlogic.compare(req.body.account, req.body.pwd, authenResult);
});

router.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.json({ code: 0 });
        }
        else {
            res.clearCookie(req.body.account)
            res.json({ code: 1 });
        }
    })
});

//修改保证金及周期
router.post('/modDepositandCyclePage', function (req, res) {
    function modResult(bool) {
        if (bool) {
            res.json({ code: 0 });
        } else {
            res.json({ code: 1 });
        }
    }
    adminlogic.moddeposit(req.body.deposit, req.body.cycle ,modResult);
})

router.get('/getInfo', function (req, res) {
    function InfoRes(data) {
        res.json(data);
    }
    adminlogic.getInfo(InfoRes);
});

module.exports = router;
