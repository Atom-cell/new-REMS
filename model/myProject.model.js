var mongoose = require("mongoose");

//Define a schema
var myProjectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    projectDescription: {
      type: String,
    },
    // projectCost: {
    //   type: String,
    // },
    projectPriority: {
      type: String,
    },
    projectAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    projectAssignedTo: [
      { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
    ],
    projectroles: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },

    hoursWorked: [
      {
        user: String,
        time: String,
        date: String,
        marked: Boolean,
      },
    ],

    numOfBreaks: {
      type: [{}],
    },
    dueDate: {
      type: String,
    },
    milestones: [
      {
        task: String,
        completed: Boolean,
        dueDate: String,
        milestonesFiles: [
          {
            file: String,
            fileName: String,
          },
        ],
      },
    ],
    goals: [{ type: mongoose.Schema.Types.ObjectId, ref: "myCalendar" }],
    projectFiles: [
      {
        file: String,
        fileName: String,
      },
    ],
    status: String,
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  },
  { timestamps: true }
);

module.exports = myProject = mongoose.model("myProject", myProjectSchema);
