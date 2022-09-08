var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myProject = require("../model/myProject.model");
var Admin = require("../model/Admin.model");
const nodemailer = require("nodemailer");

// Get all Projects
router.get("/", (req, res, next) => {
  // console.log(req.query.name);
  myProject.find({}).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

// Get Completed Projects
router.get("/completed", (req, res, next) => {
  // console.log(req.query.name);
  // find project
  // search in project files that if completionPercentage==100 and completed==true then return
  // "projectFiles._id": req.body.projectFileId,
  // {
  //   "projectFiles.completionPercentage": "100",
  //   "projectFiles.completed": "true",
  // }
  // {$elemMatch: {description:"8989", zone:"front"}}
  myProject
    .find({
      projectFiles: {
        $elemMatch: {
          completionPercentage: "100",
          completed: "true",
        },
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

// Get Incompleted Projects
router.get("/incompleted", (req, res, next) => {
  // console.log(req.query.name);
  // get all projects whose completion percentage is 100 and completed is false
  // also get all projects that does not have any completion percentage
  // "projectFiles.completionPercentage": "100",
  //     "projectFiles.completed": "true",
  // { $or:[ {'_id':objId}, {'name':param}, {'nickname':param} ]}
  //   {
  //     $and: [
  //         { $or: [{a: 1}, {b: 1}] },
  //         { $or: [{c: 1}, {d: 1}] }
  //     ]
  // }
  myProject.find({}).exec((error, records) => {
    if (error) throw error;
    // console.log(records);
    // const x = records.filter((rec) => rec.projectFiles.length == 0);
    myProject
      .find({
        $or: [
          { "projectFiles.completed": { $ne: true } },
          {
            projectFiles: {
              $elemMatch: {
                completionPercentage: "100",
                completed: "false",
              },
            },
          },
        ],
      })
      .exec((err, rec) => {
        if (error) res.status(500).json(err);
        // console.table(rec);
        res.status(200).json(rec);
      });
  });
});
// get not assigned projects
router.get("/assigned", (req, res, next) => {
  // console.log(req.query.name);
  myProject.find({ projectAssignedTo: "" }).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

// Get Specific Projects
router.get("/:projectName", (req, res, next) => {
  //   console.log(req.params.projectName);
  myProject
    .find({
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
    res.status(200).json(savedMessage);
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
  console.log("Time is: ", req.body.time);
  console.log("Breaks: ", req.body.breaks);
  console.log(req.body._id);

  myProject.findOneAndUpdate(
    { _id: req.body._id },
    { $push: { hoursWorked: req.body.time, numOfBreaks: req.body.breaks } },

    (err, rec) => {
      if (err) res.status(500).json(err);
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
