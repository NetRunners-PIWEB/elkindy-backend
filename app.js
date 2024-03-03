// BASE SETUP
// ==============================================
const express = require("express");
const { connect } = require("./config/mongoose.js");
const corsMiddleware = require("./middlewares/cors.js");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const instrumentRouter = require("./routes/instrument.route.js");
const app = express();
app.use(express.json());

// ==============================================
app.use(bodyParser.json());
app.use(corsMiddleware);
swaggerDoc(app);

connect();
app.use("/api/v1/instruments", instrumentRouter);

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);
