const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  active: {
    type: Boolean,
    default: true,
  },
  createdBy: String,
  teamName: String,
  teamDesp: String,
  teamLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "myProject" }],
});

module.exports = mongoose.model("Team", teamSchema);
