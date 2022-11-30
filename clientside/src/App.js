import React, { useState, useEffect, useRef } from "react";
import { ProjectNameContext } from "./Helper/Context";
import { TimerContext } from "./Helper/Context";
import { MoreInfoContext } from "./Helper/Context";
import { SocketContext } from "./Helper/Context";
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
import SidebarMenu from "./Componentss/SidebarMenu";
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
import AllPayroll from "./Financials/AllPayroll";
import AllInvoice from "./Financials/AllInvoice";
import NewPayroll from "./Financials/NewPayroll";
import PayrollDetails from "./Financials/PayrollDetails";
import NewInvoice from "./Financials/NewInvoice";
import InvoiceDetails from "./Financials/InvoiceDetails";
import Invoice from "./Financials/Invoice";
import DownloadInvoice from "./Financials/DownloadInvoice";
import axios from "axios";
const socket = io.connect("http://localhost:8900");
// import ProjectInfo from "./Projects/ProjectInfo";

const App = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  // const navigate = useNavigate();
  const [userStream, setUserStream] = useState();

  const [enabledVideo, setEnabledVideo] = useState();
  const [friend, setFriend] = useState();
  const [userEnabledVideo, setUserEnabledVideo] = useState();
  const [isOpenVideoModal, setIsOpenVideoModal] = useState(false);
  const [name, setName] = useState(null);
  const [role, setRole] = useState();
  const [timer, setTimer] = useState(false);
  const [sock, setSocket] = useState(null);
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
        name: loggedUser.username,
      });
    });
    peer.on("stream", (stream) => {
      console.log("Streammmmmmmm");
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
    // navigate("/videoCall");
  };

  const callUser = (user) => {
    setFriend(user);
    setIsOpenVideoModal(true);
    // console.log(id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: user._id,
        signalData: data,
        from: JSON.parse(localStorage.getItem("user"))._id,
        name: JSON.parse(localStorage.getItem("user")).username,
        enabledVideo: enabledVideo,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
      setUserStream(stream);
    });
    socket.on("callAccepted", (signal, name) => {
      console.log("CallAccepted");
      setCallAccepted(true);
      setReceivingCall(false);
      setCallerName(name);
      peer.signal(signal);
      setIsOpenVideoModal(false);
    });

    connectionRef.current = peer;
  };

  const rejectCall = () => {
    // receivingCall && !callAccepted ?
    setReceivingCall(false);
    setCallAccepted(false);
    setReceivingCall(false);
    // friendId, userId, name
    console.log(both);
    console.log(caller);
    console.log(user);
    let otherId = "";
    if (!caller) {
      otherId = both.find((usr) => usr !== user._id);
      socket.emit("rejectCall", otherId, loggedUser._id, name);
    } else socket.emit("rejectCall", caller, loggedUser._id, name);
  };

  const notify = (name) => {
    toast(`${name} sent you a new Message`);
  };

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user.username);

    setSocket(socket);
    setUsername(loggedUser?.username);
    if (localStorage.getItem("email")) {
      socket.emit("addUser", {
        userId: loggedUser?._id,
        email: loggedUser?.email,
      });
      setNav(true);
      //socket.emit("notification", localStorage.getItem("email"));
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
      fetchData();
      if (window.location.href !== "http://localhost:3000/myMessenger") {
        notify(data.senderName);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("callUser", (data) => {
      console.log("callUser data");
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
      setUserEnabledVideo(data.enabledVideo);
    });

    socket.on("setBothCallers", (data) => {
      console.log("Both callers Id:");
      console.log(data);
      setBoth([data.to, data.from]);
    });

    socket.on("cutCallInBetween", (name) => {
      setReceivingCall(false);
      toast.info(`${name} Cut the Call`);
    });

    socket.on("callRejected", (friend, name) => {
      // callAccepted && !callEnded
      console.log("Call Rejected");
      toast.info(`Call Declined`);
      setIsOpenVideoModal(false);
    });
    socket.on("leaveCallId", (friend, name) => {
      // callAccepted && !callEnded
      // console.log(name);
      toast.info(`${name} Ended the call`);
      // window.location.reload();
      setCallAccepted(false);
      // navigate("/dashboard");
    });

    socket.on("callRejected", (friend, name) => {
      // callAccepted && !callEnded
      console.log("Call Rejected");
      toast.info(`Call Declined`);
      setIsOpenVideoModal(false);
    });
  }, []);

  useEffect(() => {
    setSocket(socket);
    const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("addUser", { userId: loggedUser?._id, email: user?.email });
    socket.on("getUsers", (users) => {
      // console.log(users);
      const usersWithoutMe = users?.filter(
        (user) => user?.userId !== loggedUser?._id
      );
      // console.log(usersWithoutMe);
      setOnlineUsers(usersWithoutMe);
    });
  }, [loggedUser]);

  const fetchData = async () => {
    let id = localStorage.getItem("id");
    await axios.get(`/notif/getNotif/${id}`).then((rec) => {
      //   console.log(rec.data);
      // filter notifications that has message word or call word
      var sum = 0;
      var messageNotifications = rec.data.filter((notif) => {
        if (notif.msg.includes("Message")) {
          if (notif.flag === 0) sum = sum + 1;
          return notif;
        }
      });
      console.log(messageNotifications);
      console.log(sum);
      setAllNotifications(messageNotifications);
      setUnreadNotifications(sum);
    });
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <SocketContext.Provider value={{ sock, setSocket }}>
        <ProjectNameContext.Provider value={{ name, setName }}>
          <TimerContext.Provider value={{ timer, setTimer }}>
            <MoreInfoContext.Provider value={{ moreInfo, setMoreInfo }}>
              <Router>
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
                      <div className="video-call-outside">
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
                          userEnabledVideo={userEnabledVideo}
                          setUserEnabledVideo={setUserEnabledVideo}
                          isOpenVideoModal={isOpenVideoModal}
                          setIsOpenVideoModal={setIsOpenVideoModal}
                          setFriend={setFriend}
                          friend={friend}
                          enabledVideo={enabledVideo}
                          setEnabledVideo={setEnabledVideo}
                          setUserStream={setUserStream}
                          callUser={callUser}
                        />
                      </div>
                    )}
                  </>
                )}
                {/* Landpage NAV */}
                {!nav ? <NavigationBar /> : null}
                {/* loggedin NAV */}
                {nav ? <NavBar /> : null}
                {!nav ? (
                  <Routes>
                    <>
                      <Route exact path="/" element={<LandPage />} />
                      <Route path="/home" element={<LandPage />} />
                      <Route path="/features" element={<MoreFeatures />} />
                      <Route path="/download" element={<Download />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/forget" element={<ResetPassword />} />
                    </>
                  </Routes>
                ) : (
                  <SidebarMenu
                    fetchData={fetchData}
                    allNotifications={allNotifications}
                    setAllNotifications={setAllNotifications}
                    unreadNotifications={unreadNotifications}
                    setUnreadNotifications={setUnreadNotifications}
                  >
                    <Routes>
                      {role === "admin" ? (
                        <Route path="/dashboard" element={<Dashboard />} />
                      ) : role === "Employee" ? (
                        <Route
                          path="/myCalendar"
                          element={
                            loggedUser && <MyCalendar user={loggedUser} />
                          }
                        /> // EMP DASHBOARD
                      ) : (
                        <>
                          <Route exact path="/" element={<LandPage />} />
                          <Route path="/home" element={<LandPage />} />
                          <Route path="/features" element={<MoreFeatures />} />
                          <Route path="/download" element={<Download />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/forget" element={<ResetPassword />} />
                        </>
                      )}
                      <Route element={<ProtectedRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/empDashboard"
                          element={<EmployeeDashboard />}
                        />
                        <Route path="/update" element={<UpdateProfile />} />
                        <Route path="/no" element={<NoMobile />} />
                        <Route path="/empManage" element={<EmpManage />} />
                        <Route path="/moreInfo" element={<MoreInfo />} />
                        <Route path="/log" element={<Log />} />
                        <Route path="/team" element={<Teams />} />
                        <Route path="/createTeam" element={<CreateTeam />} />
                        <Route
                          path="/teamInfo"
                          element={<TeamInfo user={loggedUser} />}
                        />
                        <Route
                          path="/myCalendar"
                          element={
                            loggedUser && <MyCalendar user={loggedUser} />
                          }
                        />
                        <Route
                          path="/myTeamCalendar"
                          element={
                            loggedUser && <MyCalendar user={loggedUser} />
                          }
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
                              userEnabledVideo={userEnabledVideo}
                              setUserEnabledVideo={setUserEnabledVideo}
                              isOpenVideoModal={isOpenVideoModal}
                              setIsOpenVideoModal={setIsOpenVideoModal}
                              setFriend={setFriend}
                              friend={friend}
                              enabledVideo={enabledVideo}
                              setEnabledVideo={setEnabledVideo}
                              setUserStream={setUserStream}
                              callUser={callUser}
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

                        <Route
                          path="/allpayroll"
                          element={<AllPayroll user={loggedUser} />}
                        />
                        <Route
                          path="/allpayroll/newpayroll"
                          element={<NewPayroll user={loggedUser} />}
                        />
                        <Route
                          path="/allpayroll/payrolldetails"
                          element={<PayrollDetails user={loggedUser} />}
                        />
                        <Route
                          path="/allpayroll/generateinvoice"
                          element={<Invoice user={loggedUser} />}
                        />

                        <Route
                          path="/allinvoice"
                          element={<AllInvoice user={loggedUser} />}
                        />
                        <Route
                          path="/allinvoice/newinvoice"
                          element={<NewInvoice user={loggedUser} />}
                        />
                        <Route
                          path="/allinvoice/invoicedetails"
                          element={<InvoiceDetails user={loggedUser} />}
                        />
                        <Route
                          path="/allinvoice/downloadinvoice"
                          element={<DownloadInvoice user={loggedUser} />}
                        />
                      </Route>
                    </Routes>
                  </SidebarMenu>
                )}

                <ToastContainer />
              </Router>
            </MoreInfoContext.Provider>
          </TimerContext.Provider>
        </ProjectNameContext.Provider>
      </SocketContext.Provider>
    </>
  );
};

export default App;
