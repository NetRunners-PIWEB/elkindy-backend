// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");

<<<<<<< HEAD
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');

=======

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
>>>>>>> 1d2ec6cb46d73e3518cdb4619a40198741863bd7
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);

connect();

<<<<<<< HEAD
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
=======
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
>>>>>>> 1d2ec6cb46d73e3518cdb4619a40198741863bd7
// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);
