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

var productServices = JSON.parse(fs.readFileSync('E:\\For Task\\Progressive_Web_App\\test_version\\routes\\product-service-table-data.json', 'utf8'));

var params = {
    "TableName": "ProductServices",
    "KeySchema": [
        {
            "AttributeName": "id",
            "KeyType": "HASH"
        }
    ],
    "AttributeDefinitions": [
        {
            "AttributeName": "id",
            "AttributeType": "S"
        }
    ],
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
    }
};

router.get("/", async (req, res) => {
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
    productServices.forEach(function (lender) {
        var uuid_v1 = uuid();
        var params = {
            TableName: "ProductServices",
            Item: {
                "id": uuid_v1,
                "productServiceId":lender.productServiceId,
                "productServiceName":lender.productServiceName,
                "productServiceDescription":lender.productServiceDescription,
                "productServiceProducerId":lender.productServiceProducerId,
                "productServiceProducerName":lender.productServiceProducerName,
                "productServiceCurrency":lender.productServiceCurrency,
                "productServiceUnitCost":lender.productServiceUnitCost,
            }
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add Buyer", ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:");
                var string = req.query.valid;
                res.render('buyer/index.ejs', {message: string});
            }
        });
    });
    // set middleware of borrower login


});

router.get("/purchase_orders", async (req, res) => {

    res.render('buyer/purchase_order.ejs');
});

router.get("/purchase_order/add", async (req, res) => {

    res.render('buyer/add_purchase_order.ejs');
});

module.exports = router;
