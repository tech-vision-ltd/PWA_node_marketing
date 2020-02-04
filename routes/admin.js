const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request'),
    Admin = require('../models/Admin');
// session = request('express-session');
// const db = require("../../JoinRoutes");

router.get("/", async (req, res) => {

    // set middleware of borrower login
    req.session.message = 'admin';
    return res.redirect('/admin/login');
    // res.render('admin/index.ejs', {message: string});
});

router.get('/login', (req, res) => {

    let string = req.session.message;
    res.render('login/login.ejs', {messages: string});
});

router.post('/login', (req, res) => {
    let userId = req.body.userId;
    let password = req.body.password;
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.session.message = 'recaptcha';
        return res.redirect('/admin/login');
    }
    const secretKey = '6LewaNMUAAAAAGZLUVvArt1sPl2dTL5j3UtX_bqV';

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,body) {
        let fetch = Admin.where({userId: userId, password: password}).countDocuments(function (err, count) {
            // console.log('Count________________________', count);
            if (!count){
                req.session.message = 'invalid';
                return res.redirect('/admin/login');
            } else {
                return res.redirect('/admin/deals');
            }
        });
    });
});

router.get("/deals", async (req, res) => {

    res.render('admin/deal.ejs');
});

router.get("/buyer", async (req, res) => {

    res.render('borrower/buyer.ejs');
});

router.get("/supplier", async (req, res) => {

    res.render('borrower/supplier.ejs');
});
module.exports = router;
