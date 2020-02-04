const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
// Deal = require('../models/Deal');
var session = require('express-session');
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
    var userId = req.session.userId;
    var password = req.session.password;
    var type = req.session.type;
    req.session.userId = userId;
    req.session.type = type;
//Using mongodb
    // Deal.find(function (err, i) {
    //     // console.log('deals____________________________________', i);
    //     if (err) return console.log(err);
    //     res.render('lender/open_deal.ejs', {deals: i});
    // });
//using middleware
    // if (type == 'lender') {
    //     res.render('lender/open_deal.ejs', {userId: userId, password: password});
    // } else {
    //     res.send('You must login as a lender to access this site');
    // }
//using dynamodb
    var params = {
        TableName: 'Fulldeals'
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable__________", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("Success___________");
            res.render('lender/open_deal.ejs', {deals: data.Items, userId: userId});
        }
    });
});

router.get('/openDeals/details', (req, res) => {
    var id = req.query.id;
    req.session.dealId = id;
    // console.log('id____________________', id);
    res.render('lender/openDeals_details.ejs');
});

/***
 * to show in iframe
 * @Return response
 *  {
 *      full_deal: Object of fullDeal,
 *      suppliers: [
 *          Supplier Object,
 *          Supplier Object,
 *          Supplier Object
 *      ]
 *  }
 */
router.get('/dealDetails', (req, res) => {
    var response = {};
    let sendResponse = (supplier_array) => {
        response.suppliers = supplier_array;

        // console.log('result: ', response);
        res.render('lender/showDetails.ejs', {deals: response.full_deal, suppliers: response.suppliers});
    };

    var id = req.session.dealId;
    req.session.dealId = id;
    // console.log('dealDetailsId______________________', id);
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#id= :id',
        ExpressionAttributeNames: {
            "#id": "id",
        },
        ExpressionAttributeValues: {
            ':id': id,
        },
    };

    docClient.scan(params, function (err, full_deal_data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            response.full_deal = full_deal_data.Items;

            var supplierIds = full_deal_data.Items[0].supplierIds;
            var supplierIdsArray = supplierIds.split(',');
            var supplier_array = [];
            for (var i = 0; i < supplierIdsArray.length; i++) {
                var supplierParams = {
                    TableName: 'Suppliers',
                    FilterExpression: '#id= :id',
                    ExpressionAttributeNames: {
                        "#id": "id"
                    },
                    ExpressionAttributeValues: {
                        ':id': supplierIdsArray[i]
                    },
                };
                try {
                    if (i === supplierIdsArray.length - 1) {
                        docClient.scan(supplierParams, function (err, supplier_data) {
                            if (!err) {
                                supplier_array.push(supplier_data.Items[0]);
                            }
                            sendResponse(supplier_array);
                        });
                    } else {
                        docClient.scan(supplierParams, function (err, supplier_data) {
                            if (!err) {
                                supplier_array.push(supplier_data.Items[0]);
                            }
                        });
                    }
                } catch (e) {
                    console.log(e.message);
                    sendResponse(null)
                }
            }
        }
    });
});

router.get('/fund', (req, res) => {
    var id = req.session.dealId;
    req.session.dealId = id;
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: '#id= :id',
        ExpressionAttributeNames: {
            "#id": "id",
        },
        ExpressionAttributeValues: {
            ':id': id,
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable__________", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("Success___________");
            res.render('lender/fundDeal.ejs', {deals: data.Items});
        }
    });
});

router.post('/fund', (req, res) => {
    var uuid_v1 = uuid();
    var dealId = req.body.dealId;
    var fundAmount = req.body.fundAmount;
    var lenderId = req.session.userId;
    req.session.userId = lenderId;
    // console.log('lenderId_____________', lenderId);
    var params = {
        TableName: 'lenderDealTable',
        Item: {
            "id": uuid_v1,
            "lenderId": lenderId,
            "dealId": dealId,
            "fundAmount": fundAmount
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add Buyer", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log('klhkglh________________', req.session);
            // res.redirect('/lender/myDeals');
        }
    });
    res.redirect('/lender');
});

router.get('/myDeals', (req, res) => {
    let sendResponse = (dealArray) => {
        console.log('DealArray__________', dealArray);
        res.render('lender/my_deals.ejs', {deals: dealArray});
    };

    var lenderId = req.session.userId;
    console.log('lenderId___________', req.session.userId);
    req.session.userId = lenderId;
    var params = {
        TableName: 'lenderDealTable',
        FilterExpression: '#lenderId= :lenderId',
        ExpressionAttributeNames: {
            "#lenderId": "lenderId",
        },
        ExpressionAttributeValues: {
            ':lenderId': lenderId,
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to add Buyer", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            var dealArray = [];
            console.log('myDeals_____________', data.Items);
            for (var i = 0; i < data.Items.length; i++) {
                var dealId = data.Items[i].dealId;
                var dealParams = {
                    TableName: 'Fulldeals',
                    FilterExpression: '#dealId= :dealId',
                    ExpressionAttributeNames: {
                        "#dealId": "id",
                    },
                    ExpressionAttributeValues: {
                        ':dealId': dealId,
                    },
                };
                try {
                    if (i === data.Items.length - 1) {
                        docClient.scan(dealParams, function (err, dealData) {
                            if (!err) {
                                dealArray.push(dealData.Items[i]);
                                console.log('dealsdfsdaf______', dealData);
                            }
                            sendResponse(dealArray);
                        })
                    } else {
                        docClient.scan(dealParams, function (err, dealData) {
                            if (!err) {
                                dealArray.push(dealData.Items[i]);
                            }
                        });
                    }
                } catch (e) {
                    console.log(e.message);
                    sendResponse(null);
                }
            }
            // res.render('lender/my_deals.ejs', {deals: data.Items});
        }
    });
});

module.exports = router;
