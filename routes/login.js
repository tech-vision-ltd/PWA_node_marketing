const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request'),
    User = require('../models/User');
// session = request('express-session');
// const db = require("../../JoinRoutes");
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
    req.session.message = 'sss';
    var string = req.session.message;
    res.render('login/login.ejs', {messages: string});
});

router.post("/post", (req, res) => {
    let account_type = req.body.account_type;
    let userId = req.body.userId;
    let password = req.body.password;

    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        var string = userId;
        req.session.message = 'recaptcha';
        return res.redirect('/login');
    }
    const secretKey = '6LewaNMUAAAAAGZLUVvArt1sPl2dTL5j3UtX_bqV';

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    // request(verificationURL, function (error, response, body) {
        var params = {
            TableName: 'Users',
            FilterExpression: '#type= :account_type AND #userId= :userId AND #password= :password',
            ExpressionAttributeNames: {
                "#type": "type",
                "#userId": "userId",
                "#password": "password"
            },
            ExpressionAttributeValues: {
                ':account_type': account_type,
                ':userId': userId,
                ':password': password
            },
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                // console.log("trying to register___________", data.Items.length);
                var count = data.Items.length;
                if (!count){
                    req.session.message = 'invalid';
                    return res.redirect('/login');
                } else {
                    req.session.userId = data.Items[0].id;
                    req.session.userIdName = userId;
                    req.session.password = password;
                    req.session.type = account_type;
                    return res.redirect('/' + account_type);
                }
            }
        })
    // });
});

router.get("/renew_password", (req, res) => {
    res.render('login/renew_password.ejs');
});

module.exports = router;
