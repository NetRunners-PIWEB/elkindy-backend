const Conversation = require("../../models/conversation.js");
const Message = require("../../models/message.js");
const User = require("../../models/user.js");
const Course = require("../../models/course.js");
const { getRecipientSocketId, io } = require("../../socket/socket.js");
const cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
      let { img, video } = req.body;
      console.log(video)
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
      if (video) {
        const uploadedVideo = await cloudinary.uploader.upload(video, {
          resource_type: "video",
        });
        video = uploadedVideo.secure_url;
      }

      const newMessage = new Message({
        conversationId: conversation._id,
        sender: senderId,
        text: message,
        img: img || "",
        video: video || "",
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
          const adminsAsTeacher = await User.find({
            role: "admin",
            _id: { $ne: requesterId },
          });
          return res.status(200).json(adminsAsTeacher);
        case "admin":
          const adminsAsAdmin = await User.find({
            role: "admin",
            _id: { $ne: requesterId },
          });
          return res.status(200).json(adminsAsAdmin);
        default:
          res.status(400).json("Invalid requester role");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
  static async startQuizAndGenerateQuestions(req, res) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const topic = req.query.topic;
      const prompt = `Generate quiz of 5 questions with choices and answers for the topic in json form: ${topic}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json\n|```|\\n/g, "");
      const reply = JSON.parse(jsonString);
      res.status(200).json({ reply });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = MessageController;
