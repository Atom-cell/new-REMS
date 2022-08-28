import React, { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./ProtectedRoutes";
import VideoCall from "./Meetings/VideoCall";
import MyCalendar from "./Calendar/MyCalendar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
import SetMeeting from "./Meetings/SetMeeting";
import ConferenceCall from "./Meetings/ConferenceCall";
import Messenger from "./Chat/Messenger";
import AllMeetings from "./Meetings/AllMeetings";
import NavBar from "./Componentss/NavBar";

import LandPage from "./components/LandPage";
import MoreFeatures from "./components/MoreFeatures";
import Download from "./components/Download";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import UpdateProfile from "./components/UpdateProfile";
import NoMobile from "./components/NoMobile";
import EmpManage from "./components/EmpManage";
import MoreInfo from "./components/MoreInfo";
import Log from "./components/Log";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import AllProjects from "./Projects/AllProjects";
import AllBoards from "./Boards/AllBoards";
import Boards from "./Boards/Boards";
// import ProjectInfo from "./Projects/ProjectInfo";
const socket = io.connect("http://localhost:8900");

const App = () => {
  const [nav, setNav] = useState(false);
  const [username, setUsername] = useState();
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [onlineUsers, setOnlineUsers] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const notify = (name) => {
    toast(`${name} sent you a new Message`);
  };

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user.username);
    setUsername(loggedUser?.username);
    if (localStorage.getItem("email")) {
      socket.emit("addUser", loggedUser?._id);
      setNav(true);
    }
  }, []);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        senderName: data.senderName,
        text: data.text,
        image: data.image,
        createdAt: Date.now(),
      });
      if (window.location.href != "http://localhost:3000/myMessenger") {
        notify(data.senderName);
      }
    });
  }, []);

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("addUser", loggedUser?._id);
    socket.on("getUsers", (users) => {
      // console.log(users);
      const usersWithoutMe = users?.filter(
        (user) => user?.userId != loggedUser?._id
      );
      // console.log(usersWithoutMe);
      setOnlineUsers(usersWithoutMe);
    });
  }, [loggedUser]);

  // when new message recieve send alert
  // useEffect(() => {
  //   socket.on("getMessage", (data) => {
  //     notify();
  //     // setArrivalMessage({
  //     //   sender: data.senderId,
  //     //   text: data.text,
  //     //   createdAt: Date.now(),
  //     // });
  //   });
  // }, []);

  return (
    <Router>
      {nav ? <NavBar /> : null}
      <Routes>
        <Route exact path="/" element={<LandPage />} />
        <Route path="/home" element={<LandPage />} />
        <Route path="/features" element={<MoreFeatures />} />
        <Route path="/download" element={<Download />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ResetPassword />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empDashboard" element={<EmployeeDashboard />} />
          <Route path="/update" element={<UpdateProfile />} />
          <Route path="/no" element={<NoMobile />} />
          <Route path="/empManage" element={<EmpManage />} />
          <Route path="/moreInfo" element={<MoreInfo />} />
          <Route path="/log" element={<Log />} />
          <Route
            path="/myCalendar"
            element={
              username ? <MyCalendar username={username} /> : console.log("")
            }
          />
          <Route
            path="/myTeamCalendar"
            element={
              username ? <MyCalendar username={username} /> : console.log("")
            }
          />
          <Route
            path="/videoCall"
            element={
              <VideoCall
                onlineUsers={onlineUsers}
                setOnlineUsers={setOnlineUsers}
              />
            }
          />
          <Route
            path="/allMeetings/:roomId"
            element={
              username ? (
                <ConferenceCall username={username} />
              ) : (
                console.log("")
              )
            }
          />
          <Route exact path="/setMeeting" element={<SetMeeting />} />
          <Route
            path="/myMessenger"
            element={
              <Messenger
                onlineUsers={onlineUsers}
                setOnlineUsers={setOnlineUsers}
                notify={notify}
                arrivalMessage={arrivalMessage}
                setArrivalMessage={setArrivalMessage}
              />
            }
          />
          <Route path="/allMeetings" element={<AllMeetings />} />
          <Route path="/projects" element={<AllProjects user={loggedUser} />} />
          <Route path="/allboards" element={<AllBoards user={loggedUser} />} />
          <Route path="/boards/:bid" element={<Boards user={loggedUser} />} />
          {/* <Route path="/projects/project/:pid" element={<ProjectInfo user={loggedUser} />} /> */}
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
