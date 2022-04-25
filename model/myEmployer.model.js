var mongoose = require("mongoose");

//Define a schema
var myEmployerSchema = mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = myEmployer = mongoose.model("myEmployer", myEmployerSchema);
