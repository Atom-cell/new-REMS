import React, { useState, useEffect, useRef } from "react";
import { ProjectNameContext } from "./Helper/Context";
import { TimerContext } from "./Helper/Context";
import { MoreInfoContext } from "./Helper/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./ProtectedRoutes";
import VideoCall from "./Meetings/VideoCall";
import MyCalendar from "./Calendar/MyCalendar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
// import SetMeeting from "./Meetings/SetMeeting";
import ConferenceCall from "./Meetings/ConferenceCall";
import Messenger from "./Chat/Messenger";
import AllMeetings from "./Meetings/AllMeetings";
import NavBar from "./Componentss/NavBar";
import NavigationBar from "./components/NavigationBar";

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
import Teams from "./Team/Teams";
import CreateTeam from "./Team/CreateTeam";
import TeamInfo from "./Team/TeamInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import AllProjects from "./Projects/AllProjects";
import AllBoards from "./Boards/AllBoards";
import Boards from "./Boards/Boards";
import CallNotification from "./CallNotification";
import Peer from "simple-peer";
import SpecificProject from "./Projects/SpecificProject";
// import ProjectInfo from "./Projects/ProjectInfo";
const socket = io.connect("http://localhost:8900");

const App = () => {
  // const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [role, setRole] = useState();
  const [timer, setTimer] = useState(false);
  const [moreInfo, setMoreInfo] = useState(null);
  const [nav, setNav] = useState(false);
  const [username, setUsername] = useState();
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [onlineUsers, setOnlineUsers] = useState();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // video call use states
  const [receivingCall, setReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callerName, setCallerName] = useState("");

  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [user, setUser] = useState();
  const userVideo = useRef();
  const [callerSignal, setCallerSignal] = useState();
  const connectionRef = useRef();
  const [both, setBoth] = useState();

  const answerCall = () => {
    setCallAccepted(true);
    // window.history.pushState({}, null, "http://localhost:3000/videoCall");
    setReceivingCall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      // console.log("Signal");
      socket.emit("answerCall", {
        signal: data,
        to: caller,
        name: user.username,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    // navigate("/videoCall");
  };

  const rejectCall = () => {
    // receivingCall && !callAccepted ?
    setReceivingCall(false);
    setCallAccepted(false);
    setReceivingCall(false);
    let otherId = "";
    if (!caller) {
      otherId = both.find((usr) => usr !== user._id);
      socket.emit("rejectCall", otherId, user._id, name);
    } else socket.emit("rejectCall", caller, user._id, name);
  };

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
    if (localStorage.getItem("role")) {
      const role = localStorage.getItem("role");
      console.log("ROLE: ", role);
      setRole(role);
    }
  }, []);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        senderName: data.senderName,
        text: data.text,
        Image: data.Image,
        createdAt: Date.now(),
      });
      if (window.location.href !== "http://localhost:3000/myMessenger") {
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
        (user) => user?.userId !== loggedUser?._id
      );
      // console.log(usersWithoutMe);
      setOnlineUsers(usersWithoutMe);
    });
  }, [loggedUser]);

  return (
    <>
      <ProjectNameContext.Provider value={{ name, setName }}>
        <TimerContext.Provider value={{ timer, setTimer }}>
          <MoreInfoContext.Provider value={{ moreInfo, setMoreInfo }}>
            <Router>
              {nav ? <NavBar /> : null}
              {!nav ? <NavigationBar /> : null}
              <CallNotification
                callAccepted={callAccepted}
                callerName={callerName}
                answerCall={answerCall}
                rejectCall={rejectCall}
                receivingCall={receivingCall}
              />
              {callAccepted && (
                <>
                  {window.location.href.indexOf(
                    "http://localhost:3000/videoCall"
                  ) > -1 ? null : (
                    <VideoCall
                      onlineUsers={onlineUsers}
                      setOnlineUsers={setOnlineUsers}
                      receivingCall={receivingCall}
                      setReceivingCall={setReceivingCall}
                      callAccepted={callAccepted}
                      setCallAccepted={setCallAccepted}
                      callerName={callerName}
                      setCallerName={setCallerName}
                      answerCall={answerCall}
                      rejectCall={rejectCall}
                      stream={stream}
                      userVideo={userVideo}
                      connectionRef={connectionRef}
                      caller={caller}
                      setCaller={setCaller}
                      both={both}
                      user={user}
                      setUser={setUser}
                      setStream={setStream}
                      setCallerSignal={setCallerSignal}
                      setBoth={setBoth}
                    />
                  )}
                </>
              )}
              <Routes>
                {role === "admin" ? (
                  <Route path="/dashboard" element={<Dashboard />} />
                ) : role === "Employee" ? (
                  <Route
                    path="/myCalendar"
                    element={loggedUser && <MyCalendar user={loggedUser} />}
                  /> // EMP DASHBOARD
                ) : (
                  <Route exact path="/" element={<LandPage />} />
                )}
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
                  <Route path="/team" element={<Teams />} />
                  <Route path="/createTeam" element={<CreateTeam />} />
                  <Route path="/teamInfo" element={<TeamInfo />} />
                  <Route
                    path="/myCalendar"
                    element={loggedUser && <MyCalendar user={loggedUser} />}
                  />
                  <Route
                    path="/myTeamCalendar"
                    element={loggedUser && <MyCalendar user={loggedUser} />}
                  />
                  <Route
                    path="/videoCall"
                    element={
                      <VideoCall
                        onlineUsers={onlineUsers}
                        setOnlineUsers={setOnlineUsers}
                        receivingCall={receivingCall}
                        setReceivingCall={setReceivingCall}
                        callAccepted={callAccepted}
                        setCallAccepted={setCallAccepted}
                        callerName={callerName}
                        setCallerName={setCallerName}
                        answerCall={answerCall}
                        rejectCall={rejectCall}
                        stream={stream}
                        userVideo={userVideo}
                        connectionRef={connectionRef}
                        caller={caller}
                        setCaller={setCaller}
                        both={both}
                        user={user}
                        setUser={setUser}
                        setStream={setStream}
                        setCallerSignal={setCallerSignal}
                        setBoth={setBoth}
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
                  {/* <Route exact path="/setMeeting" element={<SetMeeting />} /> */}
                  <Route
                    path="/myMessenger"
                    element={
                      <Messenger
                        onlineUsers={onlineUsers}
                        setOnlineUsers={setOnlineUsers}
                        arrivalMessage={arrivalMessage}
                        user={loggedUser}
                      />
                    }
                  />
                  <Route path="/allMeetings" element={<AllMeetings />} />
                  <Route
                    path="/projects"
                    element={<AllProjects user={loggedUser} />}
                  />
                  <Route
                    path="/myproject/:pid"
                    element={<SpecificProject user={loggedUser} />}
                  />
                  <Route
                    path="/allboards"
                    element={<AllBoards user={loggedUser} />}
                  />
                  <Route
                    path="/boards/:bid"
                    element={<Boards user={loggedUser} />}
                  />
                  {/* <Route path="/projects/project/:pid" element={<ProjectInfo user={loggedUser} />} /> */}
                </Route>
              </Routes>
              <ToastContainer />
            </Router>
          </MoreInfoContext.Provider>
        </TimerContext.Provider>
      </ProjectNameContext.Provider>
    </>
  );
};

export default App;
