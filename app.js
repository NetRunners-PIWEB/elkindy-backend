// BASE SETUP
// ==============================================
var express = require('express');
var app     = express();
var port    =   process.env.PORT || 3000;
var { mongoose } = require("./dbConfig/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require('./docs/swaggerDoc')

const userRoutes = require('./routes/userRoutes');
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);

app.use('/api', userRoutes);
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);