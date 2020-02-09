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
            res.render('supplier/products_services.ejs', {products: data.Items});
        }
    });
    // var string = req.query.valid;
    // res.render('supplier/products_services.ejs', {message: string});
});

router.get("/products_services/details", (req, res) => {
    var productId = req.query.id;
    var params = {
        TableName: 'ProductServices',
        FilterExpression: '#id= :id',
        ExpressionAttributeNames: {'#id': 'id'},
        ExpressionAttributeValues: {':id': productId}
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('supplier/products_services_detail.ejs', {product: data.Items[0]});
        }
    });
});

router.get("/products_services/add", (req, res) => {
    var string = req.session.message;
    res.render('supplier/add_products_services.ejs', {message: string});
});

router.post('/corporate', (req, res) => {
    var userId = req.session.userId;
    var uuid_v1 = uuid();
    var params = {
        TableName: 'Suppliers',
        Item: {
            "id": uuid_v1,
            "supplierFirstName": req.body.firstName,
            "supplierLastName": req.body.lastName,
            "supplierAddress": req.body.legal_address,
            "supplierEmailId": req.body.email,
            "supplierPhone": req.body.phone,
            "supplierCountryCode": req.body.countryCode,
            "supplierCompanyName": req.body.company_name,
            "supplierCompanyAddress": req.body.business_address,
            "supplierCompanyTaxID": req.body.company_taxId,
            "supplierCompanyPhone": req.body.company_phone,
            "supplierCompanyWebsite": req.body.company_website,
            "supplierCompanyContactName": req.body.contactName,
            "supplierId": userId,
            "new": true
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
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
    var supplierName = req.session.userIdName;
    var params = {
        TableName: 'ProductServices',
        Item: {
            'id': uuid_v1,
            "productServiceDescription": req.body.description,
            "quantityControl": req.body.quantityControl,
            "expectedPaymentTerms": req.body.expectedPaymentTerms,
            "quantityAbleToProvide": req.body.quantityAbleToProvide,
            "factoryLocation": req.body.factoryLocation,
            "incoterm": req.body.incoterm,
            "measurementUnit": req.body.measurementUnit,
            "licensePlace": req.body.licensePlace,
            "ableToProvideBy": req.body.ableToProvideBy,
            "EPPU": req.body.EPPU,
            "suitability": req.body.suitability,
            "history": req.body.history,
            "supplierId": supplierId,
            "supplierName": supplierName,
            "new": true
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add Products", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            req.session.message = 'wait';
            res.redirect('/supplier/products_services/add');
        }
    });
});

router.get("/open_deals", async (req, res) => {
    var supplierId = req.session.userId;
    var params = {
        TableName: "Fulldeals",
        FilterExpression: 'NOT contains (#supplierIds, :supplierId) AND #new= :false',
        ExpressionAttributeNames: {
            "#supplierIds": "supplierIds",
            "#new": "new"
        },
        ExpressionAttributeValues: {
            ':supplierId': supplierId,
            ':false': false
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('supplier/open_deals.ejs', {deals: data.Items});
        }
    });
});

router.get("/my_deals", async (req, res) => {
    // passport middleware with supplier login
    var supplierId = req.session.userId;
    var params = {
        TableName: "Fulldeals",
        FilterExpression: 'contains (#supplierIds, :supplierId) AND #new= :false',
        ExpressionAttributeNames: {
            "#supplierIds": "supplierIds",
            "#new": "new"
        },
        ExpressionAttributeValues: {
            ':supplierId': supplierId,
            ':false': false
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            res.render('supplier/my_deals.ejs', {deals: data.Items});
        }
    });
});

router.get('/openDeals/details', (req, res) => {
    var id = req.query.id;
    req.session.dealId = id;
    res.render('supplier/openDeals_details.ejs');
});

router.get('/participate', (req, res) => {
    var supplierId = req.session.userId;
    function responseData(dealData) {
        var params = {
            TableName: 'ProductServices',
            FilterExpression: '#new= :false AND #supplierId= :supplierId',
            ExpressionAttributeNames: {"#new": "new", "#supplierId": "supplierId"},
            ExpressionAttributeValues: {':false': false, ":supplierId": supplierId},
        };
        docClient.scan(params, function (err, data) {
            if (err) throw err;
            else {
                res.render('supplier/participateDeal.ejs', {deal:dealData, products:data.Items});
            }
        })
    }
    var dealId = req.session.dealId;
    var params = {
        TableName: "Fulldeals",
        FilterExpression: '#id= :dealId',
        ExpressionAttributeNames: {
            "#id": "id",
        },
        ExpressionAttributeValues: {
            ':dealId': dealId,
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            var dealData = data.Items[0];
        }
        responseData(dealData);
    });
});

router.post('/participate', (req, res) => {
    var uuid_v1 = uuid();
    var productId = req.body.productId;
    var dealId = req.session.dealId;
    function updateItem(data) {
        var params = {
            TableName: 'Fulldeals',
            Key: {id: dealId},
            UpdateExpression: "SET #productIds= :productId",
            ExpressionAttributeNames: {"#productIds": 'productIds'},
            ExpressionAttributeValues: {":productId": productId}
        };
        docClient.update(params, function (err, data) {
            if (err) throw err;
        })
    }
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#id= :dealId',
        ExpressionAttributeNames: {
            "#id": "id",
        },
        ExpressionAttributeValues: {
            ':dealId': dealId,
        }
    };
    docClient.scan(params, function (err, data) {
        if (err) throw err;
        else {
            var updateProductIds = data.Items[0].productIds  + productId + ', ';
            updateItem(updateProductIds);
        }
    });
    res.send('true');
});
module.exports = router;
