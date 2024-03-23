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
const cors = require("cors");

app.use(bodyParser.json());

const { EventEmitter } = require("events");
const instrumentRouter = require("./routes/marketplaceRoutes/instrument.route.js");
const exchangeRouter = require("./routes/marketplaceRoutes/exchange.route.js");

app.use(express.json());
// const io = new ioS.Server({
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

const userRoutes = require("./routes/userRoutes/index");
const courseRoutes = require("./routes/courseRoutes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const { userVerification } = require("./middlewares/authJWT");
// ==============================================

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
swaggerDoc(app);
app.use(cors());
const examRoutes = require("./routes/examRoutes");
const classRoutes = require("./routes/classRoutes");
const morgan = require("morgan");
const eventRoutes = require("./routes/eventRoutes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes/ticketRoutes");
const reservationRoutes = require("./routes/reservationRoutes/reservationRoutes");

// ==============================================
app.use(corsMiddleware);

// SWAGGER docs
swaggerDoc(app);
app.use(morgan("dev"));
connect();

// Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/instruments", instrumentRouter);
app.use("/api/exchanges", exchangeRouter);
let users = [];

// SOCKET CONNECTION
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("new connection", userId);
  if (userId != "undefined") {
    // userSocketMap[userId] = socket.id;
    !users.some((user) => user.userId === userId) &&
      users.push({ userId: userId, socketId: socket.id });
  }
  socket.on(
    "sendNotification",
    ({ senderId, receiverId, instrument, message }) => {
      const user = getUser(receiverId);
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getNotification", {
          senderId,
          instrument,
          message,
        });
        console.log("emit notification");
      } else {
        console.log("Receiver socket not found.");
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("disconnect of the socket");
    removeUser(socket.id);
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reservations", reservationRoutes);

app.use("/api/exam", examRoutes);
app.use("/api/class", classRoutes);
app.use(bodyParser.json());

// Increase the limit for EventEmitter instance
EventEmitter.defaultMaxListeners = 20;

// ==============================================
// START THE SERVER
// ==============================================

// if (process.env.NODE_ENV !== 'test') {
//   // Only start the server if not in test environment
//   app.listen(port, () => console.log(`Server running on port ${port}`));
//   io.listen(5000);
// }
app.listen(port);
io.listen(5000);
console.log("Magic happens on port " + port);

module.exports = app;
