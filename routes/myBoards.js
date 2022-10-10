var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var myBoard = require("../model/myBoard.model");

// router.get("/", (req, res) => {
//   myBoard.find({}).exec((err, rec) => {
//     if (err) res.status(500).send(err);
//     res.status(200).send(rec);
//   });
// });

router.get("/specificboard", (req, res) => {
  myBoard.find({ _id: req.query._id }).exec((err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

// get project boards
router.get("/getprojectboard", (req, res) => {
  myBoard.find({ projectId: req.query.projectId }).exec((err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

router.get("/onlymyboards", (req, res) => {
  // console.log(req.query.empId);
  myBoard.find({ empId: req.query.empId }).exec((err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

router.get("/:boardName", (req, res, next) => {
  // console.log(req.params.boardName);
  // console.log(req.query.empId);

  myBoard
    .find({
      empId: req.query.empId,
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

router.post("/createboardwithproject", (req, res) => {
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
    projectId: req.body.projectId,
  });
  newBoard.save((err) => {
    if (err) res.status(500).send(err);
    res.status(200).send(newBoard);
  });
});

router.put("/updateboard", (req, res) => {
  // console.log("update board");
  // console.log(req.body);
  //   console.log(req.body.boards);
  // var updatedObj = new myBoard({
  //   _id: req.body.bid,
  //   // empId: req.body.uid,
  //   title: req.body.title,
  //   boards: req.body.boards,
  // });
  myBoard.findOneAndUpdate(
    { _id: req.body.bid },
    { $set: { boards: req.body.boards } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.put("/updateboardtitle", (req, res) => {
  // console.log("update board Title");
  // console.log(req.body);
  //   console.log(req.body.boards);
  var updatedObj = new myBoard({
    _id: req.body.bid,
    // empId: req.body.uid,
    title: req.body.title,
    boards: req.body.boards,
  });
  myBoard.findOneAndUpdate(
    { _id: req.body.bid },
    { $set: { title: req.body.title } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
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

router.get("/boardsshared/withme", (req, res) => {
  // console.log(req.query.username);
  myBoard.find({ sharewith: { $in: [req.query.username] } }, (err, rec) => {
    if (err) res.status(500).json(err);
    // console.log(rec);
    res.status(200).json(rec);
  });
});

router.get("/getsharewith/employees", (req, res) => {
  console.log(req.query.bid);
  // find the respective board and return its employees

  myBoard.find({ _id: req.query.bid }, { sharewith: 1 }, (err, rec) => {
    if (err) res.status(500).send(err);
    res.status(200).send(rec);
  });
});

router.post("/shareboardwith", (req, res) => {
  myBoard.findOneAndUpdate(
    { _id: req.body.bid },
    { $set: { sharewith: req.body.sharewith } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

module.exports = router;
