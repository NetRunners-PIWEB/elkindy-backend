// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');


const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const classRoutes = require("./routes/classRoutes");
const morgan = require("morgan");
const { userVerification } = require("./middlewares/authJWT");
// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);
app.use(morgan("dev"));
connect();
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    }));
    app.use(cookieParser());


app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/class", classRoutes);
app.use(bodyParser.json());

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);