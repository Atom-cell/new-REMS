const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// methods for real time messages
let users = [];
const addUser = (userId, socketId) => {
  if (socketId && userId) {
    // update users array with new socket id
    // if user is same and socket id is different then assign the new socket id to the user
    users.forEach((user, index) => {
      if (user.userId == userId && user.socketId != socketId) {
        users[index] = { userId, socketId };
      }
    });
    // check whether the userId is in array or not
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
    console.log("ADDED USERS");
    console.log(users);
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // listen for an event join_room
  socket.on("join-room", (roomId, userId) => {
    console.log("Rooom Joinedddd");
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

  // socket.on("disconnect", () => {
  //   console.log("disconnected", socket.id);
  //   //delete socket[]
  // });

  socket.on("fromCLIENT", (data) => {
    console.log("DATA: ", data);
  });

  // MESSENGERRR
  // console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log("ADD USERSS");
    addUser(userId, socket.id);
    console.log(users);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, senderName, receiverId, text, image }) => {
    // console.log("REciever ID:" + receiverId);
    // console.log(senderName);
    const user = getUser(receiverId);
    // console.log("USER:" + user);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      senderName,
      text,
      image
    });
  });

  //Get User Socket id
  socket.on("getUserSocketId", (friendId, userId) => {
    const friend = getUser(friendId);
    const user = getUser(userId);
    console.log(user);
    console.log(friend);
    io.to(user?.socketId).emit("userSocketId", friend);
    // io.emit("getUsers", users);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
