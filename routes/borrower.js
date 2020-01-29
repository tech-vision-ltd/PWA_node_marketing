const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
// session = request('express-session');
// const db = require("../../JoinRoutes");

router.get("/", async (req, res) => {

    // set middleware of borrower login

    var string = req.query.valid;
    res.render('borrower/general.ejs', {message: string});
});

router.get("/deal", async (req, res) => {

    res.render('borrower/deal.ejs');
});

router.get("/buyer", async (req, res) => {

    res.render('borrower/buyer.ejs');
});

router.get("/supplier", async (req, res) => {

    res.render('borrower/supplier.ejs');
});
module.exports = router;
