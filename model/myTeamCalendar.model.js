var mongoose = require("mongoose");

//Define a schema
var myTeamCalendar = mongoose.Schema({
  madeBy: {
    type: String,
  },
  title: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  category: {
    type: String,
  },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});

module.exports = myTeamCal = mongoose.model("myTeamCalendar", myTeamCalendar);
