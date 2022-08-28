var mongoose = require("mongoose");

//Define a schema
var myProjectSchema = mongoose.Schema({
  projectName: {
    type: String,
  },
  projectDescription: {
    type: String,
  },
  projectCost: {
    type: String,
  },
  projectPriority: {
    type: String,
  },
  projectAssignedBy: {
    type: String,
  },
  projectAssignedTo: {
    type: String,
  },
  projectAssignedToId: {
    type: String,
  },
  helpingMaterial: {
    type: String,
  },
  fileName: {
    type: String,
  },
  hoursWorked: {
    type: String,
  },
  hoursWorkedOn: {
    type: Boolean,
  },
  dueDate: {
    type: String,
  },
  milestones: [
    {
      completionPercentage: String,
      dueDate: String,
    },
  ],
  projectFiles: [
    {
      file: String,
      fileName: String,
      completionPercentage: String,
      completed: Boolean,
    },
  ],
  completed: {
    type: String,
  },
});

module.exports = myProject = mongoose.model("myProject", myProjectSchema);
