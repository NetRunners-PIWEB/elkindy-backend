const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, 
  },
  permissions: [{
    type: String,
  }],
 
});

module.exports = mongoose.model("Roles", roleSchema);

