var mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define a schema
var myPayrollSchema = mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    dateRange: String,
    totalAmount: String,
    totalTime: String,
    paid: String,
    employees: [
      {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
        totalTime: String,
        baseAmount: String,
        adjustments: String,
        commment: String,
      },
    ],
    projectId: [{ type: mongoose.Schema.Types.ObjectId, ref: "myProject" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("myPayroll", myPayrollSchema);
