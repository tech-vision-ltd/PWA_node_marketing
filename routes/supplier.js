const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
// session = request('express-session');
// const db = require("../../JoinRoutes");

router.get("/", async (req, res) => {
    // querying all employees
    var string = req.query.valid;
    res.render('supplier/index.ejs', {message: string});
});

// router.post("/", (req, res) => {
//     let userId = req.body.UserID;
//     console.log('UserID is',      userId);
//     if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
//         // req.session.success = 'User added successfully';
//         var string = encodeURIComponent(userId);
//         return res.redirect('/login?valid=' + string);
//     }
//     const secretKey = '6LewaNMUAAAAAGZLUVvArt1sPl2dTL5j3UtX_bqV';
//
//     const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
//
//     request(verificationURL,function(error,response,body) {
//         body = JSON.parse(body);
//
//         if(body.success !== undefined && !body.success) {
//             return res.json({"responseError" : "Failed captcha verification"});
//         }
//         return res.json({"responseSuccess" : "Sucess"});
//     });
// });
//
// router.get("/renew_password", (req, res) => {
//     res.render('login/renew_password.ejs');
// });

module.exports = router;
