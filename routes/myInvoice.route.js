var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const myInvoice = require("../model/myInvoice.model");
const Emp = require("../model/Emp.model");
var myProject = require("../model/myProject.model");
// process.env.Secret_key

router.get("/getallinvoices", async (req, res) => {
  //   console.log(req.query.employerId);
  try {
    const allInvoices = await myInvoice.find({
      employerId: req.query.employerId,
    });
    res.status(200).json(allInvoices);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/searchinvoice/:invoiceTitle", (req, res, next) => {
  console.log(req.params.invoiceTitle);
  console.log(req.query.empId);

  myInvoice
    .find({
      employerId: req.query.empId,
      invoiceTitle: {
        $regex: req.params.invoiceTitle,
        $options: "i",
      },
    })
    .exec((error, records) => {
      if (error) throw error;
      res.json(records);
    });
});

router.get("/getProjects", (req, res) => {
  console.log(req.query.projectIds);
  myProject
    .find()
    .where("_id")
    .in(req.query.projectIds)
    .exec((err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).json(rec);
    });
});

router.get("/hourlyRate", (req, res) => {
  // console.log(req.query.newArray);
  var newArray = [];
  req.query.newArray.forEach((arrayItem) => {
    newArray.push({ ...JSON.parse(arrayItem), hourlyRate: 0 });
  });
  // console.log(newArray);
  // for all users in newArray get their hourlyRate and add that to newArray and return
  var newA = [];
  newArray.forEach((arrayItem, index) => {
    Emp.find({ username: arrayItem.user }, { hourlyRate: 1 }, (err, rec) => {
      if (err) res.status(500).send(err);
      // console.log(rec[0].hourlyRate);
      newA.push({ ...arrayItem, hourlyRate: rec[0].hourlyRate });
      var len = newArray.length - 1;
      if (len === index) res.status(200).json(newA);
    });
  });
  // res.status(200).json(newA);
  // console.log(newA);
});

router.get("/getemployeepayrolls", async (req, res) => {
  //   console.log(req.query.employeeId);
  try {
    const allPayrolls = await myInvoice.find({
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
  myInvoice.findOneAndReplace(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

router.post("/generateinvoice", (req, res) => {
  console.log(req.body);
  myInvoice.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: { invoice: req.body.myObj },
    },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.post("/updateinvoiceduedate", (req, res) => {
  console.log(req.body);
  myInvoice.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: { "invoice.dueDate": req.body.dueDate },
    },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).send(err);
      res.status(200).send(rec);
    }
  );
});

router.post("/newinvoice", async (req, res) => {
  //   console.log(req.body);
  const newInvoice = new myInvoice(req.body);

  try {
    const savedInvoice = await newInvoice.save();
    res.status(200).json(savedInvoice);
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
    myInvoice.findOneAndUpdate(
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
