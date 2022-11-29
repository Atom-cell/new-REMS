var mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define a schema
var myInvoiceModel = mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    dateRange: String,
    // totalAmount: String,
    // totalTime: String,
    employees: [
      {
        employeeUsername: String,
        totalTime: String,
        date: String,
        hourlyRate: Number,
      },
    ],
    projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: "myProject" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("myInvoice", myInvoiceModel);
