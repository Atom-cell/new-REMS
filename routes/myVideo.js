var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myVid = require("../model/myVideo.model");
// const { v4: uuidV4 } = require("uuid");

// get all Meetings
router.get("/", function (req, res, next) {
  myVid.find({}).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

// get only specific meetings i-e the user that is logged in only his meetings
// get all Meetings
// only the specific name containing object will be returned
router.get("/getMyMeetings/:username", function (req, res, next) {
  // case insensitive search
  // 'name': {'$regex': thename,$options:'i'}
  myVid.find({ employees: {'$regex': req.params.username,$options:'i'} }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      // console.log(result);
      res.json(result);
    }
  });
});

// router.get("/generateid", (req, res) => {
//   res.redirect(`/myVideo/${uuidV4()}`);
// });

router.get("/:room", (req, res) => {
  res.send(req.params.room);
});

//add new Meeting
router.post("/addNewMeeting", function (req, res, next) {
  // console.log(req.body.employees);
  var newMeet = new myVid({
    roomUrl: req.body.roomUrl,
    hostedBy: req.body.hostedBy,
    title: req.body.title,
    agenda: req.body.agenda,
    startDate: req.body.startDate,
    employees: req.body.employees,
  });

  //   res.json(newMeet);
  newMeet.save(function (err) {
    if (err) console.log("error", err);
    // saved!
  });
});

// delete a meeting
router.delete("/deleteMeeting", function (req, res, next) {
  console.log(req.body._id);
  myVid.findOneAndRemove({ _id: req.body._id }, function (err) {
    if (err) console.log("Error " + err);
    console.log("Removed");
  });
});

module.exports = router;
