const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request'),
    User = require('../models/User');
var aws = require('aws-sdk');
var fs = require('fs');
var uuid = require('uuid/v1');

aws.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();

router.get("/", async (req, res) => {
    // querying all employees
    let string = req.session.message;
    res.render('register/register.ejs', {messages: string});
});

router.post("/", (req, res) => {
    //google recaptcha handling
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        // req.session.success = 'User added successfully';
        var string = 'need_recaptcha';
        // return res.redirect('/login?valid=' + string);
        req.session.message = string;
        return res.redirect('/register');
    }
    var uuidv1 = uuid();
    var params = {
        TableName: 'Users',
        Item: {
            "id": uuidv1,
            "first_name": req.body.firstname,
            "last_name": req.body.lastname,
            "userId": req.body.userId,
            "email": req.body.email,
            "phone": req.body.phone,
            "type": req.body.account_type,
            "password": req.body.password,
            "repassword": req.body.repassword,
            "new": true
        }
    };

    const secretKey = '6LewaNMUAAAAAGZLUVvArt1sPl2dTL5j3UtX_bqV';

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    // request(verificationURL,function(error,response,body) {
        // body = JSON.parse(body);
        //
        // if(body.success !== undefined && !body.success) {
        //     return res.json({"responseError" : "Failed captcha verification"});
        // }
        // User.create(data);
        docClient.put(params, function (err, data) {
            if (err) throw err;
            else {
                // console.log('User registered ___________________', data);
                return res.redirect('/login');
            }
        });
    // });

});

module.exports = router;
