const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
// import mongoose
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
let sock = {};
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
// const { v4: uuidV4 } = require("uuid");

app.use("/peerjs", peerServer);

// mongoose connection
var mongoDB = "mongodb://127.0.0.1/fyp";
mongoose.connect(mongoDB, (err) => {
  if (err) throw err;
  console.log("Database Connected");
});

app.use(cors());
// parse application/json
app.use(bodyParser.json());

// all routers
const myCalendarRouter = require("./routes/myCalendar");
const myHomeRouter = require("./routes/myHome");
const myVideoRouter = require("./routes/myVideo");
const myEmployeeRouter = require("./routes/myEmployee");
const myEmployerRouter = require("./routes/myEmployer");
const myMessagesRouter = require("./routes/myMessages");
const myConversationRouter = require("./routes/myConversation");
const myProjectRouter = require("./routes/myProject");
const myBoardRouter = require("./routes/myBoards");
const adminRouter = require("./routes/admin.route");
const empRouter = require("./routes/emp.route");
const desktopRouter = require("./routes/desktop.route");
const teamRouter = require("./routes/team.route");

// mount point for routers
app.use("/", myHomeRouter);
app.use("/myCalendar", myCalendarRouter);
app.use("/myVideo", myVideoRouter);
app.use("/myEmployee", myEmployeeRouter);
app.use("/myEmployer", myEmployerRouter);
app.use("/myConversation", myConversationRouter);
app.use("/myMessages", myMessagesRouter);
app.use("/myProjects", myProjectRouter);
app.use("/myBoards", myBoardRouter);
app.use("/admin", adminRouter);
app.use("/emp", empRouter);
app.use("/desk", desktopRouter);
app.use("/team", teamRouter);

// from web visit this route, then on utility it will emit. front se email send. idher email se sock mai se id nikalo or emit krdo usko
app.get("/start/:mail", (req, res) => {
  console.log(req.params.mail);

  let a = sock[req.params.mail];
  console.log("Sending START signal to turn ON SS", a);
  io.to(a).emit("SSStart", "true");
  res.send("hello ");
});

app.get("/stop/:mail", (req, res) => {
  const email = req.params.mail;
  console.log(email);
  let e = email;
  let a = sock[e];
  console.log("Sending STOP signal to turn OFF SS", a);
  io.to(a).emit("SSStop", "true");
  res.send("hello ");
});

server.listen(5000, () => console.log("server is running on port 5000"));
