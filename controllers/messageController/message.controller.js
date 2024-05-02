const Conversation = require("../../models/conversation.js");
const Message = require("../../models/message.js");
const User = require("../../models/user.js");
const Course = require("../../models/course.js");
const { getRecipientSocketId, io } = require("../../socket/socket.js");
const cloudinary = require("cloudinary").v2;

class MessageController {
  static async getMessages(req, res) {
    const { otherUserId } = req.params;
    const userId = req.user._id;
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, otherUserId] },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = await Message.find({
        conversationId: conversation._id,
      }).sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getConversations(req, res) {
    const userId = req.user._id;
    try {
      console.log(userId);
      const conversations = await Conversation.find({
        participants: userId,
      }).populate({
        path: "participants",
        select: "username image",
      });
      conversations.forEach((conversation) => {
        conversation.participants = conversation.participants.filter(
          (participant) => participant._id.toString() !== userId.toString()
        );
      });
      res.status(200).json(conversations);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  }
  static async sendMessage(req, res) {
    try {
      const { recipientId, message } = req.body;
      let { img } = req.body;
      const senderId = req.user._id;
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
          lastMessage: {
            text: message,
            sender: senderId,
          },
        });
        await conversation.save();
      }

      if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
      }

      const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        text: message,
        img: img || "",
      });

      await Promise.all([
        newMessage.save(),
        conversation.updateOne({
          lastMessage: {
            text: message,
            sender: senderId,
          },
        }),
      ]);

      const recipientSocketId = getRecipientSocketId(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getUsersBasedOnRole(req, res) {
    try {
      const requesterId = req.user._id;
      const requester = await User.findById(requesterId);
      const requesterRole = requester.role;

      switch (requesterRole) {
        case "teacher":
          const admins = await User.find({ role: "admin" });
          return res.status(200).json(admins);
        default:
          res.status(400).json("Invalid requester role");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = MessageController;