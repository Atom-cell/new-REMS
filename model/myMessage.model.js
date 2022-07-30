const mongoose = require("mongoose");

const myMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    // Image: {
    //   name: { type: "string" },
    //   image: { type: "string" },
    // },
  },
  { timestamps: true }
);

module.exports = myMessage = mongoose.model("Message", myMessageSchema);
