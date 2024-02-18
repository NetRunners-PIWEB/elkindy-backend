// BASE SETUP
// ==============================================
var express = require('express');
var app     = express();
var port    =   process.env.PORT || 3000;
var { mongoose } = require("./dbConfig/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require('./docs/swaggerDoc')
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);