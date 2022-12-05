const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const Admin = require("../model/Admin.model");
const Emp = require("../model/Emp.model");
const Activity = require("../model/Activity.model");
const Project = require("../model/myProject.model");

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("yo, we need token");
  } else {
    jwt.verify(token, "helloworld", (err, data) => {
      if (err) res.json({ auth: false, msg: "fail auth" });

      req.userEmail = data.email;
      req.role = data.role;
      //console.log("EMAIl: ", req.userEmail);

      //console.log("ROle: ", req.role);

      next();
    });
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/register", async (req, res, next) => {
  console.log("In Admin Registers");
  let { username, email, password } = req.body;

  //check user already exists or not
  const user = await Admin.findOne({ email: email });
  if (user) {
    // 0 = User already exists
    return res.json({ msg: 0 });
  } else {
    const hashPassword = await bcrypt.hash(password, 5);
    let newAdmin = new Admin({
      username,
      email,
      password: hashPassword,
      role: "admin",
      emailToken: crypto.randomBytes(64).toString("hex"),
    });
    //// 1 = User registered
    newAdmin
      .save()
      .then((data) => res.status(200).json({ data: data, msg: 1 }))
      .catch((err) => res.status(err));

    // send email
    let mailOptions = {
      from: ' "Verify your email" <cinnakale@gmail.com>',
      to: email,
      subject: "REMS - Email Verification",
      html: `
      <h2> ${username} Thank you for choosing REMS </h2>
      <h4>Please verify your email</h4>
      <a href="http://${req.headers.host}/admin/verify?token=${newAdmin.emailToken}">Verify your Email </a>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err.message);
      else {
        console.log("VERIFICATION EMAIL SENT!!!");
      }
    });

    console.log("new admin: ", newAdmin);
  }
});

//delete the email token ehich shows it is verififed
router.get("/verify", async (req, res) => {
  let token = req.query.token;
  const admin = await Admin.findOne({ emailToken: token });
  if (admin) {
    admin.verified = true;
    admin.emailToken = null;
    await admin.save();
    console.log("VERIFIEddd");
    res.redirect("http://localhost:3000/home");
  } else {
    res.redirect("http://localhost:3000/home");
  }
});

router.get("/allEmps", verifyJWT, async (req, res) => {
  //console.log("In all Empps");
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
    password: 0,
    profilePicture: 0,
    bankDetails: 0,
    InOut: 0,
    notifications: 0,
  };
  try {
    Admin.find({ email: req.userEmail })
      .populate({
        path: "employees",
        select: v,
        match: { active: true },
      })
      .exec((err, data) => {
        if (err) console.log(err.message);
        res.json({ msg: 1, data: data[0].employees });
      });
  } catch (err) {
    console.log(err.message);
  }
});
router.get("/allDeletedEmps", verifyJWT, (req, res) => {
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
    password: 0,
    profilePicture: 0,
    bankDetails: 0,
    InOut: 0,
    notifications: 0,
    strength: 0,
    weakness: 0,
  };
  try {
    Admin.find({ email: req.userEmail })
      .populate({
        path: "employees",
        select: v,
        match: { active: false },
      })
      .exec((err, data) => {
        if (err) console.log(err.message);
        res.json(data[0].employees);
      });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/getMoreInfo/:email", async (req, res) => {
  console.log("getting more Info", req.params.email);
  let email = req.params.email;
  const v = { notifications: 0, InOut: 0 };

  const user = await Emp.findOne({ email: email }).select(v);
  res.json(user);
});

router.get("/projectInfo/:id", (req, res) => {
  // id is of employee

  Project.find({ projectAssignedTo: { $in: req.params.id } }).then(
    (response) => {
      res.json(response);
    }
  );
});

router.get("/getLogEmps", verifyJWT, async (req, res) => {
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    password: 0,
    bankDetails: 0,
  };
  try {
    Admin.find({ email: req.userEmail })
      .populate({ path: "employees", select: v, match: { active: true } })
      .exec((err, data) => {
        if (err) console.log(err.message);
        res.json({ msg: 1, data: data[0].employees });
      });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/logs/:email", verifyJWT, async (req, res) => {
  console.log("In Logs", req.params.email);

  Activity.find({ email: req.params.email })
    .sort({ _id: -1 })
    .then((response) => {
      res.json({ data: response });
    });
});

router.get("/aa", async (req, res) => {
  res.redirect("http://localhost:3000/home");
});

router.get("/getCoaching/:id", async (req, res) => {
  console.log("getting coaching");
  let id = req.params.id;
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    password: 0,
    bankDetails: 0,
    notifications: 0,
    profilePicture: 0,
  };

  const user = await Emp.findOne({ _id: id }).select(v);
  res.json(user);
});

router.post("/coachStrength/:id", (req, res) => {
  console.log("adding stength");
  let id = req.params.id;
  let { msg } = req.body;
  // strength
  // weakness
  Emp.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        strength: {
          msg: msg,
        },
      },
    },
    (err, rec) => {
      if (err) console.log(err);
      else res.json(rec.strength);
    }
  );
});

router.post("/coachWeakness/:id", (req, res) => {
  console.log("adding weakness");
  let id = req.params.id;
  let { msg } = req.body;

  Emp.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        weakness: {
          msg: msg,
        },
      },
    },
    (err, rec) => {
      if (err) console.log(err);
      else res.json(rec.weakness);
    }
  );
});

router.post("/deleteStrength/:id/:sid", (req, res) => {
  console.log("deleting strength");
  let id = req.params.id;
  let sid = req.params.sid;

  Emp.findOneAndUpdate(
    { _id: id },
    { $pull: { strength: { _id: sid } } },
    function (err, obj) {
      if (err) console.log(err);
      else res.json(obj);
    }
  );
});

router.post("/deleteWeakness/:id/:sid", (req, res) => {
  console.log("deleting weakness");
  let id = req.params.id;
  let sid = req.params.sid;

  Emp.findOneAndUpdate(
    { _id: id },
    { $pull: { weakness: { _id: sid } } },
    function (err, obj) {
      if (err) console.log(err);
      else res.json(obj);
    }
  );
});

router.delete("/deletelog/:email", (req, res) => {
  console.log("In delte Logs", req.params.email);

  Activity.deleteMany({ email: req.params.email }).then((response) => {
    res.json({ data: response });
  });
});

router.put("/deleteSS/:email", (req, res) => {
  console.log("Deleting SS");
  let email = req.params.email;
  let { SS } = req.body;
  console.log(email, SS.length);
  Emp.findOneAndUpdate({ email: email }, { screenshot: SS }, (err, rec) => {
    if (err) console.log(err.message);
    else {
      res.json("OK");
    }
  });
});

router.put("/updateZone", (req, res) => {
  let prod = req.body.zone;
  let id = req.body.id;
  if (prod < 60) zone = "red";
  else if (prod > 60 && prod < 80) zone = "yellow";
  else zone = "green";

  Emp.findOneAndUpdate({ _id: id }, { zone: zone }, (err, rec) => {});
});

router.get("/aa", async (req, res) => {
  res.redirect("http://localhost:3000/home");
});

router.post("/postlog", (req, res) => {
  let a = new Activity({
    email: "zzzzzz099999@gmail.com",
    app: "aasada",
    time: "999:999:999",
  });
  a.save().then((response) => {
    res.send("OK");
  });
});
module.exports = router;
