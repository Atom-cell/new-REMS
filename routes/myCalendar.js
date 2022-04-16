var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myCal = require("../model/myCalender.model");

//Define a schema

// Compile model from schema

/* GET My Calendar. */
router.get("/", function (req, res, next) {
  myCal.find({}).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

//add new Event
router.post("/addNewEvent", function (req, res, next) {
  // console.log(req.body._id);
  var newEvent = new myCal({
    // _id: req.body._id,
    madeBy: req.body.madeBy,
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    category: req.body.category,
  });

  // res.json(newEvent);
  newEvent.save(function (err) {
    if (err) console.log("error", err);
    // saved!
  });
});

// update an event
router.route("/updateEvent").put(function (req, res) {
  var updatedEvent = new myCal({
    _id: req.body._id,
    madeBy: req.body.madeBy,
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    category: req.body.category,
  });
  myCal.findOneAndUpdate(
    { _id: req.body._id },
    updatedEvent,
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    }
  );
});

// delete an event
router.delete("/deleteEvent", function (req, res, next) {
  // console.log(req.body._id);
  myCal.findOneAndRemove({ _id: req.body._id }, function (err) {
    if (err) console.log("Error " + err);
    console.log("Removed");
  });
});

module.exports = router;
