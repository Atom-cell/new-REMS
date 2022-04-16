const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
// import mongoose
const mongoose = require("mongoose");
var bodyParser = require('body-parser')
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

// mongoose connection
var mongoDB = "mongodb://127.0.0.1/fyp";
mongoose.connect(mongoDB, (err) => {
  if (err) throw err;
  console.log("Database Connected");
});

app.use(cors());
// parse application/json
app.use(bodyParser.json())

// all routers
var myCalendarRouter = require("./routes/myCalendar");
var myHomeRouter = require("./routes/myHome");
var myVideoRouter = require("./routes/myVideo");

// mount point for routers
app.use("/", myHomeRouter);
app.use("/myCalendar", myCalendarRouter);
app.use("/myVideo", myVideoRouter);

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("join-room", (roomId,userId) => {
    console.log("RoomID:"+roomId);
    console.log("UserID: "+userId);
  });


  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

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
});

server.listen(5000, () => console.log("server is running on port 5000"));
