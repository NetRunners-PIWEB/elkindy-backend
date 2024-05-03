const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const UserSearch = require("../models/userSearch");
const User = require("../models/user.js");
const nodemailer = require("nodemailer");

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
  if (userId !== undefined) {
    const existingUser = users.find((user) => user.userId === userId);
    if (!existingUser) {
      users.push({ userId: userId, socketId: socket.id });
    } else {
      existingUser.socketId = socket.id;
    }
  }
  const userIds = users.map((user) => user.userId);
  io.emit("getOnlineUsers", userIds);

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
  socket.on("user-typing", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing");
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("stop-typing", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop-typing");
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("start-playing", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("start-playing");
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("queue", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("queue");
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("accept-invite", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("accept-invite");
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("decline-invite", (receiverId) => {
    const user = getUser(receiverId);
    if (user) {
      const receiverSocketId = user.socketId;
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("decline-invite");
      } else {
        console.log("Receiver socket not found.");
      }
    } else {
      console.log("user not found.");
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    const userIds = users.map((user) => user.userId);
    io.emit("getOnlineUsers", userIds);
  });
});

const notifyUsers = async (instrument) => {
  const { status, age } = instrument;
  try {
    const matchingUsers = await UserSearch.find({
      $or: [{ status: { $exists: false } }, { status }],
      $or: [{ age: { $exists: false } }, { age }],
    });
    matchingUsers.forEach(async (user) => {
      const userToNotify = await User.findById(user.userId);
      const socketId = getUser(user.userId)?.socketId;
      if (socketId) {
        io.to(socketId).emit("newInstrumentNotification", { instrument });
      }
      const userEmail = userToNotify.email;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Instrument Availability Notification",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; text-align: center;">
            <h2 style="color: #0056b3;">Instrument Availability Notification</h2>
            <p>The instrument matching your preferences (${status}, ${age}) is now available in the store.</p>
            <p>Thank you for using our service!</p>
          </div>
        `,
      };
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    });
    const emailList = matchingUsers.map((user) => user.email).join(", ");
  } catch (error) {
    console.error("Error notifying users:", error);
  }
};
const getRecipientSocketId = (recipientId) => {
  const user = getUser(recipientId);
  if (user) {
    return (receiverSocketId = user.socketId);
  }
};

module.exports = { io, server, app, notifyUsers, getRecipientSocketId };