const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Emp = require("../model/Emp.model");
const Admin = require("../model/Admin.model");
const { response } = require("express");

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

//nyzfzwkbsgboxsce
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("yo, we need token");
  } else {
    jwt.verify(token, "helloworld", (err, data) => {
      if (err) res.json({ auth: false, msg: "fail auth" });

      req.userEmail = data.email;
      req.role = data.role;
      // console.log("EMAIl: ", req.userEmail);

      // console.log("ROle: ", req.role);

      next();
    });
  }
};

router.get("/download", function (req, res) {
  try {
    res.download("./REMSSetup.msi");
  } catch (e) {
    console.log("Error: ", e.message);
  }
  // REMSSetup.msi;
});

// router.get("/allEmps", verifyJWT, async (req, res) => {
//   console.log("In all Empps");
//   try {
//     Admin.find({ email: req.userEmail })
//       .populate("employees")
//       .exec(function (err, data) {
//         if (err) console.log(err.message);
//         res.json({ msg: 1, data: data[0].employees });
//       });
//   } catch (err) {
//     console.log(err.message);
//   }
// });

router.get("/getUserInfo/:id", verifyJWT, async (req, res) => {
  console.log(req.userEmail);
  console.log(req.role);

  let mail = req.userEmail;
  let role = req.role;

  if (role === "admin") {
    const user = await Admin.findOne({ _id: req.params.id });
    res.json(user);
  } else {
    const v = {
      screenshot: 0,
      totalTime: 0,
      appTime: 0,
      separateTime: 0,
      notifications: 0,
    };

    const User = await Emp.findOne({ _id: req.params.id }).select(v);
    res.json(User);
  }
});
// search employees
router.get("/", (req, res, next) => {
  // console.log(req.query.name);
  Emp.find({}).exec((error, records) => {
    if (error) throw error;
    res.json(records);
  });
});

router.get("/getemployeeinformation", (req, res) => {
  Emp.find({ _id: req.query._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    res.status(200).json(rec);
  });
});

router.get("/getcompanyemployees", (req, res) => {
  // first find admin of the respective employee
  // console.log(req.query._id);
  Admin.find({ employees: req.query._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    Emp.find(
      { _id: { $in: rec[0].employees } },
      { _id: 1, username: 1, email: 1, profilePicture: 1 },
      (errr, recc) => {
        if (errr) res.status(500).json(err);
        // console.log(recc);
        res.status(200).json(recc);
      }
    );
  });
});

router.get("/getmyadmin", (req, res) => {
  Admin.find(
    { employees: req.query._id },
    // { _id: 1, username: 1, email: 1 },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

router.get("/getadmindetails", (req, res) => {
  Admin.find(
    { _id: req.query._id },
    { _id: 1, username: 1, email: 1 },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // console.log(rec);
      res.status(200).json(rec);
    }
  );
});

router.get("/getmyemployees", (req, res) => {
  console.log(req.query._id);
  Admin.find({ _id: req.query._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    Emp.find({ _id: { $in: rec[0].employees } }, (errr, recc) => {
      if (errr) res.status(500).json(err);
      res.status(200).json(recc);
    });
  });
});

// search specific Employee
router.get("/:userId", (req, res, next) => {
  console.log(req.params.userId);
  Emp.findById(req.params.userId).exec((error, records) => {
    if (error) throw error;
    // console.log(records.username);
    res.json(records);
  });
});

// return all employees except specific employee
// router.get("/exceptme/:userId", (req, res) => {
//   // console.log(req.params.userId);
//   Emp.find({ _id: { $nin: req.body.userId } }, (err, rec) => {
//     if (err) res.status(500).json(err);
//     res.status(200).json(rec);
//   });
// });

// get all converssations based on a name
router.get("/getuserbyname/:name", (req, res) => {
  // console.log(req.params.name);
  Emp.find(
    { username: { $regex: req.params.name, $options: "i" } },
    { _id: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      res.status(200).json(rec);
    }
  );
});

// get all converssations based on a name
router.get("/getallusersbyname/:name", (req, res) => {
  // Emp.find(
  //   { username: { $regex: req.params.name, $options: "i" } },
  //   (err, rec) => {
  //     if (err) res.status(500).json(err);
  //     res.status(200).json(rec);
  //   }
  // );

  Admin.find({ employees: req.query._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    Emp.find(
      {
        _id: { $in: rec[0].employees },
        username: { $regex: req.params.name, $options: "i" },
      },
      { _id: 1, username: 1, email: 1 },
      (errr, recc) => {
        if (errr) res.status(500).json(err);
        res.status(200).json(recc);
      }
    );
  });
});

router.get("/getallmyusersbyname/:name", (req, res) => {
  Admin.find({ _id: req.query._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    Emp.find(
      {
        _id: { $in: rec[0].employees },
        username: { $regex: req.params.name, $options: "i" },
      },
      { _id: 1, username: 1, email: 1 },
      (errr, recc) => {
        if (errr) res.status(500).json(err);
        res.status(200).json(recc);
      }
    );
  });
});

router.get("/dash/getCoaching/:id", async (req, res) => {
  console.log("getting coaching");
  let id = req.params.id;
  const v = {
    strength: 1,
    weakness: 1,
  };

  const user = await Emp.findOne({ _id: id }).select(v);
  res.json(user);
});

router.get("/dash/activeTime", verifyJWT, async (req, res) => {
  console.log("getting coaching");
  const v = {
    totalTime: 1,
  };

  const user = await Emp.findOne({ email: req.userEmail }).select(v);
  res.json(user);
});

router.post("/emailinvoice", (req, res) => {
  // console.log(req.body);
  // employerId, emps, file

  // Find all emps and then send email to those emps
  Emp.find()
    .where("username")
    .in(req.body.emps)
    .exec((err, rec) => {
      if (err) res.status(500).send(err);
      // console.log(rec);
      rec.forEach((employee) => {
        // console.log(employee.email);
        // send email
        let mailOptions = {
          from: ' "Invoice from REMS" <cinnakale@gmail.com>',
          to: employee.email,
          subject: "REMS - Invoice",
          html: `<img src="${req.body.file}"`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log("send mail error: ", err.message);
            res.status(500).send(err);
          } else {
            console.log("Invoice Email Sent!!!");
          }
        });
      });
      res.status(200).send("Invoice Email Sent!");
    });
});

router.post("/register", verifyJWT, async (req, res, next) => {
  console.log("In Emp Register");
  let { email, hourlyRate } = req.body;

  //check user already exists or not
  const user = await Emp.findOne({ email: email });
  if (user) {
    return res.json({ msg: 0 });
  } else {
    let password = crypto.randomBytes(64).toString("hex");
    const hashPassword = await bcrypt.hash(password, 10);
    var newEmp = new Emp({
      _id: mongoose.Types.ObjectId(),
      email,
      password: hashPassword,
      username: email.split("@")[0],
      hourlyRate: hourlyRate,
    });
    newEmp
      .save()
      .then((data) => res.status(200).json({ data: data, msg: 1 }))
      .catch((err) => res.status(err));

    // send email
    let mailOptions = {
      from: ' "Verify your email" <cinnakale@gmail.com>',
      to: email,
      subject: "REMS - Login Credentials",
      html: `
      <h2>Thank you for choosing REMS </h2>
      <h4>Following are your credentials</h4>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <a href="http://localhost:3000/login">Login to REMS</a>
      <a href="http://localhost:3000/download>Download App link</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log("send mail error: ", err.message);
      else {
        console.log("VERIFICATION EMAIL SENT!!!");
      }
    });
  }

  console.log("new emp: ", newEmp);
  // get email of admin from jwt
  // find admin
  // find user by email or _id

  // adding in that admins emps list
  let a = newEmp._id;
  try {
    Admin.findOneAndUpdate(
      { email: req.userEmail },
      {
        $push: {
          employees: a,
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
  } catch (e) {}
});

router.get("/getEmp/:id", verifyJWT, (req, res, next) => {
  Emp.findById(req.params.id).then((response) => {
    res.json(response);
  });
});

//for emp + admin
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  console.log("LOGIN: ", email, password);
  const v = {
    screenshot: 0,
    totalTime: 0,
    appTime: 0,
    separateTime: 0,
    profilePicture: 0,
  };
  const a = {
    profilePicture: 0,
    emailToken: 0,
    employees: 0,
    bday: 0,
    contact: 0,
    bankDetails: 0,
  };

  //check user already exists or not
  const Euser = await Emp.findOne({ email: email }).select(v);
  const Auser = await Admin.findOne({ email: email }).select(a);

  //////////////

  //update attendance

  const fixTimezoneOffset = (date) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
  };

  let d = new Date();
  let present = true;

  console.log("DATE: ", fixTimezoneOffset(d));
  if (Euser) {
    if (await bcrypt.compare(req.body.password, Euser.password)) {
      console.log("ATTendance");

      Euser.attendance.forEach((date) => {
        console.log(
          " ARRAY ",
          fixTimezoneOffset(date).slice(0, 10),
          " TOday, ",
          fixTimezoneOffset(d).slice(0, 10)
        );
        console.log();
        if (
          fixTimezoneOffset(date).slice(0, 10) ===
          fixTimezoneOffset(d).slice(0, 10)
        ) {
          //console.log("ALREADY");
          present = false;
        } else {
          //console.log("not");
          present = true;
        }
      });

      console.log(present);
      if (present) {
        Emp.findOneAndUpdate(
          { email: email },
          {
            $addToSet: {
              attendance: d,
            },
          }
        )
          // $addToSet
          .then((msg) => {
            console.log("message ", msg.attendance);
            // res.json(msg);
          })
          .catch((err) => res.status(err));
      }
    }
  }

  /////////////
  ////////////
  if (Euser) {
    if (Euser.active) {
      if (await bcrypt.compare(req.body.password, Euser.password)) {
        const token = jwt.sign(
          { email: Euser.email, role: Euser.role },
          "helloworld"
        );

        if (Euser.desktop) {
          let date = new Date();
          console.log("INOUTITITITITII");
          try {
            Emp.findOneAndUpdate(
              { email: req.body.email },
              {
                $push: {
                  InOut: {
                    date: date.toLocaleDateString(),
                    In: date,
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
        }

        return res.json({ data: Euser, msg: 1, token: token, auth: true });
      } else {
        return res.json({ data: null, msg: 0 });
      }
    } else if (!Euser.active) {
      return res.json({ data: null, msg: 0 });
    }
  }

  if (Auser) {
    if (await bcrypt.compare(password, Auser.password)) {
      const token = jwt.sign(
        { email: Auser.email, role: Auser.role },
        "helloworld"
      );
      return res.json({ data: Auser, msg: 1, token: token, auth: true });
    } else return res.json({ data: Auser, msg: 0 });
  } else {
    return res.json({ msg: 0 });
  }
});

// delete from admin not work
router.delete("/deleteEmp/:id", verifyJWT, (req, res) => {
  console.log("In Delete");
  console.log(req.params.id);

  //6287ffd800aa0f2419e224df

  // Admin.findOneAndUpdate(
  //   { email: req.userEmail },
  //   { $pull: { employees: req.params.id } }
  // ).then((response) => console.log(response));

  Emp.findByIdAndUpdate(req.params.id, { active: false }).then(
    (response) => {}
  );
});

router.post("/updateProfile/:role/:id", async (req, res) => {
  console.log("updateing profile");
  const role = req.params.role;
  const id = req.params.id;
  const {
    email,
    username,
    password,
    contact,
    bank,
    profilePicture,
    bday,
    gender,
  } = req.body;
  if (password) {
    console.log("yes password");
    if (role === "admin") {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await Admin.findOne({ _id: id });
      user.email = email;
      user.username = username;
      user.password = hashPassword;
      user.contact = contact;
      user.bankDetails = `${bank}`;
      user.profilePicture = profilePicture;
      user.bday = bday;
      user.gender = gender;
      user.save().then(() => {
        console.log("saved");
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await Emp.findOne({ _id: id });
      user.email = email;
      user.username = username;
      user.password = hashPassword;
      user.contact = contact;
      user.bankDetails = `${bank}`;
      user.profilePicture = profilePicture;
      user.bday = bday;
      user.gender = gender;
      user.save().then(() => {
        console.log("saved");
      });
    }
  } else {
    console.log("no password");
    if (role === "admin") {
      const user = await Admin.findOne({ _id: id });
      user.email = email;
      user.username = username;
      user.contact = contact;
      user.bankDetails = `${bank}`;
      user.profilePicture = profilePicture;
      user.bday = bday;
      user.gender = gender;
      user.save().then(() => {
        console.log("saved");
      });
    } else {
      const user = await Emp.findOne({ _id: id });
      user.email = email;
      user.username = username;
      user.contact = contact;
      user.bankDetails = `${bank}`;
      user.profilePicture = profilePicture;
      user.bday = bday;
      user.gender = gender;
      user.save().then(() => {
        console.log("saved");
      });
    }
  }
});
router.put("/recoverEmp", (req, res) => {
  console.log("recvering employee");
  let id = req.body.id;
  Emp.findOneAndUpdate({ _id: id }, { active: true }, (err, rec) => {
    if (err) console.log(err);
    else {
    }
  });
});
router.put("/update", async (req, res) => {
  const { email, username, password, contact, bank } = req.body;
  console.log(email, username, password, contact, bank);
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await Emp.findOne({ username: username });

  if (user) {
    return res.json({ msg: 0 });
  } else {
    Emp.findOneAndUpdate(
      { email: email },
      {
        username: username,
        password: hashPassword,
        updated: true,
        contact: contact,
        bankDetails: bank,
        verified: true,
      }
    )
      .then((data) => {
        res.json({ data: data, msg: 1 });
      })
      .catch((err) => res.status(err));
  }
});

//for  both admin + emp
router.post("/reset", async (req, res) => {
  console.log("IN RESET");
  const { email } = req.body;

  const Euser = await Emp.findOne({ email: email });
  const Auser = await Admin.findOne({ email: email });

  let password = crypto.randomBytes(64).toString("hex");
  const hashPassword = await bcrypt.hash(password, 10);

  if (Euser) {
    Euser.password = hashPassword;
    Euser.save();
    let mailOptions = {
      from: ' "Reset Password" <cinnakale@gmail.com>',
      to: email,
      subject: "REMS - Reset Password",
      html: `
      <h2>Thank you for choosing REMS </h2>
      <h4>Following are your credentials</h4>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <a href="http://localhost:3000/login">Login to REMS</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else {
        console.log("VERIFICATION EMAIL SENT!!!");
      }
    });

    res.json({ msg: 1 });
  } else if (Auser) {
    Auser.password = hashPassword;
    Auser.save();
    let mailOptions = {
      from: ' "Reset Password" <cinnakale@gmail.com>',
      to: email,
      subject: "REMS - Reset Password",
      html: `
      <h2>Thank you for choosing REMS </h2>
      <h4>Following are your credentials</h4>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <a href="http://localhost:3000/login">Login to REMS</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else {
        console.log("VERIFICATION EMAIL SENT!!!");
      }
    });

    res.json({ msg: 1 });
  } else {
    console.log("else");
    res.json({ msg: 0 });
  }
});

//active idle time
router.post("/times", (req, res) => {
  const { email, active_time, idle_time } = req.body;
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
          console.log(data);
        }
      }
    );
  } catch (e) {
    res.send(e);
  }
});

router.post("/apptime", (req, res) => {
  const { email, tt } = req.body;
  console.log(email, tt);

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
          console.log(data);
        }
      }
    );
  } catch (e) {
    res.send(e);
  }
});

router.put("/logout", verifyJWT, async function (req, res) {
  console.log("LOGOUTLOGOUT");
  let date = new Date();
  const Euser = await Emp.findOne({ email: req.userEmail });

  if (Euser) {
    let newInout = Euser.InOut;
    Euser.InOut.forEach((o, i) => {
      if (o.date === date.toLocaleDateString() && o.Out === undefined) {
        newInout[i].Out = date;
      }
    });
    // console.log(newInout);
    try {
      Emp.findOneAndUpdate(
        { email: req.userEmail },
        {
          $set: {
            InOut: newInout,
          },
        },
        function (error, data) {
          if (error) {
            console.log(error);
          } else {
            res.status(200);
          }
        }
      );
    } catch (e) {
      res.send(e);
    }
  } else {
    res.status(200);
  }
  // try {
  //   Emp.updateOne(
  //     { "InOut.date": date.toLocaleDateString() },
  //     {
  //       $set: {
  //         "InOut.$.Out": date.toLocaleDateString(),
  //       },
  //     },
  //     function (err, result) {
  //       if (err) console.log(err.message);
  //       res.send(result);
  //     }
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
});

module.exports = router;
