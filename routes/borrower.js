const express = require("express");
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser'),
    request = require('request');
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

    // set middleware of borrower login
    let userId = req.session.userId;
    let password = req.session.password;
    let type = req.session.type;
    var params = {
        TableName: 'Suppliers'
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to add Buyer", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Success to Borrower___________");
            res.render('borrower/general.ejs', {suppliers: data.Items});
        }
    });
    // if (type == 'borrower') {
    // res.render('borrower/general.ejs', {userId: userId, password: password});
    // } else {
    //     res.send('You must login as a borrower to access this site');
    // }
});


router.get("/deal", async (req, res) => {

    res.render('borrower/deal.ejs');
});

router.get("/buyer", async (req, res) => {

    res.render('borrower/buyer.ejs');
});

router.get("/supplier", async (req, res) => {
    var params = {
        TableName: 'Suppliers'
    };
    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to add Buyer", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("Success___________");
            res.render('borrower/supplier.ejs', {suppliers: data.Items});
        }
    });
});

router.post('/deal/post', (req, res) => {
    console.log(req.body);
    var uuidv1 = uuid();
    console.log('UUID_________________', uuidv1.toString());
    var params = {
        TableName: 'Fulldeals',
        Item: {
            "id": uuidv1.toString(),
            "fullLegalName" : req.body.full_legal_name,
            "entityType" : req.body.entity_type,
            "legalAddress" : req.body.legal_address,
            "mailingAddress" : req.body.mailing_address,
            "taxId" : req.body.taxId,
            "phone" : req.body.phone,
            "companyName" : req.body.company_name,
            "businessAddress" : req.body.business_address,
            "companyTaxId" : req.body.company_taxId,
            "companyPhone" : req.body.company_phone,
            "companyWebsite" : req.body.company_website,
            "contactName" : req.body.contactName,
            "totalDealAmount" : req.body.total_deal_amount,
            "requiredFunding" : req.body.required_funding,
            "expectedProfitMargin" : req.body.expected_profit,
            "numberOfSuppliersInvolved" : req.body.num_suppliers_involved,
            "dealType" : req.body.deal_type,
            "expectedDeliveryDate" : req.body.expected_delivery_date,
            "estimatedCostPerUnit" : req.body.ECPU,
            "salesPricePerUnit" : req.body.SPPU,
            "numberOfUnits" : req.body.num_units,
            "deadline" : req.body.deadline,
            "buyerFullLegalName" : req.body.buyer_full_legal_name,
            "buyerEntityType" : req.body.buyer_entity_type,
            "buyerLegalAddress" : req.body.buyer_legal_address,
            "buyerMailingAddress" : req.body.buyer_mailing_address,
            "buyerPhone" : req.body.buyer_phone,
            "existingBuyer" : req.body.existing_buyer,
            "buyerCompanyName" : req.body.buyer_company_name,
            "buyerBusinessAddress" : req.body.buyer_business_address,
            "buyerCompanyTaxId" : req.body.buyer_company_taxId,
            "buyerCompanyPhone" : req.body.buyer_company_phone,
            "buyerCompanyWebsite" : req.body.buyer_company_website,
            "buyerContactName" : req.body.buyer_contactName,
            "supplierIds": req.body.supplier_array
        }
    };
    docClient.put(params,function (err, data) {
        if (err) throw err;
        else {
            console.log('Success put items________', req.body.supplierIds);
            res.redirect('/borrower');
        }
    })
});

router.post('/*', (req, res) => {
    res.send('There is no response!');
});
module.exports = router;
