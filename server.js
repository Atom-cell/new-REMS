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
const { v4: uuidV4 } = require("uuid");

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
var myCalendarRouter = require("./routes/myCalendar");
var myHomeRouter = require("./routes/myHome");
var myVideoRouter = require("./routes/myVideo");
var myEmployeeRouter = require("./routes/myEmployee");
var myEmployerRouter = require("./routes/myEmployer");
var myMessagesRouter = require("./routes/myMessages");
var myConversationRouter = require("./routes/myConversation");
const adminRouter = require("./routes/admin.route");
const empRouter = require("./routes/emp.route");
const desktopRouter = require("./routes/desktop.route");

// mount point for routers
app.use("/", myHomeRouter);
app.use("/myCalendar", myCalendarRouter);
app.use("/myVideo", myVideoRouter);
app.use("/myEmployee", myEmployeeRouter);
app.use("/myEmployer", myEmployerRouter);
app.use("/myConversation", myConversationRouter);
app.use("/myMessages", myMessagesRouter);
app.use("/admin", adminRouter);
app.use("/emp", empRouter);
app.use("/desk", desktopRouter);

io.on("connection", (socket) => {
  // listen for an event join_room
  socket.on("join-room", (roomId, userId) => {
    // console.log("Rooom Joinedddd");
    socket.join(roomId);
    // when someone joins the room we need to tell all the users that another user has joined the room
    // Here is the user id that has connected
    socket.to(roomId).broadcast.emit("user-connected", userId);

    // messages
    socket.on("message", (message) => {
      //send message to the same room
      io.to(roomId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });

  socket.emit("me", socket.id);

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // Sanii

  socket.on("Email", (data) => {
    sock[data] = socket.id;
    console.log("SOCKET EMAIL", data, " : ", sock[data]);
  });

  // console.log("ID ", socket.id);
  // sock["sani"] = socket.id;

  //receive from client
  socket.on("sending", (data) => {
    socket.send("hdhdhd");
    console.log("Yo! ", data);
  });

  // io.to(socket.id).emit("Ex", `Exclsusive Message ${Math.random(100)}`);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    //delete socket[]
  });

  socket.on("fromCLIENT", (data) => {
    console.log("DATA: ", data);
  });
});

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
