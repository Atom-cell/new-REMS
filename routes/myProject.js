var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myProject = require("../model/myProject.model");

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

// Get Completed Projects
router.get("/incompleted", (req, res, next) => {
  // console.log(req.query.name);
  myProject.find({ completed: "Incompleted" }).exec((error, records) => {
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

// search specific Employee
router.get("/:userId", (req, res, next) => {
  // console.log(req.params.userId);
  myProject.findById(req.params.userId).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

//add new Employee
router.post("/addNewEmployee", (req, res, next) => {
  // console.log(req.body.username);
  // res.send(req.body);
  var newEmployee = new myProject({
    // _id: req.body._id,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    auth: req.body.auth,
  });

  // res.json(newEmployee);
  newEmployee.save(function (err) {
    if (err) console.log("error", err);
    // saved!
  });
});

module.exports = router;
