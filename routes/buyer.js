const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
// session = request('express-session');
// const db = require("../../JoinRoutes");
const Buyer = require('../models/Buyer');
var aws = require('aws-sdk');
var fs = require('fs');
var uuid = require('uuid/v1');

aws.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

var dynamodb = new aws.DynamoDB();
var docClient = new aws.DynamoDB.DocumentClient();

// var productServices = JSON.parse(fs.readFileSync('E:\\For Task\\Progressive_Web_App\\test_version\\routes\\product-service-table-data.json', 'utf8'));

router.get("/", async (req, res) => {
    if (req.session.type == 'buyer'){
        res.render('buyer/index.ejs');
    } 
    else {
        res.send('You can not access this page.');
    }
});

router.post('/corporate', (req, res) => {
    if (req.session.type == 'buyer') {
        var uuid_v1 = uuid();
        var params = {
            TableName: 'Buyers',
            Item: {
                "id": uuid_v1,
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "legalAddress": req.body.legalAddress,
                "mailingAddress": req.body.mailingAddress,
                "phone": req.body.phone,
                "position": req.body.position,
                "companyName": req.body.companyName,
                "businessAddress": req.body.businessAddress,
                "companyTaxId": req.body.companyTaxId,
                "companyPhone": req.body.companyPhone,
                "description": req.body.description,
                "accountContactName": req.body.accountContactName,
                "new": true
            }
        };
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add Suppliers", ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                req.session.message = 'wait';
                res.redirect('/buyer');
            }
        })
    } else {
        res.send('You can not access this page.');
    }
});

router.get("/purchase_orders", async (req, res) => {
    if (req.session.type == 'buyer') {
        var params = {
            TableName: 'PurchaseOrders',
            FilterExpression: '#new= :new',
            ExpressionAttributeNames: {
                "#new": "new",
            },
            ExpressionAttributeValues: {
                ':new': false,
            },
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error('Unable to scan productServices table');
            } else {
                res.render('buyer/purchase_order.ejs', {purchaseOrders: data.Items});
            }
        });
    } else {
        res.send('You can not access this page.');
    }
    // res.render('buyer/purchase_order.ejs');
});

router.get("/purchase_orders/details", (req, res) => {
    var string = req.query.id;
    console.log('purchaseID_______________', string);
    var params = {
        TableName: 'PurchaseOrders',
        FilterExpression: '#id = :id',
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ':id': string
        }
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error('Unable to scan productServices table');
        } else {
            res.render('buyer/purchase_order_detail.ejs', {purchaseDetail: data.Items[0]});
        }
    });
});

router.get("/purchase_order/add", async (req, res) => {
    if (req.session.type == 'buyer') {
        res.render('buyer/add_purchase_order.ejs');
    } else {
        res.send('You can not access this page.');
    }
});

router.post('/addPurchaseOrder', (req, res) => {
    var buyerId = req.session.userId;
    var buyerName = req.session.userIdName;
    var uuid_v1 = uuid();
    var params = {
        TableName: 'PurchaseOrders',
        Item: {
            "id": uuid_v1,
            "paymentTerms": req.body.paymentTerms,
            "incoterm": req.body.incoterm,
            "requiredDeliveryDate": req.body.requiredDeliveryDate,
            "deliveryAddress": req.body.deliveryAddress,
            "itemDescription": req.body.itemDescription,
            "quantity": req.body.quantity,
            "measurement": req.body.measurement,
            "prepared": req.body.prepared,
            "buyerId": buyerId,
            "buyerName": buyerName,
            "new": true
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add Products", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            req.session.message = 'wait';
            res.redirect('/buyer/purchase_order/add');
        }
    });
});

module.exports = router;
