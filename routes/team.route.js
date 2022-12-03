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
      .populate({ path: "employees", select: v, match: { active: true } })
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

  console.log();
});

//admin
router.get("/getTeams", verifyJWT, (req, res) => {
  console.log(req.userEmail);
  console.log("GEtting teams");
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
  };
  try {
    Team.find({ createdBy: req.userEmail, active: true }, v)
      .populate({ path: "teamLead", select: v, match: { active: true } })
      .populate({ path: "members", select: v, match: { active: true } })
      .exec((err, data) => {
        if (err) console.log(err.message);
        res.json({ msg: 1, data: data });
      });
  } catch (err) {
    console.log(err.message);
  }
});

//EMP
router.get("/getMyTeam/:id", verifyJWT, (req, res) => {
  console.log("my teams");

  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
  };
  Team.find({ members: { $in: req.params.id } }, v)
    .populate({ path: "teamLead", select: v, match: { active: true } })
    .populate({ path: "members", select: v, match: { active: true } })
    .exec((err, data) => {
      if (err) console.log(err.message);
      res.json({ msg: 1, data: data });
      //   res.json(data);
    });
});

router.get("/teambyid", (req, res) => {
  // console.log(req.userEmail);
  // console.log("GEtting teams");
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    attendance: 0,
  };
  try {
    Team.find({ _id: req.query.teamId, active: true }, v)
      .populate({ path: "teamLead", select: v, match: { active: true } })
      .populate({ path: "members", select: v, match: { active: true } })
      .exec((err, rec) => {
        if (err) res.status(500).json(err);
        res.status(200).json(rec);
      });
  } catch (err) {
    console.log(err.message);
  }

  // Team.find({ _id: req.query.teamId }, (err, rec) => {
  //   if (err) res.status(500).json(err);
  //   res.status(200).json(rec);
  // });
});

router.delete("/deleteTeam/:id", verifyJWT, (req, res) => {
  console.log("In team Delete");
  console.log(req.params.id);

  Team.findByIdAndUpdate(req.params.id, { active: false }).then((response) =>
    res.json(response)
  );
});

router.put("/updateTeam", verifyJWT, async (req, res) => {
  let { id, teamName, teamDesp, teamLead, members } = req.body;

  Team.findOneAndUpdate(
    { _id: id },
    {
      teamName,
      teamDesp,
      teamLead,
      members,
    }
  )
    .then((data) => {
      res.json({ data: data, msg: 1 });
    })
    .catch((err) => res.status(err));
});

module.exports = router;
