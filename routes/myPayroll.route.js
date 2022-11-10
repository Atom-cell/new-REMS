var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const myPayroll = require("../model/myPayroll.model");

router.get("/getallpayrolls", async (req, res) => {
  //   console.log(req.query.employerId);
  try {
    const allPayrolls = await myPayroll.find({
      employerId: req.query.employerId,
    });
    res.status(200).json(allPayrolls);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/newpayroll", async (req, res) => {
  //   console.log(req.body);
  const newPayroll = new myPayroll(req.body);

  try {
    const savedPayroll = await newPayroll.save();
    res.status(200).json(savedPayroll);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
