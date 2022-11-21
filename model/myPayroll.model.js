var mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define a schema
var myPayrollSchema = mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    dateRange: String,
    totalAmount: String,
    totalTime: String,
    paid: Boolean,
    invoice: {
      _id: String,
      date: String,
      dueDate: String,
    },
    employees: [
      {
        employeeUsername: String,
        totalTime: String,
        baseAmount: String,
        adjustments: [{ adjustment: String, comment: String }],
      },
    ],
    projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: "myProject" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("myPayroll", myPayrollSchema);
