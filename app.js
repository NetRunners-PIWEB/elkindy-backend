// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");

const cors = require('cors');

const userRoutes = require("./routes/userRoutes/index");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');

// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);

connect();
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3001',
    }));
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);
