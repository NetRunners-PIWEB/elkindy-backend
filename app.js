// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");


const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);

connect();

app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);
