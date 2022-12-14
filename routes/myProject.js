var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myProject = require("../model/myProject.model");
var Admin = require("../model/Admin.model");
const Team = require("../model/Team.model");
var employee = require("../model/Emp.model");
const nodemailer = require("nodemailer");

router.get("/getmyproject", (req, res) => {
  // console.log(req.query);
  myProject.find({ _id: req.query.projectId }, (err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

// get all projects Ids(that is array) info of a team
router.get("/teamprojects", (req, res) => {
  console.log(req.query.teamProjects);
  myProject
    .find()
    .where("_id")
    .in(req.query.teamProjects)
    .exec((err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    });
});

router.get("/hoursworked", (req, res) => {
  // console.log(req.query._id);
  console.log(req.query.emps);
  // Inside hoursWorked we need to find user and their sum total time
  myProject.find(
    { projectAssignedBy: req.query._id, "hoursWorked.user": req.query.emps },
    // { hoursWorked: 1 },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

router.post("/markhoursworkedtrue", (req, res) => {
  // console.log(req.body);
  // console.log(req.body._id);
  //_id, employees, dateRange
  // console.log(req.body.employees);
  // console.log(firstDate);
  // console.log(secondDate);
  req.body.projects.forEach((project) => {
    console.log(project._id);
    myProject.findOneAndReplace(
      {
        _id: project._id,
      },
      project,
      // {
      //   _id: project._id,
      //   projectName: project.projectName,
      //   projectCost: project.projectCost,
      //   projectPriority: project.projectPriority,
      //   projectAssignedBy: project.projectAssignedBy,
      //   projectAssignedTo: project.projectAssignedTo,
      //   hoursWorked: project.hoursWorked,
      //   numOfBreaks: project.numOfBreaks,
      //   dueDate: project.dueDate,
      //   goals: project.goals,
      //   milestones: project.milestones,
      //   projectFiles: project.projectFiles,
      //   createdAt: project.createdAt,
      // },
      {},
      (err, rec) => {
        if (err) res.status(500).json(err);
      }
    );
  });
  res.status(200).json("Success");
});

// Get all Projects For Employee
router.get("/", (req, res, next) => {
  Admin.find({ employees: req.query.userId }, { username: 1 }, (err, rec) => {
    if (err) res.status(500).json(err);
    myProject
      .find({
        $or: [
          { projectAssignedBy: rec[0].username, projectAssignedTo: "" },
          { projectAssignedToId: req.query.userId },
        ],
      })
      .exec((error, records) => {
        if (error) throw error;
        res.status(200).json(records);
      });
  });
});

// Get all Projects under one organiziation
router.get("/organizationprojects", (req, res, next) => {
  // we need projectAssignedBy
  // console.log(req.query.name);
  myProject.find({ projectAssignedBy: req.query._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    res.status(200).json(rec);
  });
});

// Get all Projects for an employee
router.get("/employeeprojects", (req, res, next) => {
  // console.log(req.query);
  myProject.find(
    { projectAssignedTo: { $in: req.query.userId } },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

// Get Completed Projects
router.get("/completed", (req, res, next) => {
  console.log(req.query._id);
  myProject
    .find({
      projectAssignedTo: req.query._id,
      status: "completed",
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

// Get Completed Projects Admin
router.get("/completedadmin", (req, res, next) => {
  myProject
    .find({
      projectAssignedBy: req.query._id,
      status: "completed",
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

// Get Incompleted Projects for employee
router.get("/incompleted", (req, res, next) => {
  myProject
    .find({
      projectAssignedTo: req.query._id,
      status: { $ne: "completed" },
      // $or: [
      //   { "projectFiles.completed": { $ne: true } },
      //   {
      //     projectFiles: {
      //       $elemMatch: {
      //         completionPercentage: "100",
      //         completed: "false",
      //       },
      //     },
      //   },
      // ],
    })
    .exec((err, rec) => {
      if (err) res.status(500).json(err);
      // console.table(rec);
      res.status(200).json(rec);
    });
});

// Get Incompleted Projects Admin
router.get("/incompletedadmin", (req, res, next) => {
  myProject
    .find({
      projectAssignedBy: req.query._id,
      status: { $ne: "completed" },
      // $or: [
      //   { "projectFiles.completed": { $ne: true } },
      //   {
      //     projectFiles: {
      //       $elemMatch: {
      //         completionPercentage: "100",
      //         completed: "false",
      //       },
      //     },
      //   },
      // ],
    })
    .exec((err, rec) => {
      if (err) res.status(500).json(err);
      // console.table(rec);
      res.status(200).json(rec);
    });
});

// get not assigned projects
router.get("/notassigned", (req, res, next) => {
  Admin.find({ employees: req.query._id }, { _id: 1 }, (err, rec) => {
    if (err) res.status(500).json(err);
    myProject
      .find({
        projectAssignedBy: rec[0]._id,
        projectAssignedTo: { $exists: true, $size: 0 },
      })
      .exec((error, records) => {
        if (error) throw error;
        res.status(200).json(records);
      });
  });
});

// get not assigned projects admin
router.get("/notassignedadmin", (req, res, next) => {
  myProject
    .find({
      projectAssignedBy: req.query._id,
      projectAssignedTo: { $exists: true, $size: 0 },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.status(200).json(records);
    });
});

// Get Specific Projects
router.get("/searchproject/:projectName", (req, res, next) => {
  myProject
    .find({
      projectAssignedBy: req.query._id,
      projectName: {
        $regex: req.params.projectName,
        $options: "i",
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

// Get Specific Projects
router.get("/employeesearchproject/:projectName", (req, res, next) => {
  myProject
    .find({
      projectAssignedTo: req.query._id,
      projectName: {
        $regex: req.params.projectName,
        $options: "i",
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

router.post("/addNewProject", async (req, res) => {
  const newProject = new myProject(req.body);
  //   console.log(newProject);
  //   console.log(req.body.hoursWorkedOn);
  try {
    const savedMessage = await newProject.save();
    // push team id to team
    Team.findOneAndUpdate(
      { _id: req.body.teamId },
      { $push: { projects: savedMessage._id } },
      (error, success) => {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json(savedMessage);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// search specific Project
router.get("/:userId", (req, res, next) => {
  // console.log(req.params.userId);
  myProject.findById(req.params.userId).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

router.post("/acceptvolunteerproject", (req, res) => {
  // console.log(req.body._id);
  // console.log(req.body.assignedTo);

  myProject
    .findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          projectAssignedTo: req.body.assignedTo,
          projectAssignedToId: req.body.assignedToId,
        },
      },
      { new: true }
    )
    .exec((error, records) => {
      if (error) res.status(500).send(error);
      res.status(200).json(records);
    });
});

router.post("/uploadmilestonefile", (req, res) => {
  // get project id
  // add project file in the giver project id
  // console.log(req.body.fileObj.completionPercentage);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $push: { projectFiles: req.body.fileObj } },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

router.post("/markprojectcompletion", (req, res) => {
  // console.log(req.body.completed);

  myProject.findOneAndUpdate(
    {
      _id: req.body.projectId,
      "projectFiles._id": req.body.projectFileId,
    },
    { $set: { "projectFiles.$.completed": req.body.completed } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

//Time worked on

router.post("/hoursWorked", (req, res, next) => {
  const uname = req.body.username;
  console.log("Time is: ", req.body.time);
  console.log("Breaks: ", req.body.breaks);
  console.log("ID: ", req.body._id);
  console.log("Date: ", req.body.date);
  console.log("name: ", uname);

  myProject.findOneAndUpdate(
    { _id: req.body._id },
    {
      $push: {
        hoursWorked: {
          user: req.body.username,
          time: req.body.time,
          date: req.body.date,
          marked: false,
        },
        numOfBreaks: { user: req.body.username, time: req.body.breaks },
      },
    },

    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

router.put("/updateprojectname", (req, res) => {
  // console.log(req.body);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { projectName: req.body.name } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});
router.put("/updateprojectdescription", (req, res) => {
  console.log(req.body);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { projectDescription: req.body.description } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});
router.put("/updateprojectduedate", (req, res) => {
  // console.log(req.body);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { dueDate: req.body.dueDate } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.put("/updateprojectstatus", (req, res) => {
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { status: req.body.status } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.post("/updateroles", (req, res) => {
  console.log(req.body);
  if (req.body.teamId) {
    Team.findOneAndUpdate(
      { _id: req.body.teamId },
      { $set: { teamLead: req.body.projectroles } },
      { new: true },
      (err, rec) => {
        console.log("Hell");
        if (err) res.status(500).json(err);
      }
    );
  }

  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { projectroles: req.body.projectroles } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

router.post("/projectsleadupdate", (req, res) => {
  console.log(req.body);

  req.body.projects.forEach((pro) => {
    myProject.findOneAndUpdate(
      { _id: pro._id },
      { $set: { projectroles: req.body.projectLead } },
      { new: true },
      (err, rec) => {
        if (err) res.status(500).json(err);
        // console.log(rec);
      }
    );
  });
  res.status(200).json("Success");
});

router.post("/addmemberstoproject", (req, res) => {
  // console.log(req.body);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { projectAssignedTo: req.body.emps } },
    { new: true },
    (err, rec) => {
      console.log(rec);
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.post("/uploadfile", (req, res) => {
  console.log("hell");
  console.log(req.body.projectId);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    {
      $push: {
        projectFiles: {
          file: req.body.file.base64,
          fileName: req.body.file.name,
        },
      },
    },
    { new: true },
    (err, rec) => {
      // console.log(rec);
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

// delete an event
router.delete("/deleteprojectfile", function (req, res, next) {
  // console.log(req.body._id);
  myProject.findOneAndUpdate(
    { _id: req.body._id },
    { $pull: { projectFiles: { _id: req.body.fileId } } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

router.post("/addmilestone", (req, res) => {
  console.log(req.body);
  var myObj = {
    task: req.body.task,
    completed: req.body.completed,
  };
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $push: { milestones: myObj } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

router.post("/deletemilestone", (req, res) => {
  console.log(req.body);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId },
    { $pull: { milestones: { _id: req.body.milestoneId } } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

router.post("/updatemilestone", (req, res) => {
  console.log(req.body);
  myProject.findOneAndUpdate(
    { _id: req.body.projectId, "milestones._id": req.body.milestoneId },
    { $set: { "milestones.$.completed": req.body.checked } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

router.post("/sendemail", async (req, res) => {
  // console.log(req.body.receiverUsername);
  // we need the id of the receiver username
  // search in Admin
  const admin = await Admin.find({
    username: req.body.receiverUsername,
  }).exec();

  // console.log(admin[0].email);
  // now send email
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: req.body.senderEmail, // sender address
    to: admin[0].email, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.description,
    attachments: [
      {
        filename: req.body.fileName,
        content: req.body.file,
        encoding: "base64",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json(error);
    } else {
      res.status(200).json(info);
    }
  });
});

module.exports = router;
