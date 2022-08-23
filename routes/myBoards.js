var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myBoard = require("../model/myBoard.model");

router.get("/", (req, res) => {
  myBoard.find({}).exec((err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

router.get("/:boardName", (req, res, next) => {
  //   console.log(req.params.projectName);
  myBoard
    .find({
      title: {
        $regex: req.params.boardName,
        $options: "i",
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

router.post("/createboard", (req, res) => {
  //   console.log(req.body.userId);
  var newBoard = new myBoard({
    empId: req.body.userId,
    title: "Title Not Set",
    color: "#fff",
    boards: [
      {
        title: "To-Do",
        cards: [],
      },
    ],
  });
  newBoard.save((err) => {
    if (err) res.status(500).send(err);
    res.status(200).send(newBoard);
  });
});

router.put("/updateboard", (req, res) => {
  //   console.log(req.body.bid);
  //   console.log(req.body.boards);
  var updatedObj = new myBoard({
    _id: req.body.bid,
    empId: req.body.uid,
    title: req.body.title,
    boards: req.body.boards,
  });
  myBoard.findOneAndUpdate({ _id: req.body.bid }, updatedObj, (err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

router.put("/updatecolor", (req, res) => {
  // console.log(req.body.bid);
  // console.log(req.body.color);

  myBoard.findOneAndUpdate(
    { _id: req.body.bid },
    { $set: { color: req.body.color } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.delete("/deleteboard", (req, res) => {
  myBoard.findOneAndRemove({ _id: req.body._id }, (err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

module.exports = router;
