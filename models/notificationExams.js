const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  
    message: String ,
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
});

module.exports = mongoose.model("Notification", notificationSchema);