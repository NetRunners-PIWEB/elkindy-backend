// BASE SETUP
// ==============================================
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { connect } = require("./config/mongoose.js");
const corsMiddleware = require("./middlewares/cors.js");
var bodyParser = require("body-parser");
const swaggerDoc = require("./docs/swaggerDoc");
const { port, env } = require("./config/vars");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { EventEmitter } = require('events');
const instrumentRouter = require("./routes/instrument.route.js"); 
const userRoutes = require("./routes/userRoutes/index");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');
const authRoutes = require("./routes/authRoutes");
const { userVerification } = require("./middlewares/authJWT");
// ==============================================


connect();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    swaggerDoc(app);
    app.use(cookieParser());
    app.use(cors());
const eventRoutes = require("./routes/eventRoutes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes/ticketRoutes");
const reservationRoutes = require("./routes/reservationRoutes/reservationRoutes");


// ==============================================
app.use(bodyParser.json());
app.use(corsMiddleware);
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

app.use("/api/v1/instruments", instrumentRouter);

io.on("connection", (socket) => {
  socket.on(
    "sendNotification",
    ({ senderName, receiverName, instrument, message }) => {
      console.log("emit notif now");
      io.emit("getNotification", {
        senderName,
        instrument,
        message,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("disocnnect");
  });
});

app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reservations", reservationRoutes);




app.use(bodyParser.json());

// Increase the limit for EventEmitter instance
EventEmitter.defaultMaxListeners = 20; 

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
io.listen(5000);
console.log("Magic happens on port " + port);


module.exports = app;

