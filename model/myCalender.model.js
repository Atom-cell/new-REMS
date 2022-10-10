var mongoose = require("mongoose");

//Define a schema
var myCalendarSchema = mongoose.Schema({
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
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "myProject" },
});

module.exports = myCal = mongoose.model("myCalendar", myCalendarSchema);
