const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Emp = require("../model/Emp.model");
const Admin = require("../model/Admin.model");
const Team = require("../model/Team.model");
var myBoard = require("../model/myBoard.model");
var myVid = require("../model/myVideo.model");
var myProject = require("../model/myProject.model");

//for refresh
router.get("/getNotif/:id", async (req, res) => {
  console.log("getting notifications");
  let emp = await Emp.findById(req.params.id);
  let admin = await Admin.findById(req.params.id);
  if (emp) {
    let notif = emp.notifications.filter((f) => f.flag === 0);
    res.json(notif);
  } else if (admin) {
    let notif = admin.notifications.filter((f) => f.flag === 0);

    res.json(notif);
    // Admin.findById(req.params.id, (err, resp) => {
    //   if (err) console.log(err.message);
    //   res.json(resp);
    // });
  }
});

router.get("/getAllNotif/:id", async (req, res) => {
  console.log("getting All notifications");
  let emp = await Emp.findById(req.params.id);
  let admin = await Admin.findById(req.params.id);
  if (emp) {
    // let notif = emp.notifications.filter((f) => f.flag === 0);
    res.json(emp.notifications);
  } else if (admin) {
    // let notif = admin.notifications.filter((f) => f.flag === 0);
    res.json(admin.notifications);
    // Admin.findById(req.params.id, (err, resp) => {
    //   if (err) console.log(err.message);
    //   res.json(resp);
    // });
  }
});

router.put("/markRead", (req, res) => {
  console.log("marking read");
  let arr = req.body.notif;
  let id = req.body.id;
  console.log(req.body.role);
  arr = arr.map((a) => {
    return { ...a, flag: 1 };
  });
  if (req.body.role === "Employee") {
    Emp.findOneAndUpdate(
      { _id: id },
      { notifications: arr },
      function (error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log(data.username);
        }
      }
    );
  } else {
    Admin.findOneAndUpdate(
      { _id: id },
      { notifications: arr },
      function (error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log(data.username);
        }
      }
    );
  }
});
//added in team
router.post("/teamNotif", (req, res) => {
  console.log("In team notification");
  const { teamName, teamLead, members } = req.body;
  try {
    Emp.findOneAndUpdate(
      { _id: teamLead },
      {
        $push: {
          notifications: {
            msg: `You have been added in team "${teamName}" as a Team Lead`,
            path: "/team",
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

  members.forEach(function (member) {
    try {
      Emp.findOneAndUpdate(
        { _id: member },
        {
          $push: {
            notifications: {
              msg: `You have been added in team "${teamName}"`,
              path: "/team",
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
});

//deleted team
router.post("/deleteTeamNotif/:id", (req, res) => {
  let id = req.params.id;
  let lead;
  let members;
  Team.findOne({ _id: id }, (err, resp) => {
    if (err) console.log(err.message);
    else {
      resp.members.forEach(function (m) {
        Emp.findOneAndUpdate(
          { _id: m.toString() },
          {
            $push: {
              notifications: {
                msg: `Team "${resp.teamName}" has been deleted!`,
                path: "/team",
              },
            },
          },
          function (error, data) {
            if (error) {
              console.error(error.message);
            } else {
              console.log("");
            }
          }
        );
      });
    }
  });
});

router.post("/updateTeamNotif", (req, res) => {
  console.log("in update team notification");
  const { teamName, teamLead, members, oldteamName, oldteamLead, oldmembers } =
    req.body;

  //name change
  members.push(teamLead);
  if (teamName !== oldteamName) {
    members.forEach(function (member) {
      try {
        Emp.findOneAndUpdate(
          { _id: member },
          {
            $push: {
              notifications: {
                msg: `"${oldteamName}" has been changed to "${teamName}"`,
                path: "/team",
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
  }

  //if teamlead change
  if (oldteamLead !== teamLead) {
    Emp.findOneAndUpdate(
      { _id: teamLead },
      {
        $push: {
          notifications: {
            msg: `You have been added in team "${teamName}" as a Team Lead`,
            path: "/team",
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
  }

  //if members added or removed
  members.pop();
  let newMembers = [...members, ...oldmembers];

  let unique = [];
  newMembers.forEach((element) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
  });

  let old = unique.filter((val) => !members.includes(val));
  let New = unique.filter((val) => !oldmembers.includes(val));

  old.forEach((o) => {
    Emp.findOneAndUpdate(
      { _id: o },
      {
        $push: {
          notifications: {
            msg: `You have been removed from team "${teamName}"`,
            path: "/team",
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
  });

  New.forEach((n) => {
    Emp.findOneAndUpdate(
      { _id: n },
      {
        $push: {
          notifications: {
            msg: `You have been added in team "${teamName}"`,
            path: "/team",
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
  });
});

//admin mai bhi add krni hai for Meetings
//Meeting set
router.post("/setMeetingNotif", (req, res) => {
  console.log("in set meeting notification");
  let { hostedBy, hostedById, title, employees } = req.body;
  const message = `You have been added in meeting ${title} by ${hostedBy}`;
  console.log(employees);
  employees.pop();
  employees.forEach((e) => {
    Emp.findOneAndUpdate(
      { username: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allMeetings",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { username: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allMeetings",
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
  });
});

router.post("/deleteMeetingNotif", (req, res) => {
  myVid.findById(req.body.id, (err, resp) => {
    resp.employees.pop();

    resp.employees.forEach((e) => {
      Emp.findOneAndUpdate(
        { _id: e },
        {
          $push: {
            notifications: {
              msg: `Meeting ${resp.title} has been deleted by ${resp.hostedBy}`,
              path: "/allMeetings",
            },
          },
        },
        (err, res) => {
          if (err) console.error(err.message);
          console.log();
        }
      );
      Admin.findOneAndUpdate(
        { _id: e },
        {
          $push: {
            notifications: {
              msg: `Meeting ${resp.title} has been deleted by ${resp.hostedBy}`,
              path: "/allMeetings",
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
    });
  });
});

//board shared with you

router.post("/boardSharedNotif", (req, res) => {
  console.log("In Shared Board");
  const { bid, sharewith, user, title } = req.body;

  const message = `Board ${title} has been shared with you by ${user}`;

  sharewith.forEach((e) => {
    Emp.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  });
});

//delete board

router.post("/deleteBoardSharedNotif", (req, res) => {
  console.log("In deltee Shared Board");
  const { creator, online, title, sharewith, user } = req.body;

  sharewith.push(online);
  sharewith.push(creator);
  let newShare = sharewith.filter((e) => e !== online);
  const message = `Board ${title} has been deleted! by ${user}`;

  newShare.forEach((e) => {
    Emp.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  });
});

//board name change
router.post("/boardNameChangeNotif", (req, res) => {
  console.log("In change name Shared Board");
  const { creator, online, oldTitle, title, sharewith } = req.body;
  console.log(oldTitle, title, sharewith);
  const message = `Board ${oldTitle} is renamed as ${title}`;

  sharewith.push(online);
  sharewith.push(creator);
  let newShare = sharewith.filter((e) => e !== online);

  newShare.forEach((e) => {
    Emp.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  });
});

router.post("/listAddedNotif", (req, res) => {
  console.log("list addded notification");

  const { creator, online, boardName, listTitle, sharewith, user } = req.body;

  const message = `${listTitle} is added in ${boardName} by ${user}`;

  sharewith.push(online);
  sharewith.push(creator);
  let newShare = sharewith.filter((e) => e !== online);

  newShare.forEach((e) => {
    Emp.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  });
});

router.post("/deleteListAddedNotif", (req, res) => {
  console.log("list addded notification");

  const { creator, online, boardName, listTitle, sharewith, user } = req.body;

  const message = `${listTitle} has been deleted in ${boardName} by ${user}`;

  sharewith.push(online);
  sharewith.push(creator);
  let newShare = sharewith.filter((e) => e !== online);

  newShare.forEach((e) => {
    Emp.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  });
});

router.post("/listNameChangeNotif", (req, res) => {
  console.log("list addded notification");

  const { creator, online, oldTitle, title, boardName, sharewith, user } =
    req.body;

  const message = `${oldTitle} is changed to ${title} in ${boardName} by ${user}`;

  sharewith.push(online);
  sharewith.push(creator);
  let newShare = sharewith.filter((e) => e !== online);

  newShare.forEach((e) => {
    Emp.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
    Admin.findOneAndUpdate(
      { _id: e },
      {
        $push: {
          notifications: {
            msg: message,
            path: "/allBoards",
          },
        },
      },
      (error, data) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log();
        }
      }
    );
  });
});

router.post("/addedInProjectNotif", async (req, res) => {
  console.log("In Project Added Notificaion");
  const { projectId, emps } = req.body;
  //console.log(projectId, emps);

  let project = await myProject.findOne({ _id: projectId });
  let name = project.projectName;
  let oldMembers = project.projectAssignedTo;

  let newMembers = [...emps, ...oldMembers];

  let unique = [];
  newMembers.forEach((element) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
  });

  console.log("old: ", oldMembers);
  console.log("NEW;: ", emps);
  let old = unique.filter((val) => !emps.includes(val.toString()));
  let New = unique.filter((val) => !oldMembers.includes(val));

  console.log("Old: ", old);
  console.log("New: ", New);

  old.forEach((o) => {
    Emp.findOneAndUpdate(
      { _id: o },
      {
        $push: {
          notifications: {
            msg: `You have been removed from project "${name}"`,
            path: "/projects",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
  });

  New.forEach((n) => {
    Emp.findOneAndUpdate(
      { _id: n },
      {
        $push: {
          notifications: {
            msg: `You have been Added in project "${name}"`,
            path: "/projects",
          },
        },
      },
      (err, res) => {
        if (err) console.error(err.message);
        console.log();
      }
    );
  });
});

router.post("/messagenotification", (req, res) => {
  // console.log(req.body);
  // find receiver id in admin or emp and post in their notification
  var myObj = {
    msg: req.body.msg,
    flag: 0,
    path: req.body.path,
  };
  Emp.findOneAndUpdate(
    { _id: req.body.receiverId },
    { $push: { notifications: myObj } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
      // res.status(200).json(rec);
    }
  );
  Admin.findOneAndUpdate(
    { _id: req.body.receiverId },
    { $push: { notifications: myObj } },
    { new: true },
    (err, rec) => {
      if (err) res.status(500).json(err);
    }
  );
  res.status(200).json("success");
});

router.post("/readall", (req, res) => {
  // console.log(req.body);
  req.body.notifications.forEach((obj) => {
    // console.log(obj);
    Emp.findOneAndUpdate(
      { _id: req.body.userId, "notifications._id": obj._id },
      { $set: { "notifications.$.flag": 1 } },
      (err, rec) => {
        if (err) res.status(500).json(err);
      }
    );
    Admin.findOneAndUpdate(
      { _id: req.body.userId, "notifications._id": obj._id },
      { $set: { "notifications.$.flag": 1 } },
      (err, rec) => {
        if (err) res.status(500).json(err);
      }
    );
  });
  res.status(200).json("Success");
});
module.exports = router;
