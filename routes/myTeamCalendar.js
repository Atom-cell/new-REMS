var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myTeamCal = require("../model/myTeamCalendar.model");

//Define a schema

// Compile model from schema

/* GET My Calendar. */
// show only the events of the user logged in
router.get("/", function (req, res, next) {
  // console.log(req.query.userId);
  myTeamCal.find({ teamId: req.query.teamId }).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

router.get("/getmyprojectgoal", function (req, res, next) {
  // console.log(req.query.userId);
  myTeamCal.find({ projectId: req.query.projectId }).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

//add new Event
router.post("/addNewEvent", function (req, res, next) {
  // console.log(req.body.startDate);
  // console.log(typeof req.body.startDate);
  var newEvent = new myTeamCal({
    // _id: req.body._id,
    madeBy: req.body.madeBy,
    title: req.body.title,
    startDate: new Date(req.body.startDate),
    category: req.body.category,
    teamId: req.body.teamId,
  });

  // res.json(newEvent);
  newEvent.save(function (err, rec) {
    if (err) console.log("error", err);
    res.status(200).json(rec);
    // saved!
  });
});

// update an event
router.route("/updateEvent").put(function (req, res) {
  var updatedEvent = new myTeamCal({
    _id: req.body._id,
    madeBy: req.body.madeBy,
    title: req.body.title,
    startDate: req.body.startDate,
    // endDate: req.body.endDate,
    category: req.body.category,
  });
  myTeamCal.findOneAndUpdate(
    { _id: req.body._id },
    updatedEvent,
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(result);
      }
    }
  );
});

// delete an event
router.delete("/deleteEvent", function (req, res, next) {
  // console.log(req.body._id);
  myTeamCal.findOneAndRemove({ _id: req.body._id }, function (err, rec) {
    if (err) console.log("Error " + err);
    res.status(200).json(rec);
  });
});

module.exports = router;
