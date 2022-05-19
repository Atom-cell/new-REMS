var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myEmp = require("../model/myEmployee.model");

// search employees
router.get("/", (req, res, next)=> {
  // console.log(req.query.name);
  myEmp.find({}).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

// search specific Employee
router.get("/:userId", (req, res, next)=> {
  // console.log(req.params.userId);
  myEmp.findById(req.params.userId).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

//add new Employee
router.post("/addNewEmployee", (req, res, next) => {
  // console.log(req.body.username);
  // res.send(req.body);
  var newEmployee = new myEmp({
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
