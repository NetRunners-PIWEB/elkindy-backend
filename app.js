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
const instrumentRouter = require("./routes/instrument.route.js");
app.use(express.json());
// const io = new ioS.Server({
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes/courseRoutes');


const authRoutes = require("./routes/authRoutes");
// ==============================================
app.use(bodyParser.json());
app.use(corsMiddleware);
swaggerDoc(app);

connect();
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
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use(cors({
    origin: 'http://localhost:3001',
    }));

app.use(bodyParser.json());

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
io.listen(5000);
console.log("Magic happens on port " + port);

module.exports = app;
