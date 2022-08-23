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
  myProject.find({ completed: "Completed" }).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

// Get Incompleted Projects
router.get("/incompleted", (req, res, next) => {
  // console.log(req.query.name);
  myProject.find({ completed: "Incompleted" }).exec((error, records) => {
    if (error) throw error;
    res.json(records);
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
