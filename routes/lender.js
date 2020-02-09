const express = require("express");
const router = express.Router();
// const ejs = require('ejs');
// const path = require('path');
// const bodyParser = require('body-parser'),
//     request = require('request');
// Deal = require('../models/Deal');
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
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: 'NOT contains (#lenderIds, :userId) AND #new= :false',
        ExpressionAttributeNames: {
            "#lenderIds": "lenderIds",
            "#new": "new"
        },
        ExpressionAttributeValues: {
            ':userId': userId,
            ':false': false
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable__________", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.render('lender/open_deal.ejs', {deals: data.Items, userId: userId});
        }
    });
});

router.get('/openDeals/details', (req, res) => {
    var id = req.query.id;
    req.session.dealId = id;
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
        res.render('lender/showDetails.ejs', {deals: response.full_deal, suppliers: response.suppliers});
    };

    var id = req.session.dealId;
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
    // req.session.dealId = id;
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
            res.render('lender/fundDeal.ejs', {deals: data.Items});
        }
    });
});
//financed an open deal so it is converted to the my deal.
router.post('/fund', (req, res) => {
    var uuid_v1 = uuid();
    var dealId = req.body.dealId;
    var fundAmount = req.body.fundAmount;
    var lenderId = req.session.userId;
    var lenderName = req.session.userIdName;
    var updatedLenderIds = '';
    var updatedLenderNames = '';

    function updateItems(a, b) {
        console.log("Item_______", a, b);
        var params = {
            TableName: 'Fulldeals',
            Key: {id: dealId},
            UpdateExpression: "SET #lenderIds= :a, #lenderNames= :b",
            ExpressionAttributeNames : {
                "#lenderIds": 'lenderIds',
                "#lenderNames": 'lenderNames'
            },
            ExpressionAttributeValues : {
                ":a": a,
                ":b": b
            }
        };
        docClient.update(params, function (err, data) {
            if (err) throw err;
        })
    }

    var params = {
        TableName: 'lenderDealTable',
        Item: {
            "id": uuid_v1,
            "lenderId": lenderId,
            "lenderName": lenderName,
            "dealId": dealId,
            "fundAmount": fundAmount,
            "new": true
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add Buyer", ". Error JSON:", JSON.stringify(err, null, 2));
        }
    });
    var dealParams = {
        TableName: 'Fulldeals',
        FilterExpression: '#id= :dealId',
        ExpressionAttributeNames: {"#id": "id"},
        ExpressionAttributeValues: {':dealId': dealId},
    };
    docClient.scan(dealParams, function (err, data) {
        if (err) throw err;
        else {
            var existLenderIds = data.Items[0].lenderIds;
            updatedLenderIds = existLenderIds + lenderId + ', ';
            var existLenderNames = data.Items[0].lenderNames;
            updatedLenderNames = existLenderNames + lenderName + ', ';
        }
        updateItems(updatedLenderIds, updatedLenderNames);
    });
    res.redirect('/lender/my_deal');
});

router.get('/my_deal', (req, res) => {
    var userId = req.session.userId;
    var reasonableDealIds = [];
    var params = {
        TableName: 'Fulldeals',
        FilterExpression: 'contains (#lenderIds, :userId) AND #new= :new',
        ExpressionAttributeNames: {
            "#lenderIds": "lenderIds",
            "#new": "new"
        },
        ExpressionAttributeValues: {
            ':userId': userId,
            ':new': false
        },
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable__________", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.render('lender/my_deal.ejs', {deals: data.Items, userId: userId});
        }
    });
});

module.exports = router;
