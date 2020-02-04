'use strict';
var express = require('express');
// const connectDB = require('./config/db');
var session = require("express-session");
var bodyParser = require('body-parser');
const path = require('path');
// const connectDB = require('./config/db')
// var gcm = require('node-gcm');
var app = express();
const dotenv = require('dotenv');
const login = require('./routes/login');
const register = require('./routes/register');
const borrower = require('./routes/borrower');
const lender = require('./routes/lender');
const supplier = require('./routes/supplier');
const buyer = require('./routes/buyer');
const admin = require('./routes/admin');
//Here we are configuring express to use body-parser as middle-ware.

// const Borrower = require('./models/Borrower');

dotenv.config({ path: './config/config.env' });

// connectDB();
app.use(session({secret: 'mySecret', resave: true, saveUninitialzed: false}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//To server static assests in root dir
app.use(express.static(__dirname));

//To allow cross origin request
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use("/login", login);
app.use("/register", register);
app.use("/borrower", borrower);
app.use("/lender", lender);
app.use("/supplier", supplier);
app.use("/buyer", buyer);
app.use("/admin", admin);

// connectDB();

//To server index.html page

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//To receive push request from client
app.post('/send_notification', function (req, res) {
  if (!req.body) {
    res.status(400);
  }

  var message = new gcm.Message();
  var temp = req.body.endpoint.split('/');
  var regTokens = [temp[temp.length - 1]];

  // var sender = new gcm.Sender('AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY'); //Replace with your GCM API key

  // Now the sender can be used to send messages
  sender.send(message, { registrationTokens: regTokens }, function (error, response) {
  	if (error) {
      console.error(error);
      res.status(400);
    }
  	else {
     	console.log(response);
      res.status(200);
    }
  });
});

// let datas = Borrower.find({borrowerCountryCode:'CAN'});


app.listen(process.env.PORT || 3000, function() {
  console.log('Local Server : http://localhost:3000');
});
