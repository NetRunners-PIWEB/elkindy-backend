// BASE SETUP
// ==============================================
var express = require("express");
var app = express();
var { connect } = require("./config/mongoose");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const { EventEmitter } = require('events');

const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes/ticketRoutes");
const reservationRoutes = require("./routes/reservationRoutes/reservationRoutes");


// ==============================================
app.use(bodyParser.json());
swaggerDoc(app);

connect();
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reservations", reservationRoutes);

app.use(cors({
    origin: 'http://localhost:3001',
    }));

app.use(bodyParser.json());

// Increase the limit for EventEmitter instance
EventEmitter.defaultMaxListeners = 20; 

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
console.log("Magic happens on port " + port);

