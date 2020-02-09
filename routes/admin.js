const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
// const Admin = require('../models/dynamodb/Admin');
// session = request('express-session');
// const db = require("../../JoinRoutes");
var aws = require('aws-sdk');
var uuid = require('uuid/v1');

aws.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();

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
        req.session.message = 'adminRecaptcha';
        return res.redirect('/admin/login');
    }
    const secretKey = '6LewaNMUAAAAAGZLUVvArt1sPl2dTL5j3UtX_bqV';

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    var params = {
        TableName: 'Admin',
        FilterExpression: '#userId= :userId AND #password= :password',
        ExpressionAttributeNames: {
            "#userId": "userId",
            "#password": "password"
        },
        ExpressionAttributeValues: {
            ':userId': userId,
            ':password': password
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            var count = data.Items.length;
            if (!count) {
                req.session.message = 'admin_invalid';
                return res.redirect('/admin/login');
            } else {
                return res.redirect('/admin/dashboard');
            }
        }
    })
});

router.get("/dashboard", async (req, res) => {
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {
            "#new": "new",
        },
        ExpressionAttributeValues: {
            ':false': false,
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable__________", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("Success___________");
            res.render('admin/openDeal.ejs', {deals: data.Items});
        }
    });
});

router.post('/openDeals', (req, res) => {
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {
            "#new": "new",
        },
        ExpressionAttributeValues: {
            ':false': false
        }
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedDeals.ejs', {deals: data.Items});
        }
    })
});

router.post('/newDeals', (req, res) => {
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#new= :true',
        ExpressionAttributeNames: {
            "#new": "new",
        },
        ExpressionAttributeValues: {
            ':true': true,
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable__________", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("Success___________");
            res.render('admin/newDeal.ejs', {deals: data.Items});
        }
    });
});

router.post("/approvedBorrowers", async (req, res) => {
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {
            "#new": "new",
        },
        ExpressionAttributeValues: {
            ':false': false,
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedBorrowers.ejs', {borrowers: data.Items});
        }
    });
});

router.post('/newBorrowers', async (req, res) => {
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#new= :true',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':true': true},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/newBorrowers.ejs', {borrowers: data.Items});
        }
    });
});

router.post('/approvedLenders', async (req, res) => {
    var params = {
        TableName: 'lenderDealTable',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': false},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedLenders.ejs', {lenders: data.Items});
        }
    });
});

router.post('/newLenders', async (req, res) => {
    var params = {
        TableName: 'lenderDealTable',
        FilterExpression: '#new= :true',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':true': true},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/newLenders.ejs', {lenders: data.Items});
        }
    });
});

router.post("/approvedBuyers", async (req, res) => {
    var params = {
        TableName: 'Buyers',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': false},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedBuyers.ejs', {buyers: data.Items});
        }
    });
});

router.post("/newBuyers", async (req, res) => {
    var params = {
        TableName: 'Buyers',
        FilterExpression: '#new= :true',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':true': true},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedBuyers.ejs', {buyers: data.Items});
        }
    });
});

router.post("/approvedSuppliers", async (req, res) => {
    var params = {
        TableName: 'Suppliers',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': false},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedSuppliers.ejs', {suppliers: data.Items});
        }
    });
});

router.post("/newSuppliers", async (req, res) => {
    var params = {
        TableName: 'Suppliers',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': true},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedSuppliers.ejs', {suppliers: data.Items});
        }
    });
});

router.post('/approvedPurchases', (req, res) => {
    var params = {
        TableName: 'PurchaseOrders',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': false},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedPurchases.ejs', {purchases: data.Items});
        }
    });
});

router.post('/newPurchases', (req, res) => {
    var params = {
        TableName: 'PurchaseOrders',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': true},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/newPurchases.ejs', {purchases: data.Items});
        }
    });
});

router.post('/approvedProducts', (req, res) => {
    var params = {
        TableName: 'ProductServices',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': false},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/approvedProducts.ejs', {products: data.Items});
        }
    });
});

router.post('/newProducts', (req, res) => {
    var params = {
        TableName: 'ProductServices',
        FilterExpression: '#new= :false',
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {':false': true},
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('admin/newProducts.ejs', {products: data.Items});
        }
    });
});

function approveItems(id, tableName) {
    var params = {
        TableName: tableName,
        Key: {id: id},
        ExpressionAttributeNames: {"#new": "new"},
        ExpressionAttributeValues: {":false": false},
        UpdateExpression: "SET #new = :false",
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, function (err, data) {
        if (err) throw err;
    });
}

function rejectItems(id, tableName) {
    var params = {
        TableName: tableName,
        Key: {id: id},
    };
    docClient.delete(params, function (err, data) {
        if (err) throw err;
    });
}

router.post('/approveDeal', (req, res) => {
    var id = req.body.id;
    approveItems(id, 'Fulldeals');
    res.send('true');
});

router.post('/rejectDeal', (req, res) => {
    var id = req.body.id;
    rejectItems(id, 'Fulldeals');
    res.send('true');
});

router.post('/rejectBorrower', (req, res) => {
    var borrowerId = req.body.borrowerId;
    var params = {
        TableName: 'Borrowers',
        Key: {id: borrowerId},
    };
    docClient.delete(params, function (err, data) {
        if (err) throw err;
        else {
            res.send('rejected');
        }
    });
});

module.exports = router;
