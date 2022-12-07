const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Emp = require("../model/Emp.model");
const Admin = require("../model/Admin.model");
const Project = require("../model/myProject.model");
var myBoard = require("../model/myBoard.model");
const Team = require("../model/Team.model");

const { response } = require("express");

router.get("/InOut/:email", async function (req, res) {
  console.log("gettings INS");
  let email = req.params.email;
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    notifications: 0,
    attendance: 0,
    profilePicture: 0,
    password: 0,
  };

  const User = await Emp.findOne({ email: email }).select(v);
  res.json(User.InOut);
});

router.get("/AppsSites/:email/:month", async function (req, res) {
  console.log("Apps Sites");
  let email = req.params.email;
  const v = {
    screenshot: 0,
    totalTime: 0,
    separateTime: 0,
    notifications: 0,
    attendance: 0,
    profilePicture: 0,
    password: 0,
  };

  const User = await Emp.findOne({ email: email }).select(v);
  let app = User.appTime.filter(
    (app) => new Date(app.date).getMonth() + 1 == req.params.month
  );
  res.json(app);
});

router.get("/allProjects/:id/:status/:month", async (req, res) => {
  console.log("getting projects");
  let month = req.params.month;
  if (req.params.status === "all") {
    const project = await Project.find({
      projectAssignedBy: req.params.id,
    });
    let proj = project.filter(
      (p) => new Date(p.createdAt).getMonth() + 1 == month
    );
    res.json(proj);
  } else {
    const project = await Project.find({
      projectAssignedBy: req.params.id,
      status: req.params.status,
    });
    // let proj = project.filter(
    //   (p) => new Date(p.createdAt).getMonth() + 1 == month
    // );
    res.json(project);
  }
});

router.get("/allProjectsWork/:id/:status", async (req, res) => {
  console.log("getting projects");
  // let month = req.params.month;
  if (req.params.status === "all") {
    const project = await Project.find({
      projectAssignedBy: req.params.id,
    });
    // let proj = project.filter(
    //   (p) => new Date(p.createdAt).getMonth() + 1 == month
    // );
    res.json(project);
  } else {
    const project = await Project.find({
      projectAssignedBy: req.params.id,
      status: req.params.status,
    });
    // let proj = project.filter(
    //   (p) => new Date(p.createdAt).getMonth() + 1 == month
    // );
    res.json(project);
  }
});

router.get("/activeIdle/:email/:month/:year", async (req, res) => {
  console.log("gettings active");
  const month = req.params.month;
  const year = req.params.year;
  let email = req.params.email;
  const v = {
    screenshot: 0,
    notifications: 0,
    attendance: 0,
    profilePicture: 0,
    password: 0,
  };

  let User = await Emp.findOne({ email: email }).select(v);
  User.totalTime = User.totalTime.filter(
    (t) => new Date(t.date).getMonth() + 1 == month
  );
  User.separateTime = User.separateTime.filter(
    (t) => new Date(t.date).getMonth() + 1 == month
  );
  res.json(User);
});

router.get("/InOutLast/:id", async function (req, res) {
  console.log("gettings INS");
  let email = req.params.email;
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    notifications: 0,
    attendance: 0,
    profilePicture: 0,
    password: 0,
  };

  const User = await Emp.findOne({ _id: req.params.id }).select(v);
  res.json(User.InOut);
});

router.get("/activeIdleLast/:id/:month/:year", async (req, res) => {
  console.log("gettings active");
  const month = req.params.month;
  const year = req.params.year;
  const v = {
    screenshot: 0,
    notifications: 0,
    attendance: 0,
    profilePicture: 0,
    password: 0,
  };

  let User = await Emp.findOne({ _id: req.params.id }).select(v);
  User.totalTime = User.totalTime.filter(
    (t) => new Date(t.date).getMonth() + 1 == month
  );
  User.separateTime = User.separateTime.filter(
    (t) => new Date(t.date).getMonth() + 1 == month
  );
  User.appTime = User.appTime.filter(
    (app) => new Date(app.date).getMonth() + 1 == month
  );
  res.json(User);
});

router.get("/employeeprojects/:id", (req, res) => {
  console.log("gtting projets");
  // const month = req.params.month;
  Project.find({ projectAssignedTo: { $in: req.params.id } }, (err, rec) => {
    if (err) res.status(500).json(err);
    else {
      // let proj = rec.filter(
      //   (p) => new Date(p.createdAt).getMonth() + 1 == month
      // );
      res.json(rec);
    }
  });
});

router.get("/empTeams/:id", (req, res) => {
  console.log("gtting teams");
  Team.find({ members: { $in: req.params.id } }, (err, rec) => {
    if (err) res.status(500).json(err);
    else {
      res.json(rec);
    }
  });
});

// router.get("/totalTasksDone/:id/:month", (req, res) => {
//   console.log("gtting projets");
//   const month = req.params.month;
//   Project.find({ projectAssignedTo: { $in: req.params.id } }, (err, rec) => {
//     if (err) res.status(500).json(err);
//     else {
//       let proj = rec.filter(
//         (p) => new Date(p.createdAt).getMonth() + 1 == month
//       );
//       res.json(proj);
//     }
//   });
// });

router.get("/onlymyboards", (req, res) => {
  console.log("getting BOARDS");
  // let id = req.params.id;

  myBoard.find({ projectId: { $ne: null } }, (err, rec) => {
    if (err) console.log(err);
    else res.json(rec);
  });
});

module.exports = router;
