const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
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
    // passport middleware with supplier login
    var string = req.session.message;
    res.render('supplier/index.ejs', {message: string});
});

router.get("/products_services", async (req, res) => {
    // passport middleware with supplier login
    var params = {
        TableName: 'ProductServices',
    };
    docClient.scan(params, function (err, data) {
        if (err) {console.error('Unable to scan productServices table');}
        else {
            res.render('supplier/products_services.ejs', {products: data.Items});
        }
    })
    // var string = req.query.valid;
    // res.render('supplier/products_services.ejs', {message: string});
});

router.get("/products_services/details", (req, res) => {
    var string = req.query.name;
    res.render('supplier/products_services_detail.ejs', {message:string});
});

router.get("/products_services/add", (req, res) => {
    var string = req.session.message;
    res.render('supplier/add_products_services.ejs', {message:string});
});

router.post('/corporate', (req, res) => {
    var uuid_v1 = uuid();
    var params = {
        TableName: 'Suppliers',
        Item: {
            "id": uuid_v1,
            "supplierFirstName": req.body.firstName,
            "supplierLastName":req.body.lastName,
            "supplierAddress":req.body.legal_address,
            "supplierEmailId":req.body.email,
            "supplierPhone":req.body.phone,
            "supplierCountryCode":req.body.countryCode,
            "supplierCompanyName":req.body.company_name,
            "supplierCompanyAddress":req.body.business_address,
            "supplierCompanyTaxID":req.body.company_taxId,
            "supplierCompanyPhone":req.body.company_phone,
            "supplierCompanyWebsite":req.body.company_website,
            "supplierCompanyContactName":req.body.contactName,
            "new":"true"
        }
    };
    docClient.put(params, function (err, data) {
        if (err){
            console.error("Unable to add Suppliers", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            req.session.message = 'wait';
            res.redirect('/supplier');
        }
    })
});

router.post('/products_services/register', (req, res) => {
    var uuid_v1 = uuid();
    var supplierId = req.session.userId;
    var params = {
        TableName: 'ProductServices',
        Item: {
            'id': uuid_v1,
            "productServiceDescription": req.body.description,
            "quantityControl":req.body.quantityControl,
            "expectedPaymentTerms":req.body.expectedPaymentTerms,
            "quantityAbleToProvide":req.body.quantityAbleToProvide,
            "factoryLocation":req.body.factoryLocation,
            "incoterm":req.body.incoterm,
            "measurementUnit":req.body.measurementUnit,
            "licensePlace":req.body.licensePlace,
            "ableToProvideBy":req.body.ableToProvideBy,
            "EPPU":req.body.EPPU,
            "suitability":req.body.suitability,
            "history":req.body.history,
            "supplierId": supplierId,
            "new": "true"
        }
    };
    docClient.put(params, function (err, data) {
        if (err){
            console.error("Unable to add Products", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            req.session.message = 'wait';
            res.redirect('/supplier/products_services/add');
        }
    });
});
// router.get("/open_deals", async (req, res) => {
//     // passport middleware with supplier login
//     var string = req.query.valid;
//     res.render('supplier/open_deals.ejs', {message: string});
// });

// router.get("/my_deals", async (req, res) => {
//     // passport middleware with supplier login
//     var string = req.query.valid;
//     res.render('supplier/my_deals.ejs', {message: string});
// });

module.exports = router;
