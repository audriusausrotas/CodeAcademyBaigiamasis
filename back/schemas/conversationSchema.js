const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  messages: {
    type: Array,
    required: false,
    default: [],
  },
  users: {
    type: Array,
    required: false,
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("examConversations", conversationSchema);
