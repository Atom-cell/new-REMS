var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var myEmp = require("../model/myEmployee.model");


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('indexx');
  res.json({ message: "Hello !" });
});

//add new Employee
router.post("/addNewEmployer", function (req, res, next) {
    // console.log(req.body._id);
    var newEmployer = new myEmp({
      // _id: req.body._id,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
  
    // res.json(newEmployee);
    newEmployer.save(function (err) {
      if (err) console.log("error", err);
      // saved!
    });
  });

module.exports = router;
