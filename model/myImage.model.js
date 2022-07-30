const mongoose = require("mongoose");

const myImageSchema = mongoose.Schema({
  name: { type: "string" },
  image: { type: "string" },
});

module.exports = mongoose.model("Image", myImageSchema);
