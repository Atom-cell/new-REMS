var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const myPayroll = require("../model/myPayroll.model");
const Emp = require("../model/Emp.model");
const Stripe = require("stripe")("");
// process.env.Secret_key

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

router.get("/getemployeepayrolls", async (req, res) => {
  //   console.log(req.query.employeeId);
  try {
    const allPayrolls = await myPayroll.find({
      "employees.employeeUsername": req.query.employeeUsername,
    });
    res.status(200).json(allPayrolls);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/addadjustment", (req, res) => {
  // console.log(req.body);
  //_id, employeeId, adjustment, comment
  myPayroll.findOneAndReplace(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
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

router.get("/empwithnames", (req, res) => {
  // console.log(req.query.emps);
  var newArray = req.query.emps.map(function (el) {
    return JSON.parse(el);
  });
  var records = [];
  newArray.forEach((item) => {
    Emp.find({ _id: item.employeeId }, { _id: 1, username: 1 }, (err, rec) => {
      if (err) res.status(500).json(err);
      console.log(rec[0]);
      records.push(rec[0]);
    });
    console.log(records);
  });
  // console.log(records);
});

router.post("/payment", async (req, res) => {
  // console.log(req.body.amount);
  // console.log(process.env.Secret_key);
  let status, error;
  const { token, amount, payrollId } = req.body;
  // console.log(typeof amount);
  try {
    await Stripe.charges.create({
      source: token.id,
      amount: 10,
      currency: "usd",
      description: "asdasda",
      shipping: {
        name: "Jenny Rosen",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
    });
    status = "success";
  } catch (error) {
    console.log(error);
    status = "Failure";
  }
  if (status == "success") {
    myPayroll.findOneAndUpdate(
      { _id: payrollId },
      { paid: true },
      { new: true },
      (err, res) => {
        if (err) res.status(500).json(err);
        // console.log(res);
      }
    );
  }
  res.json({ error, status });
});

module.exports = router;
