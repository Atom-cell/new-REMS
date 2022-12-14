const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const mongoose = require("mongoose");
// const LZString = require("lz-string");
const base64ToImage = require("base64-to-image");
const Emp = require("../model/Emp.model");
const Admin = require("../model/Admin.model");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const Euser = await Emp.findOne({ email: email });

  if (Euser) {
    if (Euser.active) {
      if (await bcrypt.compare(req.body.password, Euser.password)) {
        Euser.desktop = true;
        Euser.save();
        res.send("sanoppi");
      } else res.send("NOT OK");
    }
  } else {
    res.send("NOT OK");
  }
});

// router.post("/logout", async function (req, res) {
//   const { email } = req.body;
//   console.log("In logout", email);
//   const Euser = await Emp.findOne({ email: email });

//   if (Euser) {
//     Euser.desktop = false;
//     Euser.save();
//     res.send("sanoppi");
//   } else {
//     res.send("NOT OK");
//   }
// });

router.post("/times", (req, res) => {
  console.log("Times");
  const { email, active_time, idle_time } = req.body;
  // console.log(active_time, idle_time);
  try {
    Emp.findOneAndUpdate(
      { email: email },
      {
        $push: {
          totalTime: {
            date: Date.now(),
            activetime: active_time,
            idletime: idle_time,
          },
        },
      },
      function (error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log("");
        }
      }
    );
  } catch (e) {
    res.send(e);
  }
});

router.post("/apptime", (req, res) => {
  console.log("APP time");
  const { email, tt } = req.body;
  // console.log(email, tt);

  try {
    Emp.findOneAndUpdate(
      { email: email },
      {
        $push: {
          appTime: {
            date: Date.now(),
            apps: JSON.parse(tt),
          },
        },
      },
      function (error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log();
        }
      }
    );
  } catch (e) {
    res.send(e);
  }
});

router.post("/SS", (req, res) => {
  console.log("In SS");
  const { email, img } = req.body;

  try {
    Emp.findOneAndUpdate(
      { email: email },
      {
        $push: {
          screenshot: {
            date: Date.now(),
            img: img,
          },
        },
      },
      function (error, data) {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  } catch (e) {
    console.log(e.message);
  }
});

router.post("/daytimes", (req, res) => {
  console.log("In DAY TIME");
  const { email, activeDayTime, idleDayTime, activeArray, idleArray } =
    req.body;

  console.log(activeDayTime);
  console.log(idleDayTime);
  console.log(activeArray);
  console.log(idleArray);

  try {
    Emp.findOneAndUpdate(
      { email: email },
      {
        $push: {
          separateTime: {
            date: Date.now(),
            idleDay: idleDayTime,
            activeDay: activeDayTime,
            idle: idleArray,
            active: activeArray,
          },
        },
      },
      function (error, data) {
        if (error) {
          console.log(error.message);
        } else {
          console.log("");
        }
      }
    );
  } catch (e) {
    res.send(e);
  }
});

// router.post("/separate", (req, res) => {
//   console.log("Sepaaete tiems");
//   const { email, activeArray, idleArray } = req.body;

//   console.log(activeArray);
//   console.log(idleArray);

//NOT THIS

// try {
//   Emp.findOneAndUpdate(
//     { email: email },
//     {
//       $push: {
//         separateTime: {
//           date: Date.now(),
//           idle: idleArray,
//           active: activeArray,
//         },
//       },
//     },
//     function (error, data) {
//       if (error) {
//         console.log(error.message);
//       } else {
//         console.log("");
//       }
//     }
//   );
// } catch (e) {
//   res.send(e);
// }
// });
module.exports = router;
