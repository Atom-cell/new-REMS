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
});

module.exports = myCal = mongoose.model("myCalendar", myCalendarSchema);
