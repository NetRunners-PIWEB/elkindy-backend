const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

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
        console.log("emit notification",message);
      } else {
        console.log("Receiver socket not found.");
      }
    }
  );

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

module.exports = { io, server, app };
