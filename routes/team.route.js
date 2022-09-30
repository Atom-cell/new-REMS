const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../model/Admin.model");
const Emp = require("../model/Emp.model");
const Team = require("../model/Team.model");

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("yo, we need token");
  } else {
    jwt.verify(token, "helloworld", (err, data) => {
      if (err) res.json({ auth: false, msg: "fail auth" });

      req.userEmail = data.email;
      req.role = data.role;

      next();
    });
  }
};

router.get("/", (req, res) => {
  res.send("in teams");
});

router.get("/getEmps", verifyJWT, (req, res) => {
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
    password: 0,
    profilePicture: 0,
    bankDetails: 0,
  };
  try {
    Admin.find({ email: req.userEmail })
      .populate({ path: "employees", select: v })
      .exec((err, data) => {
        if (err) console.log(err.message);
        res.json({ msg: 1, data: data[0].employees });
      });
  } catch (err) {
    console.log(err.message);
  }
});
router.post("/createTeam", verifyJWT, (req, res) => {
  let { teamName, teamDesp, teamLead, members } = req.body;
  let newTeam = new Team({
    createdBy: req.userEmail,
    teamName,
    teamDesp,
    teamLead,
    members,
  });

  newTeam
    .save()
    .then((data) => res.status(200).json({ data: data, msg: 1 }))
    .catch((err) => res.status(err));

  console.log(newTeam);
});

router.get("/getTeams", (req, res) => {
  console.log("GEtting teams");
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
  };
  try {
    Team.find({ email: req.userEmail }, v)
      .populate({ path: "teamLead", select: v })
      .populate({ path: "members", select: v })
      .exec((err, data) => {
        if (err) console.log(err.message);
        res.json({ msg: 1, data: data });
      });
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/getMyTeam", (req, res) => {
  console.log("my teams");
  const id = "6287e83b145d25be6a314702";

  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
  };
  Team.find({ members: { $in: id } }, v)
    .populate({ path: "teamLead", select: v })
    .populate({ path: "members", select: v })
    .exec((err, data) => {
      if (err) console.log(err.message);
      res.json({ msg: 1, data: data });
      //   res.json(data);
    });
});

router.delete("/deleteTeam/:id", verifyJWT, (req, res) => {
  console.log("In Delete");
  console.log(req.params.id);

  Team.findByIdAndUpdate(req.params.id, { active: false }).then((response) =>
    console.log()
  );
});

module.exports = router;
