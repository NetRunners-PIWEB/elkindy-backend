const express = require("express");
const MessageController = require("../../controllers/messageController/message.controller.js");
const { authenticate } = require("../../middlewares/auth.js");
const router = express.Router();

router.get(
  "/conversations",
  authenticate(),
  MessageController.getConversations
);
router.get("/:otherUserId", authenticate(), MessageController.getMessages);
router.post("/",  authenticate(), MessageController.sendMessage);

module.exports = router;
