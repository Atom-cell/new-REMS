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

module.exports = router;
