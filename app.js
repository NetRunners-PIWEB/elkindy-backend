// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const cors = require('cors');


const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const classRoutes = require("./routes/classRoutes");
const morgan = require("morgan");
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);
app.use(morgan("dev"));
connect();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/class", classRoutes);
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);