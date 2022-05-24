import React, { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";

import VideoCall from "./Meetings/VideoCall";
import MyCalendar from "./Calendar/MyCalendar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
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

const App = () => {
  const [nav, setNav] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("email")) {
      setNav(true);
    }
  }, []);
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
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/no" element={<NoMobile />} />
        <Route path="/empManage" element={<EmpManage />} />
        <Route path="/moreInfo" element={<MoreInfo />} />
        <Route path="/log" element={<Log />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myCalendar" element={<MyCalendar name="Naseer" />} />
        <Route path="/myTeamCalendar" element={<MyCalendar name="Nasani" />} />
        <Route path="/videoCall" element={<VideoCall />} />
        <Route path="/allMeetings/:roomId" element={<ConferenceCall />} />
        <Route exact path="/setMeeting" element={<SetMeeting />} />
        <Route path="/myMessenger" element={<Messenger />} />
        <Route path="/allMeetings" element={<AllMeetings />} />
      </Routes>
    </Router>
  );
};

export default App;
