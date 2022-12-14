const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// methods for real time messages
let users = [];
let sock = {};
let notif = {};
let conferenceCallUsers = [];

const addUserToConference = (roomId, userId, username, socketId) => {
  if (socketId && userId) {
    // update users array with new socket id
    // if user is same and socket id is different then assign the new socket id to the user
    conferenceCallUsers.forEach((user, index) => {
      if (user.userId == userId && user.socketId != socketId) {
        conferenceCallUsers[index] = { roomId, userId, username, socketId };
      }
    });
    // check whether the userId is in array or not
    !conferenceCallUsers.some((user) => user.userId === userId) &&
      conferenceCallUsers.push({ roomId, userId, username, socketId });
    // console.log("ADDED USERS");
    // console.log(users);
  }
};

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
    // console.log("ADDED USERS");
    // console.log(users);
  }
};

const removeUserFromConference = (userId) => {
  conferenceCallUsers = conferenceCallUsers.filter(
    (user) => user.userId !== userId
  );
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUserFromConference = (userId) => {
  return conferenceCallUsers.find((user) => user.userId === userId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // console.log("User connected: ", socket.id);
  // console.table(notif);

  // listen for an event join_room
  socket.on("join-room", (roomId, userId, username) => {
    // console.log("Rooom Joinedddd");
    socket.join(roomId);
    addUserToConference(roomId, userId, username, socket.id);
    // when someone joins the room we need to tell all the users that another user has joined the room
    // Here is the user id that has connected

    // console.log(conferenceCallUsers);
    // socket.to(roomId).emit("all-users", conferenceCallUsers);

    socket.to(roomId).emit("user-connected", userId, username);

    //Get Conference Users
    socket.on("getConferenceUsers", (roomId) => {
      io.to(roomId).emit("conferenceUsers", conferenceCallUsers);
    });

    // messages
    socket.on("message", (message, username) => {
      //send message to the same room
      io.to(roomId).emit("createMessage", message, username);
    });

    socket.on("disconnect", () => {
      removeUserFromConference(userId);
      socket.broadcast.to(roomId).emit("user-disconnected", userId, username);
    });
  });

  // One to One Video Call
  socket.emit("me", socket.id);

  //Get User Socket id
  // socket.on("getUserSocketId", (friendId, userId) => {
  //   console.log("GET USER SOCKET ID");
  //   const friend = getUser(friendId);
  //   const user = getUser(userId);
  //   // console.log(user);
  //   // console.log(friend);
  //   io.to(user?.socketId).emit("userSocketId", friend);
  //   // io.emit("getUsers", users);
  // });

  socket.on("callUser", (data) => {
    console.log("CALL USER");
    // console.log(users);
    console.log(data.name);
    console.log(data.from);
    // now get the socket id of the user to call
    const user = getUser(data.userToCall);
    console.log(user);
    console.log(users);
    const friend = getUser(data.from);

    io.to(user.socketId).emit("callUser", {
      signal: data.signalData,
      from: friend.socketId,
      name: data.name,
      enabledVideo: data.enabledVideo,
    });

    // so that both callers can end the call
    io.to(user.socketId).to(friend.socketId).emit("setBothCallers", {
      from: friend.socketId,
      to: user.socketId,
    });
  });

  socket.on("cutCallInBetween", (id, name) => {
    console.log(name);
    const user = getUser(id);
    console.log(user);
    io.to(user.socketId).emit("cutCallInBetween", name);
  });

  socket.on("answerCall", (data) => {
    // console.log("answerCall");
    // console.log(data.to);
    io.to(data.to).emit("callAccepted", data.signal, data.name);
  });

  socket.on("leaveCall", (friendId, userId, name) => {
    // console.log(userId);
    // console.log(friendId);
    // const friend = getUser(friendId);
    const user = getUser(userId);
    io.to(friendId).emit("leaveCallId", user, name);
  });

  socket.on("rejectCall", (friendId, userId, name) => {
    console.log("rejectCall");
    console.log(name);
    console.log(friendId);
    console.log(userId);
    // const friend = getUser(friendId);
    const user = getUser(userId);
    console.log(user);
    io.to(friendId).emit("callRejected", user, name);
  });

  // end of one to one video call

  // Sanii

  socket.on("Email", (data) => {
    sock[data] = socket.id;
    // console.log("SOCKET EMAIL", data, " : ", sock[data]);
  });

  // console.log("ID ", socket.id);
  // sock["sani"] = socket.id;

  //receive from client
  socket.on("sending", (data) => {
    socket.send("hdhdhd");
    // console.log("Yo! ", data);
  });

  // io.to(socket.id).emit("Ex", `Exclsusive Message ${Math.random(100)}`);

  // socket.on("disconnect", () => {
  //   console.log("disconnected", socket.id);
  //   //delete socket[]
  // });

  socket.on("fromCLIENT", (data) => {
    // console.log("DATA: ", data);
  });

  // MESSENGERRR
  // console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", ({ userId, email }) => {
    console.log("ADD USERSS :", userId, " SOcket ID: ", socket.id);
    addUser(userId, socket.id);
    notif[userId] = socket.id;
    // console.table(notif);

    console.log(users);
    io.emit("getUsers", users);
  });

  ///////////////////////////////////
  ///////  NOTIFICATIONS  ////////////
  //////////////////////////////////
  socket.on("test", ({ data, id }) => {
    // console.log("EMail ", data, "id: ", id);
    // console.log("UserID: ", notif[id]);

    io.to(notif[id]).emit("TEST", "true");
  });

  socket.on("TeamAdded", ({ teamName, members }) => {
    console.log("team added ");
    members.forEach((m) => {
      io.to(notif[m]).emit(
        "TeamAdded",
        `You have been added in Team ${teamName}`
      );
    });
  });

  socket.on("boo", () => {
    console.log("BOO");
    io.to("628600c5bfaa78c7d2eb29d4").emit("boo");
  });

  socket.on("TeamDelete", ({ teamName, members }) => {
    console.log("team delete ", teamName, members);

    members.forEach((m) => {
      io.to(notif[m._id]).emit(
        "TeamDelete",
        `Team ${teamName} has been deleted`
      );
    });
  });

  socket.on("MeetingSet", ({ hostedBy, title, employees }) => {
    console.log("meeting set ");
    employees.forEach((m) => {
      io.to(notif[m]).emit(
        "MeetingSet",
        `You have been added in meeting ${title} by ${hostedBy}`
      );
    });
  });

  socket.on("MeetingDelete", ({ title, employees }) => {
    console.log("delete meeting");
    employees.forEach((m) => {
      io.to(notif[m]).emit(
        "MeetingDelete",
        `meeting ${title} has been deleted`
      );
    });
  });

  socket.on("BoardShare", ({ employees, title, user }) => {
    // console.log("Baord share");
    employees.forEach((m) => {
      io.to(notif[m]).emit(
        "BoardShare",
        `Board ${title} has been shared with you by ${user}`
      );
    });
  });

  socket.on("BoardDelete", ({ creator, online, title, sharewith, user }) => {
    // console.log("Board deltet");
    sharewith.push(online);
    sharewith.push(creator);
    let newShare = sharewith.filter((e) => e !== online);
    newShare.forEach((m) => {
      io.to(notif[m]).emit(
        "BoardDelete",
        `Board ${title} has been deleted by ${user}`
      );
    });
  });

  socket.on("ProjectShared", ({ pName, emps, oldMembers }) => {
    // console.log("In Project Added Notificaion");

    let newMembers = [...emps, ...oldMembers];

    let unique = [];
    newMembers.forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
    });
    let old = unique.filter((val) => !emps.includes(val.toString()));
    let New = unique.filter((val) => !oldMembers.includes(val));

    old.forEach((o) => {
      io.to(notif[o]).emit(
        "ProjectShared",
        `You have been Removed from project "${pName}"`
      );
    });

    New.forEach((n) => {
      io.to(notif[n]).emit(
        "ProjectShared",
        `You have been Added in project "${pName}"`
      );
    });
  });

  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////

  //send and get message
  socket.on(
    "sendMessage",
    ({ senderId, senderName, receiverId, text, Image }) => {
      // console.log("REciever ID:" + receiverId);
      // console.log(senderName);
      const user = getUser(receiverId);
      // console.log("USER:" + user);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        senderName,
        text,
        Image,
      });
    }
  );

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!: ", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("Login", (data) => {
    console.log("user: ", data, " ", socket.id);
  });

  //C####

  socket.emit("me", socket.id);

  socket.on("Email", (data) => {
    sock[data] = socket.id;
    // console.log("SOCKET EMAIL", data, " : ", sock[data]);
  });

  socket.on("StartSS", (email) => {
    // console.log("STARTING SSS");
    // console.log("EMAIL ", email);
    let e = email;
    let a = sock[e];
    console.log("Sending START signal to turn ON SS", a);
    io.to(a).emit("SSStart", "true");
  });

  socket.on("StopSS", (email) => {
    console.log("STOPING SSS");
    console.log("EMAIL ", email);
    let e = email;
    let a = sock[e];
    console.log("Sending STOP signal to turn OFF SS", a);
    io.to(a).emit("SSStop", "true");
  });
});
