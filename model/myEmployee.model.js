var mongoose = require("mongoose");

//Define a schema
var myEmployeeSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  auth: {
    type: Boolean,
  },
});

module.exports = myEmployee = mongoose.model("myEmployee", myEmployeeSchema);
