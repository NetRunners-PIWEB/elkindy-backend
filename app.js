// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');


const authRoutes = require("./routes/authRoutes");
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);

connect();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use(cors({
    origin: 'http://localhost:3001',
}));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);





app.use(bodyParser.json());

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);
