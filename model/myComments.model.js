var mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define a schema
var myCommentsSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "myProject",
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    // adminId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "admin",
    // },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("myComments", myCommentsSchema);
