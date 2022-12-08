var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myComments = require("../model/myComments.model");

router.get("/getallcomments", (req, res) => {
  //   console.log(req.query.projectId);
  const v = {
    _id: 1,
    username: 1,
    profilePicture: 1,
  };
  myComments
    .find({ projectId: req.query.projectId })
    .populate({ path: "employeeId", select: v, match: { active: true } })
    .sort({ createdAt: -1 })
    .exec((err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    });
});

router.post("/createcomment", (req, res) => {
  //   console.log(req.body.userId);
  var newComment = new myComments(req.body);
  newComment.save((err) => {
    if (err) res.status(500).send(err);
    res.status(200).send(newComment);
  });
});

router.delete("/deleteComment", (req, res) => {
  myComments.findOneAndRemove({ _id: req.body._id }, (err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

module.exports = router;
