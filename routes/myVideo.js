var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myVid = require("../model/myVideo.model");
// const { v4: uuidV4 } = require("uuid");

router.get("/", function (req, res, next) {
  myVid.find({}).exec((error, records) => {
    if (error) throw error;
    res.json(records);
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
  console.log(req.body.roomUrl);
  var newMeet = new myVid({
    roomUrl: req.body.roomUrl,
    hostedBy: req.body.hostedBy,
    title: req.body.title,
    agenda: req.body.agenda,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

//   res.json(newMeet);
  newMeet.save(function (err) {
    if (err) console.log("error", err);
    // saved!
  });
});

module.exports = router;
