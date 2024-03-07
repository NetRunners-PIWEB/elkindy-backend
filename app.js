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

// ==============================================
// START THE SERVER
// ==============================================
app.listen(port);
io.listen(5000);
console.log("Magic happens on port " + port);

module.exports = app;
