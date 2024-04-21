const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const UserSearch = require("../models/userSearch")
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = [];
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId: userId, socketId: socket.id });
  }
  socket.on(
    "sendNotification",
    ({ senderId, receiverId, instrument, message }) => {
      const user = getUser(receiverId);
      if (user) {
        const receiverSocketId = user.socketId;
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("getNotification", {
            senderId,
            instrument,
            message,
          });
          console.log("emit notification", message);
        } else {
          console.log("Receiver socket not found.");
        }
      } else {
        console.log("user not found.");
      }
    }
  );
  socket.on("sendTradeStatus", ({ receiverId, status }) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getTradeStatus", { status });
        console.log("Sent trade status:", status);
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});


const notifyUsers = async (instrument) => {
  const { status, age } = instrument;
  try {
    const matchingUsers = await UserSearch.find({
      $or: [
        { status: { $exists: false } },
        { status },
      ],
      $or: [
        { age: { $exists: false } },
        { age },
      ],
    });
    matchingUsers.forEach((user) => {
      const socketId = getUser(user.userId)?.socketId;
      if (socketId) {
        io.to(socketId).emit("newInstrumentNotification", { instrument });
      }
    });
  } catch (error) {
    console.error("Error notifying users:", error);
  }
};
 const getRecipientSocketId = (recipientId) => {
  const user = getUser(recipientId);
  return receiverSocketId = user.socketId;

};

module.exports = { io, server, app, notifyUsers,getRecipientSocketId };
