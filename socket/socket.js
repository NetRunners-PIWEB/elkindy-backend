const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { createObs } = require('../controllers/examController/observationController');



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
  console.log(users)
  users = users.filter((user) => user.socketId != socketId);
  console.log(users)
};

global.users = users;

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("connecteedd")
  if (userId != "undefined") {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId: userId, socketId: socket.id });
  }
  socket.on(
    "sendNotification",
    ({ senderId, receiverId, instrument, message }) => {
      const user = getUser(receiverId);
      console.log(user);
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
    }
  );
  socket.on("sendTradeStatus", ({ receiverId, status }) => {
    const user = getUser(receiverId);
    const receiverSocketId = user.socketId;
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getTradeStatus", { status });
      console.log("Sent trade status:", status);
    } else {
      console.log("Receiver socket not found.");
    }
  });
  
  // Lorsque vous ajoutez une nouvelle observation


  socket.on("disconnect", () => {
    console.log("disconnected");
    removeUser(socket.id);
  });
});
/*
io.on('addObservation', async (observation) => {
  try {
    // Exécuter createObs de manière asynchrone
    const result = await createObs(observation);
    
    // Envoie une notification à l'étudiant concerné
    const studentSocket = io.sockets.sockets.get(observation.student);
    if (studentSocket) {
      studentSocket.emit('newObservation', result.description);
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'observation :', error);
  }
});*/




module.exports = { io, server, app,getUser };
