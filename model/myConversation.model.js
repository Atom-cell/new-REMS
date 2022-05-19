const mongoose = require("mongoose");

const myConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = myConversation= mongoose.model("Conversation", myConversationSchema);